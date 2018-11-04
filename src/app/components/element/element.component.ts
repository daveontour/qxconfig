import { ItemConfig } from '../../interfaces/interfaces';
import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';



@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
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
  showElement: boolean = true;
  parentID: string;
  mfactory: any;
  public siblings: ElementComponent[] = [];
  bobNumber: number = 0;
  attributesRequired: boolean = false;
  in:string = "  ";
  isRoot : boolean  = false;
  isChoiceChild = false;
  creator: any;
  public depth = 1;
  public bobNumberChild = 0;
  public siblingCounter = 0;

  constructor(public resolver: ComponentFactoryResolver) { }

  abstract getElementString(indent?:string): string;
  abstract getSiblingString(indent?:string): string;
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

  setBobNumber(bobNum: number) {
    this.bobNumber = bobNum;
  }
  setShowElement(show: boolean) {
    this.showElement = show;
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

  getValueString() {
    return this.config.value;
  }

  getID() {
    return this.id;
  }

  setParentID(id) {
    this.parentID = id;
  }

  getChildString(indent:string) {
    let e: string = "";
    let o = this;
    if (this.children != null) {
      this.children.forEach(function (value) {
        let x = value.getElementString(indent);
        e = e.concat(x);
      });
    }
    return e;
  }

  hasAttributes() {
    return this.config.hasAttributes;
  }

  hasRequiredAttributes() {
    return this.attributesRequired;
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
