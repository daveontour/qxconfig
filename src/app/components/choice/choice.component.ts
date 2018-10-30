import { Globals } from './../../globals';
import { SequenceComponent } from '../sequence/sequence.component';
import { SimpleComponent } from '../simple/simple.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementComponent } from '../element/element.component';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})
export class ChoiceComponent extends ElementComponent {
  controlRef: any
  selectedChoice: string;
  opts: any[] = [];
  public childID :number = 1000;

  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

    for (var i = 0; i < this.siblings.length; i++) {
      var id = this.siblings[i].config.uuid
      if (id == childIDToRemove) {
        this.container.remove(i);
        this.siblings.splice(i,1);
      
        break;
      }
    }
  }

  checkChoice() {

   this.container.detach();

    let x = this;
    let choice = this.selectedChoice;
    this.opts.forEach(function (c) {
      if (c.name == choice) {
        x.createElement(c, c.type);
      }
    })
  }

  change() {
    this.global.getString();
  }

  getChildString(indent: string) {
    let e: string = "";
    let choice = this.selectedChoice;
    if (this.children != null) {
      this.children.forEach(function (value) {
        if (value.config.name == choice) {
          e = e.concat(value.getElementString(indent));
        }
      });
    }
    return e;
  }

  isElement() {
    return false;
  }

  getElementString(indent: string) {
    return this.getChildString(indent);
  }

  getSiblingString() {
    return "";
  }
  createElement(el: ItemConfig, type: string) {
 
    let factory: any;

    el.uuid = el.uuid+this.childID;
    this.childID++;

    switch (type) {
      case "simple":
        factory = this.resolver.resolveComponentFactory(SimpleComponent);
        this.componentRef = this.container.createComponent(factory);
        break;
      case "sequence":
        factory = this.resolver.resolveComponentFactory(SequenceComponent);
        this.componentRef = this.container.createComponent(factory);
 //       this.componentRef.instance.depth = this.depth + 1;
        break;
      case "choice":
        factory = this.resolver.resolveComponentFactory(ChoiceComponent);
        this.componentRef = this.container.createComponent(factory);
        //Keep the Choice object unique 
        this.componentRef.instance.setBobNumber(this.bobNumber);
        break;
    }

    this.children.push(this.componentRef.instance);
    this.componentRef.instance.setParentID(this.id + "/" + el.name);
    this.componentRef.instance.setParent(this);
    this.componentRef.instance.isChoiceChild = true;
    this.componentRef.instance.setConfig(el);
    if (type == "sequence") {
      this.componentRef.instance.config.enabled = true;
    }
  }

  setConfig(conf: ItemConfig) {

    let x = this;
    let choiceIDs = [];

    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.hasChildren = conf.hasChildren;
    this.id = this.bobNumber + this.config.elementPath.replace("{", "").replace("}", "");

    if (conf.oneOf.length > 0) {
      this.config.oneOf.forEach(function (v) {
        v.elementPath = x.config.elementPath;
        choiceIDs.push(v.name);
        x.opts.push(v);
      });
    }

    this.selectedChoice = choiceIDs[0];
    this.config.choiceElementIdentifiers = choiceIDs;
    this.checkChoice();
  }
}
