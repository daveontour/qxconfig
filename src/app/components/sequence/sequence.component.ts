import { AttributeComponent } from '../attribute/attribute.component';
import { ChoiceComponent } from '../choice/choice.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { SimpleComponent } from '../simple/simple.component';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Globals } from './../../globals';
import { compileFactoryFunction } from '@angular/compiler/src/render3/r3_factory';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent extends ElementComponent {
  @ViewChild("control", { read: ViewContainerRef }) control;
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
  controlRef: any;
  isCollapsed = true;
  public bobNumberChild = 1;
  public depth = 1;
  public childID = 1000;


  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }


  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

   if (this.siblings.length <= this.config.minOccurs ){
      alert("Cannot Remove. At least "+this.config.minOccurs+" instance required");
      return;
   }

    for (var i = 0; i < this.siblings.length; i++) {
      var id = this.siblings[i].config.uuid
      if (id == childIDToRemove) {
        this.siblingsPt.remove(i);
        this.siblings.splice(i,1);
        this.bobNumberChild--;
        break;
      }
    }
  }
  hideElement() {

    if (!this.showElement) {
      return true;
    }
    if (this.bobNumber == 0) {
      return true;
    }

    return false;

  }

  isOddDepth() {
    if (this.depth % 2 == 1) {
      return true;
    } else {
      return false;
    }
  }
  isEvenDepth() {
    if (this.depth % 2 == 1) {
      return false;
    } else {
      return true;
    }
  }
  
  addSibling() {
    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
      return;
    }
    if (this.bobNumber != 0) {
      return;
    }

    let conf = JSON.parse(JSON.stringify(this.config));
    conf.uuid = this.config.uuid+this.childID;
    this.childID++;

    let ref = this.siblingsPt.createComponent(this.resolver.resolveComponentFactory(SequenceComponent));
    ref.instance.setBobNumber(this.bobNumberChild);
    this.bobNumberChild++;
    ref.instance.depth = this.depth;
    ref.instance.setConfig(conf);
    ref.instance.setParent(this);
    ref.instance.config.enabled = true;
    this.siblings.push(ref.instance);
    this.global.getString();
  }
  getElementString(indent?: string) {


    //If it's not required AND and not enabled, just return nothing
    if (!this.config.enabled && !this.config.required) {
      return "";
    }

    //If there is only a single instance, return the data, which we can get from the sibling string function
    if (this.bobNumber == 1 && this.siblings.length == 0) {
      let x = this.getSiblingString(indent);
      return x;
    }

    if (this.bobNumber == 0 && this.siblings.length > 0) {
      let e: string = "";
      this.siblings.forEach(function (s) {
        let x = s.getSiblingString(indent);
        e = e.concat(x);
      });
      return e;
    }

    return "";
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
  createElement(el: ItemConfig, type: string) {
    console.log("Creating " + el.name + "  type = " + type);

 
    let factory: any;

    switch (type) {
      case "simple":
        factory = this.resolver.resolveComponentFactory(SimpleComponent);
        this.componentRef = this.container.createComponent(factory);
        break;
      case "sequence":
        factory = this.resolver.resolveComponentFactory(SequenceComponent);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.depth = this.depth + 1;
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
    this.componentRef.instance.setConfig(el);
    if (type == "sequence") {
      this.componentRef.instance.config.enabled = true;
    }
  }

  addAttChild(x) {
    this.attchildren.push(x);
  }

  isElement() {
    return true;
  }

  setConfig(conf: ItemConfig) {
    let x = this;
    this.config = JSON.parse(JSON.stringify(conf));
    this.config.uuid = this.global.guid();
    this.id = this.parentID + "/" + this.config.name;

    if (this.config.minOccurs == 1 && this.config.maxOccurs == 1) {
      this.bobNumber = 1;
    }

    this.hasChildren = conf.hasChildren;
    if (conf.hasChildren) {
      this.config.allOf.forEach(function (v) {
        if (v.type != "choice"){
          v.elementPath = x.config.elementPath + "/" + v.name;
        } else {
          v.elementPath = x.config.elementPath;
        }
        x.createElement(v, v.type);
      });
    }

    if (conf.hasAttributes) {
      this.sortAttributes("DESC");
      this.config.attributes.forEach(function (att) {
        if (att.required) {
          x.attributesRequired = true;
          x.isCollapsed = false;
        }
        let factory = x.resolver.resolveComponentFactory(AttributeComponent);
        x.componentRef = x.attributes.createComponent(factory);
        x.componentRef.instance.setID(x.id + "@" + att.name);
        x.componentRef.instance.setAttribute(att);
        x.addAttChild(x.componentRef.instance);
      });
    }

    //Add the minimum nuber of occurances
    for (var i = 0; i < x.config.minOccurs; i++){
      this.addSibling();
    }
  }
}
