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
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
  controlRef: any
  selectedChoice: string;
  opts: any[] = [];
  creator: any;
  public childID: number = 1000;
  public topLevel : boolean;
  public siblingCounter = 0;

  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  getSiblingsContainer(){
    return this.siblingsPt;
  }

  addSibling() {

    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
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

    for (var i = 0; i < this.siblings.length; i++) {
      var id = this.siblings[i].config.uuid
      if (id == childIDToRemove) {
        this.container.remove(i);
        this.siblings.splice(i, 1);
        this.siblingCounter--;

        break;
      }
    }
  }

  checkChoice() {

    let size = this.container.length;

    for (var i = 0; i < size; i++){
      this.container.remove();
    }
    this.children = [];

    let x = this;
    let choice = this.selectedChoice;
    this.opts.forEach(function (c) {
      if (c.name == choice) {
         x.creator.createChoiceElement(c, x);
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

  setConfig(conf: ItemConfig, creator, parentObj) {

    //Use the root object as the creator of any new items

    this.creator = creator;
    let x = this;
    let choiceIDs = [];
    this.topLevel = true;

    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.hasChildren = conf.hasChildren;


    if (conf.oneOf.length > 0) {
      this.config.oneOf.forEach(function (v) {
        choiceIDs.push(v.name);
        x.opts.push(v);
      });
    }

    this.selectedChoice = choiceIDs[0];
    this.config.choiceElementIdentifiers = choiceIDs;
    // this.checkChoice();
  }

  setSiblingConfig(conf: ItemConfig, root: any) {

    //Use the root object as the creator of any new items

    this.creator = root;
    let x = this;
    let choiceIDs = [];
    this.topLevel = false;

    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.hasChildren = conf.hasChildren;


    if (conf.oneOf.length > 0) {
      this.config.oneOf.forEach(function (v) {
        choiceIDs.push(v.name);
        x.opts.push(v);
      });
    }

    this.selectedChoice = choiceIDs[0];
    this.config.choiceElementIdentifiers = choiceIDs;
    this.checkChoice();
  }
}
