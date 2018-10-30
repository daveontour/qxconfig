import { Globals } from './../../globals';
import { AttributeComponent } from '../attribute/attribute.component';
import { ChoiceComponent } from '../choice/choice.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { SequenceComponent } from '../sequence/sequence.component';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';


@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleComponent extends ElementComponent {
  // Reference to the place in the DOM to place the control
  @ViewChild("control", { read: ViewContainerRef }) control;
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
  controlRef: any;
  mfactory: any;
  public isCollapsed = true;
  public bobNumberChild = 1;
  public enabled: boolean = true;
  public uuid;



  constructor(resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver);
  }

  change() {
    this.global.getString();
  }
  setBobNumber(bobNum: number) {
    this.bobNumber = bobNum;
    if (this.bobNumber == 0 && this.config.minOccurs > 0) {
      for (let index = 0; index < this.config.minOccurs; index++) {
        this.addSibling()
      }
    }
  }

  addSibling() {
    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
      return;
    }
    if (this.bobNumber != 0) {
      alert("Only Add Siblings from First Element");
      return;
    }

    let ref = this.siblingsPt.createComponent(this.resolver.resolveComponentFactory(SimpleComponent));
    ref.instance.setBobNumber(this.bobNumberChild++);
    ref.instance.setConfig(this.config);
    ref.instance.setParent(this);
    ref.instance.config.enabled = true;
    this.siblings.push(ref.instance);
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

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

  createElement(el: ItemConfig, type: string) {
    alert("simple.component.ts createElement called!");
  }

  isElement() {
    return true;
  }
  getElementString(indent?: string) {

    if (indent) {
      this.in = this.in.concat('s');
    } else {
      indent = "  ";
    }
    if (!this.config.enabled && !this.config.required) {
      return "";
    }

    // In the case that there is only a single element
    if (this.bobNumber == 1 && this.siblings.length == 0) {
      return this.getSiblingString(indent);
    }

    // Should not get here with a non zero bob
    if (this.bobNumber != 0) {
      return "";
    }

    let x = "";
    this.siblings.forEach(function (v) {
      x = x.concat(v.getSiblingString(indent))
    });

    return x;

  }

  getSiblingString(indent?: string) {

    if (!this.config.enabled && !this.config.required) {
      return "";
    }


    let e: string = indent + '<' + this.config.name;
    e = e.concat(this.getAttributeString());

    if (this.config.value == null) {
      e = e.concat("/>\n");
      return e;
    } else {
      e = e.concat('>')
      e = e.concat(this.controlRef.instance.getValue());
      e = e.concat('</' + this.config.name + '>\n');
      return e;
    }
  }

  addAttChild(x) {
    this.attchildren.push(x);
  }

  setConfig(conf: ItemConfig) {
    let x = this;
    this.config = JSON.parse(JSON.stringify(conf));
    this.id = this.parentID + "/" + this.config.name + "bobNum=" + this.bobNumber;
    this.config.enabled = this.config.required;
    this.config.elementPath = x.config.elementPath + "/" + this.config.name;
    this.config.uuid = this.global.guid();

    if (this.config.typeAnnotation == null) {
      this.config.typeAnnotation = this.config.annotation;
    }

    // If there is only one occurance, it's bobNumber is set to 1 so it will display a single element 
    if (this.config.maxOccurs == 1) {
      this.bobNumber = 1;
    }

    // Create the editable component
    // getFactory() is in tbe DisplaywidgetComponent


    if (this.config.model != null) {
      this.mfactory = this.getFactory(this.config.model, this.resolver);
      this.controlRef = this.control.createComponent(this.mfactory);

      // Set the config of the control
      this.controlRef.instance.setElementParent(this);
    }

    if (this.config.attributes != null) {
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
        x.attchildren.push(x.componentRef.instance);
      });
    }

    // Allow for condition where there is no content but only attributes
    if (x.config.model == null) {
      x.isCollapsed = false;
    }

    // This will trigger the creation of the minimum number of occurances
    if (this.bobNumber == 0) {
      this.setBobNumber(0);

      //Set it enabled so it passes through the getString
      this.config.enabled = true;
    }
  }
}