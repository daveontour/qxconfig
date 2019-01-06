import { WidgetFactory } from './../../services/widgetfactory';
import { Globals } from '../../services/globals';
import { Component } from '@angular/core';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ItemConfig } from '../../interfaces/interfaces';
import { Messenger } from './../../services/messenger';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent {
  // Reference to the place in the DOM to place the control
  @ViewChild('control', { read: ViewContainerRef }) control;
  controlRef: any;
  config: ItemConfig;
  id: string;
  factory: any;
  elementPath: string;

  constructor(
    public conf: NgbPopoverConfig,
    public resolver: ComponentFactoryResolver,
    public global: Globals,
    private messenger: Messenger,
    public widgetFactory: WidgetFactory) {

      conf.triggers = global.triggers;
  }

  change() {
    this.global.getString();
  }
  isEnabled() {
    return this.config.enabled;
  }

  setEnabled(v: boolean) {
    this.config.enabled = v;
  }

  setAttribute(attribute: ItemConfig, ePath: string) {


    // Attribute config
    this.config = attribute;

    if (this.config.required) {
      this.config.enabled = true;
    }

    this.elementPath = ePath;

    // Create the editable control
    this.factory = this.widgetFactory.getFactory(this.config.model, this.resolver);
    this.controlRef = this.control.createComponent(this.factory);

    // Set the config of the control
    this.controlRef.instance.setAttribParent(this);
  }

  setValue(value) {
    this.config.value = value;
  }
  setID(id) {
    this.id = id;
  }
  getID() {
    return this.id;
  }

  isElement() {
    return false;
  }
}
