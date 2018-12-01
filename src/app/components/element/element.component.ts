import { AttributeComponent } from './../attribute/attribute.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

export abstract class ElementComponent  {
  @ViewChild("container", { read: ViewContainerRef }) container;
  @ViewChild("attributes", { read: ViewContainerRef }) attributes;
  @Input() id: any;
  componentRef: any;
  config: ItemConfig;
  children: ElementComponent[] = [];
  parent : ElementComponent;
  attchildren: any[] = [];
  hasChildren: boolean = false;

  parentID: string;
  mfactory: any;
  public siblings: ElementComponent[] = [];
  attributesRequired: boolean = false;
  in:string = "  ";
  isRoot : boolean  = false;
  creator: any;
  public depth = 1;
  public siblingCounter = 0;
  public topLevel : boolean = false;
  public isCollapsed : boolean = true;
  public elementPath: string;
  public numRequiredAttributes: number = 0;
  public numOptionalAttributes: number = 0;

  constructor(public resolver: ComponentFactoryResolver) { }

  abstract getElementString(): string;
  abstract getSiblingString(): string;
  abstract setConfig(conf: ItemConfig, parentObject: any, topLevel:boolean): void;
  abstract remove(): void;
  abstract removeChild(childIDtoRemove : string): void;


 public getContainer(){
    return this.container;
  }

  public getSiblingContainer(){
    return this.container;
  }

  setParent(parent : ElementComponent){
    this.parent = parent;
  }

  getAttributeString() {
    let s: string = "";
    this.attchildren.forEach(function (a) {
      // if ((typeof a.config.value != 'undefined') || a.config.required) {
      //   s = s.concat(" " + a.config.name + "=\"" + a.controlRef.instance.getValue() + "\" ");
      // }

      if (a.config.enabled || a.config.required) {
        s = s.concat(" " + a.config.name + "=\"" + a.controlRef.instance.getValue() + "\" ");
      }
    });

    return s;
  }

  addAttributes(conf) {

    let ordinal = 0;
    if (conf.hA) {
      this.sortAttributes("DESC");
      this.config.attributes.forEach( (att)=> {
        if (att.required) {
          this.isCollapsed = false;
          this.numRequiredAttributes++;
        } else {
          this.numOptionalAttributes++;
        }

        if(ordinal == 0){
          att.first = true;
        } else {
          att.first = false;
        }
        if (ordinal == this.config.attributes.length-1){
          att.last = true;
        } else {
          att.last = false;
        }


        if (this.config.type == "sequence"){
          att.sequenceAttribute = true;
        } else {
          att.sequenceAttribute = false;
        }
        ordinal++;
        let factory = this.resolver.resolveComponentFactory(AttributeComponent);
        let ref = this.attributes.createComponent(factory);
        ref.instance.setAttribute(att,this.elementPath+ "@" + att.name );
        this.attchildren.push(ref.instance);
      });
    }
  }

  getValueString() {
    return this.config.value;
  }

  getID() {
    return this.id;
  }

  setParentID(id) {
    this.parentID = id;
  }

  getChildString() {
    let e: string = "";
    let o = this;
    if (this.children != null) {
      this.children.forEach(function (value) {
        let x = value.getElementString();
        e = e.concat(x);
      });
    }
    return e;
  }

  hasAttributes() {
    return this.config.hA;
  }

  hasRequiredAttributes() {
    return this.numRequiredAttributes > 0;
  }
  hasOptionalAttributes() {
    return this.numOptionalAttributes > 0;
  }
  sortAttributes(order: String): void {

    // Sort the order of the attributes so that the required ones are listed first 
    this.config.attributes.sort((a, b) => {
      if ((a.required && b.required) || (!a.required && !b.required)) {
        return 0;
      }
      if ((a.required && !b.required)) {
        return 1;
      }

      if ((!a.required && b.required)) {
        return -1;
      }

    });

    if (order === "DESC") {
      this.config.attributes.reverse();
    }
  }

  
  isOddDepth() {
    return this.depth % 2 == 1;
 }
 isEvenDepth() {
   return this.depth % 2 != 1;
 }
}
