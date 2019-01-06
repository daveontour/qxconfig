import { XMLElement, XMLAttribute, SaveObj, AttItemConfig } from './../../services/globals';
import { Globals } from '../../services/globals';
import { ItemConfig } from '../../interfaces/interfaces';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { ElementComponent } from '../element/element.component';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})
export class ChoiceComponent extends ElementComponent implements AfterViewInit, OnInit {
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  selectedChoice: string;
  opts: any[] = [];

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.topLevel) {
      // for (var i = 0; i < this.config.minOccurs; i++) {
      //   this.creator.walkSequenceSibling(this);
      //   this.siblingCounter++;
      // }
      // this.siblingCounter = this.config.minOccurs;
      // this.releaseSiblingCounter = true;
    } else {

      this.addAttributes(this.config);
      // for (var i = 0; i < this.config.allOf.length; i++) {
      //   this.creator.walkStructure(this.config.allOf[i], this);
      // }
    }

    // This prevents ExpressionChangedAfterItHasBeenCheckedError
    // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
    // this.cdRef.detectChanges();
  }

  getSiblingsContainer() {
    return this.siblingsPt;
  }

  addSibling() {
    if (this.siblings.length === this.config.maxOccurs) {
      this.global.openModalAlert('You should not see this message :( ', 'Maximum Number of Occurances Already Reached');
      return;
    }
    if (this.topLevel) {
      this.creator.createChoiceSibling(this);
      this.siblingCounter++;
    }
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

    if (this.siblingCounter <= this.config.minOccurs) {
      this.global.openModalAlert('You should not see this message :( ', 'Cannot Remove. At least ' +
        this.config.minOccurs + 'instance required');

      return false;
    }
    for (let i = 0; i < this.siblings.length; i++) {
      const id = this.siblings[i].config.uuid;
      if (id === childIDToRemove) {
        this.siblingsPt.remove(i);
        this.siblings.splice(i, 1);
        this.siblingCounter--;
        break;
      }
    }
  }

  showDeleteAction() {
    return this.parent.siblingCounter > this.config.minOccurs;
  }

  getSaveObj(): SaveObj {

    if (this.topLevel) {
      return null;
    } else {
      const so = new SaveObj();
      so.tl = false;
      so.n = this.config.name;
      so.choice = true;
      so.sel = this.selectedChoice;
      so.p = this.elementPath;

      this.attchildren.forEach(att => {
        so.a.push(new AttItemConfig(att.config.name, att.config.value, att.config.enabled));
      });

      const _this = this;
      if (this.children != null) {
        this.children.forEach((value) => {
          if (value.config.name === _this.selectedChoice) {
            so.c.push(value.getSaveObj());
          }
        });
      }

      return so;
    }
  }

  applyConfig(so: SaveObj) {
    if (so == null) {
      console.log('Apply Config Error - null object');
      return;
    }
    if (this.topLevel) {
      return;
    } else {

      // First set the Attribute of the sequence
      for (let i = 0; i < so.a.length; i++) {
        const att = so.a[i];
        this.attchildren[i].setValue(att.v);
        this.attchildren[i].setEnabled(att.e);
        this.attchildren[i].controlRef.instance.tickle();
      }
      // Now handle the children
      this.config.value = so.v;
      this.selectedChoice = so.sel;

      // Now handle the children
      for (let i = 0; i < so.c.length; i++) {
        this.children[i].applyConfig(so.c[i]);
      }
    }
  }

  checkChoice() {

    const size = this.container.length;

    for (let i = 0; i < size; i++) {
      this.container.remove();
    }
    this.children = [];

    const choice = this.selectedChoice;
    this.opts.forEach((c) => {
      if (c.name === choice) {
        this.creator.createChoiceElement(c, this);
      }
    });
  }

  change() {
    this.global.getString();
  }

  getChildString() {
    let e = '';
    const choice = this.selectedChoice;
    if (this.children != null) {
      this.children.forEach((value) => {
        if (value.config.name === choice) {
          e = e.concat(value.getElementString());
          if (choice === '-Sequence Holder-') {
            e = e.replace('<-Sequence Holder->\n', '');
            e = e.replace('</-Sequence Holder->\n', '');
          }
        }
      });
    }
    return e;
  }
  getElementString() {
    if (this.topLevel) {
      return '';
    }
    let e = '';
    if (this.config.choiceHead) {

      if (this.config.prefix.length >= 1) {
        e = '<' + this.config.prefix + ':' + this.config.name;
      } else {
        e = '<' + this.config.name;
      }
      e = e.concat(this.getAttributeString());
      e = e.concat('>');
    }
    e = e.concat(this.getChildString());

    if (this.config.choiceHead) {
      if (this.config.prefix.length >= 1) {
        e = e.concat('</' + this.config.prefix + ':' + this.config.name + '>\n');
      } else {
        e = e.concat('</' + this.config.name + '>\n');
      }
    }

    return e;
  }

  getSiblingString() {
    return '';
  }

  setConfig(conf: ItemConfig, creator, parentObj) {


    this.creator = creator;
    const choiceIDs = [];
    this.topLevel = true;
    this.parent = parentObj;
    this.elementPath = this.parent.elementPath;

    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.hasChildren = conf.hC;

    if (conf.oneOf.length > 0) {
      this.config.oneOf.forEach((v) => {
        choiceIDs.push(v.name);
        this.opts.push(v);
      });
    }

    this.selectedChoice = choiceIDs[0];
    this.config.choiceElementIdentifiers = choiceIDs;

    for (let i = 0; i < conf.minOccurs; i++) {
      this.addSibling();
    }
  }

  setSiblingConfig(conf: ItemConfig, root: any, parentObj) {

    this.creator = root;
    this.parent = parentObj;
    const choiceIDs = [];
    this.topLevel = false;
    this.elementPath = this.parent.elementPath;

    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.hasChildren = conf.hC;


    if (conf.oneOf.length > 0) {
      this.config.oneOf.forEach((v) => {
        choiceIDs.push(v.name);
        this.opts.push(v);
      });
    }

    this.selectedChoice = choiceIDs[0];
    this.config.choiceElementIdentifiers = choiceIDs;
    this.checkChoice();
  }

  setText(textXMLs: XMLElement[]): number {


    const _this = this;
    if (textXMLs === null) {
      return Globals.OK;
    }

    if (_this.topLevel) {

      // Distribute to each of the siblings
      const sibLength = _this.siblings.length;
      for (let i = 0; i < sibLength; i++) {
        const res = _this.siblings[i].setText([textXMLs[i]]);

        if (res !== Globals.OK) {
          return res;
        }
      }
      return Globals.OK;

    } else {

      const xml = textXMLs[0];
      // Set the attributes text. Handled in the super class
      const res = _this.setAttributeText(xml);

      for (let i = 0; i < xml.children.length; i++) {
        const arr = [];
        arr.push(xml.children[i]);

        try {
          let var1 = xml.children[i];
          let var2 = xml.children[i + 1];
          while (var1.name === var2.name) {
            arr.push(var2);
            i = i + 1;
            var1 = xml.children[i];
            var2 = xml.children[i + 1];
          }
        } catch (e) {
          // Do nothing. Will occur for end of childrem
        }

        // This will go through all the children, but each child will reject if name is not right
        // May be a problem for CHOICES!!!!
        const choice = this.selectedChoice;
        if (this.children != null) {
          for (let j = 0; j < _this.children.length; j++) {
            const child = _this.children[j];
            if (child.config.name === choice) {
              const res2 = child.setText(textXMLs);
              if (res2 !== Globals.OK) {
                return res2;
              }
            }
          }
        }
      }
      // Will return the fact if the attribute was handled or not
      return res;
    }
  }
}
