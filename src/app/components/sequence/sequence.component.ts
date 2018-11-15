import { ItemConfig } from '../../interfaces/interfaces';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { Globals } from '../../services/globals';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent extends ElementComponent implements AfterViewInit, OnInit {
  @ViewChild("control", { read: ViewContainerRef }) control;
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
  isCollapsed = true;
  defferedConf: any;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    if (this.topLevel) {
      for (var i = 0; i < this.config.minOccurs; i++) {
        debugger;
        this.creator.walkSequenceSibling(this);
        this.siblingCounter++;



      }
    } else {
      this.addAttributes(this.config);
      for (var i = 0; i < this.config.allOf.length; i++) {
        this.creator.walkStructure(this.config.allOf[i], this);
      }
    }
  }

  addSibling() {

    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
      return;
    }
    if (this.topLevel) {
      this.creator.walkSequenceSibling(this);
      this.siblingCounter++;
      this.global.getString();
    }
  }

  setConfig(conf: ItemConfig, creator, parentObj) {

    this.config = JSON.parse(JSON.stringify(conf));
    this.creator = creator;
    this.config.uuid = this.global.guid();
    this.topLevel = true;
    this.depth = parentObj.depth + 1;
    this.parent = parentObj;
    this.elementPath = parentObj.elementPath + "/" + this.config.name;

    //this.addAttributes(conf);

    //Add the minimum nuber of occurances, if this is the top level
    // for (var i = 0; i < conf.minOccurs; i++) {
    //   this.creator.walkSequenceSibling(this);
    //   this.siblingCounter++;
    // }
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

    if (typeof this.config.annotation == 'undefined') {
      this.config.annotation = "";
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
      alert("Cannot Remove. At least " + this.config.minOccurs + " instance required");
      return;
    }

    for (var i = 0; i < this.siblings.length; i++) {
      var id = this.siblings[i].config.uuid
      if (id == childIDToRemove) {
        this.siblingsPt.remove(i);
        this.siblings.splice(i, 1);
        this.siblingCounter--;
        this.global.getString();
        break;
      }
    }
  }

  getElementString(indent?: string) {

    let e: string = "";
    this.siblings.forEach((s) => {
      e = e.concat(s.getSiblingString(indent));
    });
    return e;

  }

  getSiblingString(indent: string) {

    let c: string = this.getChildString(indent + this.in);
    let e: string = indent + '<' + this.config.name;
    e = e.concat(this.getAttributeString());

    if (c == null && this.config.value == null) {
      e = e.concat(" />");
      return e;
    } else {
      e = e.concat('>');
    }

    if (this.config.value != null) {
      e = e.concat(this.config.value);
    }

    if (c != null) {
      e = e.concat('\n');
      e = e.concat(c);
    }

    e = e.concat(indent + '</' + this.config.name + '>\n');
    return e;
  }
}
