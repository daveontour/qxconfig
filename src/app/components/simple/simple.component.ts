import { XMLElement, SaveObj, AttItemConfig } from './../../services/globals';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { WidgetFactory } from './../../services/widgetfactory';
import { Globals } from '../../services/globals';
import { Subscription } from 'rxjs';
import { ItemConfig } from '../../interfaces/interfaces';
import { ElementComponent } from '../element/element.component';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss']
})
export class SimpleComponent extends ElementComponent implements AfterViewInit {
  // Reference to the place in the DOM to place the control
  @ViewChild('control', { read: ViewContainerRef }) control;
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  controlRef: any;
  public isCollapsed = true;
  public enabled = true;
  public uuid: string;
  public siblingCounter = 0;
  public topLevel: boolean;
  public openTag: string;
  public closeTag: string;
  private sub: Subscription;

  constructor(
    public conf: NgbPopoverConfig,
    public resolver: ComponentFactoryResolver,
    public global: Globals,
    public widgetFactory: WidgetFactory,
    private cdRef: ChangeDetectorRef) {
    super(resolver);

    conf.triggers = global.triggers;

  }

  showDeleteAction() {

    try {
    if (this.parent.siblings.length > this.config.minOccurs) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
  }

  change() {
    this.global.componentChanged();
    this.cdRef.detectChanges();
  }

  addSibling(): boolean {


    if (this.siblings.length === this.config.maxOccurs) {
      alert('Maximum Number of Occurances Already Reached');
      return false;
    }

    const ref = this.siblingsPt.createComponent(this.resolver.resolveComponentFactory(SimpleComponent));

    ref.instance.setSiblingConfig(this.config, this);
    ref.instance.setParent(this);
    ref.instance.config.enabled = true;
    ref.instance.elementPath = this.elementPath;
    this.siblings.push(ref.instance);
    this.siblingCounter++;
    this.change();
    return true;
  }

  ngAfterViewInit() {
    $('.badgeGrayRight').css('right', '-45px');
  }

  setConfig(conf: ItemConfig, parentObject) {


    this.topLevel = true;
    this.config = JSON.parse(JSON.stringify(conf));
    this.config.enabled = this.config.required;
    this.config.uuid = this.global.guid();
    this.elementPath = this.parent.elementPath + '/' + conf.name;


    if (this.config.typeAnnotation == null) {
      this.config.typeAnnotation = this.config.annotation;
    }

    for (let i = 0; i < conf.minOccurs; i++) {
      this.addSibling();
    }
  }

  setSiblingConfig(conf: ItemConfig, parentObj: any) {

    this.topLevel = false;
    this.config = JSON.parse(JSON.stringify(conf));
    this.config.enabled = this.config.required;
    this.elementPath = parentObj.elementPath + '/' + this.config.name;
    this.config.uuid = this.global.guid();

    // Preset the opening and closing tags
    if (this.config.prefix.length >= 1) {
      this.openTag = '<' + this.config.prefix + ':' + this.config.name;
      this.closeTag = '</' + this.config.prefix + ':' + this.config.name + '>\n';
    } else {
      this.openTag = '<' + this.config.name;
      this.closeTag = '</' + this.config.name + '>\n';
    }

    // Add the name space declaration if it is configured
    if (this.config.ns != null) {
      this.openTag = this.openTag.concat(this.config.ns);
    }

    if (typeof this.config.annotation === 'undefined') {
      this.config.annotation = '';
    }

    if (this.config.typeAnnotation == null) {
      this.config.typeAnnotation = this.config.annotation;
    }

    // Create the actual control for the input
    if (this.config.model != null) {
      this.mfactory = this.widgetFactory.getFactory(this.config.model, this.resolver);
      this.controlRef = this.control.createComponent(this.mfactory);
      this.controlRef.instance.setElementParent(this);
    }

    // Display all the attributes (handled in superclass)
    this.addAttributes(conf);
  }

  remove() {
    this.parent.removeChild(this.config.uuid);
  }

  removeChild(childIDToRemove: string) {

    for (let i = 0; i < this.siblings.length; i++) {
      const id = this.siblings[i].config.uuid;
      if (id === childIDToRemove) {
        this.siblingsPt.remove(i);
        this.siblings.splice(i, 1);
        this.siblingCounter--;
        this.change();
        break;
      }
    }
  }

  getElementString() {

    let x = '';
    this.siblings.forEach(function (v) {
      x = x.concat(v.getSiblingString());
    });

    return x;

  }

  getSiblingString() {

    if (!this.config.enabled && !this.config.required) {
      return '';
    }


    let e = this.openTag.concat(this.getAttributeString());

    if (this.config.value == null) {
      if (this.config.nillable) {
        e = e.concat(' xsi:nil="true"');
      }
      e = e.concat('/>\n');

      // If it's not a element that only has attributes, then raise an alarm
      if (typeof this.config.model !== 'undefined') {
        this.global.elementsUndefined.push(this.elementPath);
      }
      return e;
    } else {
      e = e.concat('>');
      e = e.concat(this.controlRef.instance.getValue());
      e = e.concat(this.closeTag);
      return e;
    }
  }

  getSaveObj(): SaveObj {

    const so = new SaveObj();

    so.tl = this.topLevel;
    so.n = this.config.name;
    so.p = this.elementPath;

    if (this.topLevel) {
      this.siblings.forEach(sib => {
        so.s.push(sib.getSaveObj());

      });
    } else {
      so.v = this.config.value;
      this.attchildren.forEach(att => {
        so.a.push(new AttItemConfig(att.config.name, att.config.value, att.config.enabled));
      });
    }

    return so;
  }

  applyConfig(so: SaveObj) {
    if (so == null) {
     console.log('Simple Apply Config Error');
      return;
    }
    if (this.topLevel) {
      if (!so.tl) {
        return;
      }

      // This is a topLevel instance, so create the correct
      // number of siblings

      // Remove all existing siblings
      for (let i = 0; i < this.siblings.length; i++) {
        this.siblingsPt.remove(i);
        this.siblings.splice(i, 1);
        this.siblingCounter--;
        break;
      }

      // Add the correct number of siblings
      for (let i = 0; i < so.s.length; i++) {
        this.addSibling();
      }

      for (let i = 0; i < so.s.length; i++) {
        const soSib = so.s[i];
        this.siblings[i].applyConfig(soSib);
      }


    } else {
      if (so.tl) {
        return;
      }

      // First set the Attribute of the sequence
      for (let i = 0; i < so.a.length; i++) {
        const att = so.a[i];
        this.attchildren[i].setValue(att.v);
        this.attchildren[i].setEnabled(att.e);
        this.attchildren[i].controlRef.instance.tickle();
      }
      // Now handle the children
      this.config.value = so.v;

      // It could be an attribute only element
      if (typeof this.controlRef !== 'undefined') {
        this.controlRef.instance.tickle();
      }
    }
  }

  setText(textXMLs: XMLElement[]): number {

    // Check if an early return is possible
    const _this = this;
    if (textXMLs === null) {
      return Globals.OK;
    }
    if (_this.config.name !== textXMLs[0].name) {
      return Globals.OK;
    }
    // If this is the top level element, check that there is no changes in the number of
    // elements and then farm out to the individual instantiations
    if (_this.topLevel) {

      // Send the data to the individual items
      const sibLength = _this.siblings.length;
      for (let i = 0; i < sibLength; i++) {
        const res = _this.siblings[i].setText([textXMLs[i]]);
        if (res !== Globals.OK) {
          // Early return if there was an error or if was handled
          return res;
        }
      }

      return Globals.OK;

    } else {
      // Set the attributes text and value. Handled in the super class
      // There will only be one element in the array if theis point is reached.

      const xml = textXMLs[0];
      const res = _this.setAttributeText(xml);

      if (_this.config.value === xml.value) {
        // There are no changes to the value, so return the result of setting the attributes
        return res;
      } else {
        // Change the value and return the fact that it was handled
        _this.config.value = xml.value;
        _this.controlRef.instance.tickle();
        return Globals.VALUEHANDLED;
      }
    }
  }
}


