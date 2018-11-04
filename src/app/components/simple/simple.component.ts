import { WidgetFactory } from './../../services/widgetfactory';
import { Globals } from '../../services/globals';
import { AttributeComponent } from '../attribute/attribute.component';
import { ItemConfig } from '../../interfaces/interfaces';
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
  public isCollapsed = true;
  public enabled: boolean = true;
  public uuid;
  public siblingCounter = 0;
  public topLevel : boolean;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals, public widgetFactory: WidgetFactory) {
    super(resolver);
  }

  showDeleteAction() {
    // "(!config.required  && !this.isRoot && !this.isChoiceChild && (this.parent.siblings.length > this.config.minOccurs)) || (this.isChoiceChild && this.config.minOccurs == 0) "
    if (this.parent.siblings.length > this.config.minOccurs) {
      return true;
    }

    return false;
  }

  change() {
    this.global.getString();
  }


  addSibling() {

    if (this.siblings.length == this.config.maxOccurs) {
      alert("Maximum Number of Occurances Already Reached");
      return;
    }

    let ref = this.siblingsPt.createComponent(this.resolver.resolveComponentFactory(SimpleComponent));

    ref.instance.setSiblingConfig(this.config);
    ref.instance.setParent(this);
    ref.instance.config.enabled = true;
    this.siblings.push(ref.instance);
    this.siblingCounter++;
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

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

  getElementString(indent?: string) {

    if (indent) {
      this.in = this.in.concat('s');
    } else {
      indent = "  ";
    }
    if (!this.config.enabled && !this.config.required) {
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

  setConfig(conf: ItemConfig) {

    this.topLevel = true;
    this.config = JSON.parse(JSON.stringify(conf));
    this.config.enabled = this.config.required;
    this.config.uuid = this.global.guid();
 

    if (this.config.typeAnnotation == null) {
      this.config.typeAnnotation = this.config.annotation;
    }

    if (this.config.model != null) {
      let mfactory = this.widgetFactory.getFactory(this.config.model, this.resolver);
      this.controlRef = this.control.createComponent(mfactory);

      // Set the config of the control
      this.controlRef.instance.setElementParent(this);
    }

    this.addAttributes(conf);

    for (var i = 0; i < conf.minOccurs; i++) {
      this.addSibling();
    }
  }

  setSiblingConfig(conf: ItemConfig) {

    this.topLevel = false;
    this.config = JSON.parse(JSON.stringify(conf));
    this.config.enabled = this.config.required;
    this.config.elementPath = this.config.elementPath + "/" + this.config.name;
    this.config.uuid = this.global.guid();
 

    if (this.config.typeAnnotation == null) {
      this.config.typeAnnotation = this.config.annotation;
    }

    if (this.config.model != null) {
      this.mfactory = this.widgetFactory.getFactory(this.config.model, this.resolver);
      this.controlRef = this.control.createComponent(this.mfactory);
      this.controlRef.instance.setElementParent(this);
    }

    this.addAttributes(conf);
  }
}