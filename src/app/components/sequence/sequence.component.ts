import { AttributeComponent } from '../attribute/attribute.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Globals } from '../../globals';

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
  topLevel: boolean = false;
  siblingCounter = 0;



  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  addSibling() {

    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
      return;
    }
    if (this.topLevel) {
      this.creator.walkSequenceSibling(this);
      this.siblingCounter++;
    }
  }

  setConfig(conf: ItemConfig, creator, parentObj) {

    this.config = JSON.parse(JSON.stringify(conf));
    this.creator = creator;
    this.config.uuid = this.global.guid();
    this.topLevel = true;
    this.depth = parentObj.depth + 1;
    this.parent = parentObj;
    this.bobNumber = 0;
    this.bobNumberChild = 0;

    this.addAttributes(conf);

    //Add the minimum nuber of occurances, if this is the top level
    for (var i = 0; i < conf.minOccurs; i++) {
      this.creator.walkSequenceSibling(this);
      this.siblingCounter++;
    }
  }

  setSiblingConfig(conf: ItemConfig, creator, parentObj) {

    this.config = JSON.parse(JSON.stringify(conf));
    this.creator = creator;
    this.config.uuid = this.global.guid();
    this.topLevel = false;
    this.depth = parentObj.depth;
    this.parent = parentObj;
    this.bobNumber = this.parent.bobNumberChild + 1;
    this.parent.bobNumberChild++;

    this.addAttributes(conf);

    this.parent.siblings.push(this);
 
  }

  addAttributes(conf) {

    let x = this;
    if (conf.hasAttributes) {
      this.sortAttributes("DESC");
      this.config.attributes.forEach(function (att) {
        if (att.required) {
          x.attributesRequired = true;
          x.isCollapsed = false;
        }
        let factory = x.resolver.resolveComponentFactory(AttributeComponent);
        let ref = x.attributes.createComponent(factory);
        ref.instance.setID(x.id + "@" + att.name);
        ref.instance.setAttribute(att);
        x.attchildren.push(ref.instance);
      });
    }
  }

  getSiblingsContainer(){
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
        this.bobNumberChild--;
        this.siblingCounter--;
        break;
      }
    }
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
}
