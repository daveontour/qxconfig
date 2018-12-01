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
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
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

    //This prevents ExpressionChangedAfterItHasBeenCheckedError 
    // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
    // this.cdRef.detectChanges();
  }

  getSiblingsContainer() {
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

    if (this.siblingCounter <= this.config.minOccurs) {
      alert("Cannot Remove. At least " + this.config.minOccurs + " instance required");
      return false;
    }
    for (var i = 0; i < this.siblings.length; i++) {
      var id = this.siblings[i].config.uuid
      if (id == childIDToRemove) {
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

  checkChoice() {

    let size = this.container.length;

    for (var i = 0; i < size; i++) {
      this.container.remove();
    }
    this.children = [];

    let choice = this.selectedChoice;
    this.opts.forEach((c) => {
      if (c.name == choice) {
        this.creator.createChoiceElement(c, this);
      }
    })
  }

  change() {
    this.global.getString();
  }

  getChildString() {
    let e: string = "";
    let choice = this.selectedChoice;
    if (this.children != null) {
      this.children.forEach((value) => {
        if (value.config.name == choice) {
          e = e.concat(value.getElementString());
          if (choice == "-Sequence Holder-") {
            e = e.replace("<-Sequence Holder->\n", "");
            e = e.replace("</-Sequence Holder->\n", "");
          }
        }
      });
    }
    return e;
  }
  getElementString() {
    if (this.topLevel){
      return "";
    }
    let e: string = "";
    if (this.config.choiceHead){
      e = e.concat("<"+this.config.name);
      e = e.concat(this.getAttributeString());
      e = e.concat(">");
    }
    e = e.concat(this.getChildString());

    if (this.config.choiceHead){
      e = e.concat("</"+this.config.name+">");
    }

    return e;
  }

  getSiblingString() {
    return "";
  }

  setConfig(conf: ItemConfig, creator, parentObj) {

  
    this.creator = creator;
    let choiceIDs = [];
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

    for (var i = 0; i < conf.minOccurs; i++) {
      this.addSibling();
    }
  }

  setSiblingConfig(conf: ItemConfig, root: any, parentObj) {

    this.creator = root;
    this.parent = parentObj;
    let choiceIDs = [];
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
}
