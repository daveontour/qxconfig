import { XMLElement } from './../../services/globals';
import { ItemConfig } from '../../interfaces/interfaces';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { Globals } from '../../services/globals';
import { ChangeDetectorRef } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { noSideEffects } from '@angular/core/src/util';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent extends ElementComponent implements AfterViewInit {
  @ViewChild('control', { read: ViewContainerRef }) control;
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  isCollapsed = true;
  defferedConf: any;
  topLevel = true;
  releaseSiblingCounter = false;
  tempSiblingCounter = 0;
  openTag: string;
  closeTag: string;

  constructor(
    public resolver: ComponentFactoryResolver,
    public global: Globals,
    private cdRef: ChangeDetectorRef,
    public conf: NgbPopoverConfig) {

    super(resolver);
    conf.triggers = this.global.triggers;
  }


  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.topLevel) {
      // This ia a top level object so tell the creator to add the minimum number of siblings
      for (let ix = 0; ix < this.config.minOccurs; ix++) {
        this.creator.walkSequenceSibling(this);
        this.siblingCounter++;
      }
      this.siblingCounter = this.config.minOccurs;
      this.releaseSiblingCounter = true;
    } else {

      // This is normal object, so add the attributes and add all the children
      this.addAttributes(this.config);
      for (let ix = 0; ix < this.config.allOf.length; ix++) {
        this.creator.walkStructure(this.config.allOf[ix], this);
      }
    }

    // This prevents ExpressionChangedAfterItHasBeenCheckedError
    // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
    this.cdRef.detectChanges();
  }

  showTopBlock() {
    if (!this.releaseSiblingCounter) {
      return false;
    } else {
      return this.siblingCounter !== this.config.maxOccurs;
    }
  }
  addSibling(): boolean {

    if (this.siblings.length === this.config.maxOccurs) {
      alert('Maximum Number of Occurances Already Reached');
      return false;
    }
    if (this.topLevel) {
      this.creator.walkSequenceSibling(this);
      this.siblingCounter++;
      this.global.getString();
      this.cdRef.detectChanges();
      return true;
    }
  }

  setConfig(conf: ItemConfig, creator, parentObj) {

    this.config = JSON.parse(JSON.stringify(conf));
    this.creator = creator;
    this.config.uuid = this.global.guid();
    this.topLevel = true;
    this.depth = parentObj.depth + 1;
    this.parent = parentObj;
    this.elementPath = parentObj.elementPath + '/' + this.config.name;
  }

  setSiblingConfig(conf: ItemConfig, creator, parentObj) {

    this.config = JSON.parse(JSON.stringify(conf));
    this.creator = creator;
    this.config.uuid = this.global.guid();
    this.topLevel = false;
    this.depth = parentObj.depth;
    this.parent = parentObj;
    this.elementPath = parentObj.elementPath;
    // this.addAttributes(conf);

    if (typeof this.config.annotation === 'undefined') {
      this.config.annotation = '';
    }

    // Preset the opening and closing tags

    this.openTag = '<' + this.config.name;
    this.closeTag = '</' + this.config.name + '>\n';

    if (typeof this.config.prefix !== 'undefined') {
      if (this.config.prefix.length >= 1) {
        this.openTag = '<' + this.config.prefix + ':' + this.config.name;
        this.closeTag = '</' + this.config.prefix + ':' + this.config.name + '>\n';
      }
    }

    // Add the name space declaration if it is configured
    if (this.config.ns != null) {
      this.openTag = this.openTag.concat(this.config.ns);
    }

    this.parent.siblings.push(this);
  }

  getSiblingsContainer() {
    return this.siblingsPt;
  }

  remove() {
    // Tell the parent object of itself to remove this
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {
    // A child object has told the parent to remove it.

    if (this.siblings.length <= this.config.minOccurs) {
      alert('Cannot Remove. At least ' + this.config.minOccurs + ' instance required');
      return;
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
    this.global.getString();
  }

  getElementString() {

    let e = '';
    this.siblings.forEach((sibling) => {
      e = e.concat(sibling.getSiblingString());
    });
    return e;

  }

  setText(textXMLs: XMLElement[]): number {

    const _this = this;
    if (textXMLs === null) {
      return Globals.OK;
    }
    if (_this.config.name !== textXMLs[0].name) {
      return Globals.OK;
    }


    if (_this.topLevel) {

      // Make sure the correct number of siblings have been created.
      const numberToCreate = textXMLs.length - _this.siblings.length;
      if (numberToCreate !== 0) {
        return Globals.STRUCTURECHANGE;
      }

      // Distribute to each of the siblings
      const sibLength = _this.siblings.length;
      for (let i = 0; i < sibLength; i++) {
        const res =  _this.siblings[i].setText([textXMLs[i]]);

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

        for (let j = 0 ; j < _this.children.length; j++) {
          const child = _this.children[j];
          const res2 = child.setText(arr);
          if (res2 !== Globals.OK) {
            return res2;
          }
        }
      }
       // Will return the fact if the attribute was handled or not
      return res;
    }
  }

  getSiblingString() {

    let e = '';
    const childString = this.getChildString();

    if (!this.config.annon) {

      // Opening Tag, optionally prefixed with namespace prefix
      e = this.openTag.concat(this.getAttributeString());

      // If there is no child string or value, close the tag
      if (childString == null && this.config.value == null) {
        return e.concat(' />');
      } else {
        e = e.concat('>');
      }
    }

    if (this.config.value != null) {
      e = e.concat(this.config.value);
    }

    if (childString != null) {
      e = e.concat('\n' + childString);
    }

    if (!this.config.annon) {
      e = e.concat(this.closeTag);
    }
    return e;
  }
}
