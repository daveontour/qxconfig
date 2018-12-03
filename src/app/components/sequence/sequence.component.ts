import { ItemConfig } from '../../interfaces/interfaces';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { Globals } from '../../services/globals';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent extends ElementComponent implements AfterViewInit, OnInit {
  @ViewChild('control', { read: ViewContainerRef }) control;
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  isCollapsed = true;
  defferedConf: any;
  topLevel = true;
  releaseSiblingCounter = false;
  tempSiblingCounter = 0;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals, private cdRef: ChangeDetectorRef) {
    super(resolver);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.init();
  }

  init() {
    if (this.topLevel) {
      for (let ix = 0; ix < this.config.minOccurs; ix++) {
        this.creator.walkSequenceSibling(this);
        this.siblingCounter++;
      }
      this.siblingCounter = this.config.minOccurs;
      this.releaseSiblingCounter = true;
    } else {
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
  addSibling() {

    if (this.siblings.length === this.config.maxOccurs) {
      alert('Maximum Number of Occurances Already Reached');
      return;
    }
    if (this.topLevel) {
      this.creator.walkSequenceSibling(this);
      this.siblingCounter++;
      this.global.getString();
      this.cdRef.detectChanges();
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


    this.parent.siblings.push(this);
  }

  getSiblingsContainer() {
    return this.siblingsPt;
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

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
    this.siblings.forEach((s) => {
      e = e.concat(s.getSiblingString());
    });
    return e;

  }

  getSiblingString() {

    let e = '';
    const c = this.getChildString();

    if (!this.config.annon) {
      e = '<' + this.config.name;
      e = e.concat(this.getAttributeString());


      if (c == null && this.config.value == null) {
        if (this.config.ns != null) {
          e = e.concat(' xmlns ="' + this.config.ns + '"');
        }
        if (this.config.ns != null) {
          e = e.concat(' xmlns ="' + this.config.ns + '"');
        }
        e = e.concat(' />');
        return e;
      } else {
        if (this.config.ns != null) {
          e = e.concat(' xmlns ="' + this.config.ns + '"');
        }
        e = e.concat('>');
      }
    }
    if (this.config.value != null) {
      e = e.concat(this.config.value);
    }

    if (c != null) {
      e = e.concat('\n');
      e = e.concat(c);
    }

    if (!this.config.annon) {
      e = e.concat('</' + this.config.name + '>\n');
    }
    return e;
  }
}
