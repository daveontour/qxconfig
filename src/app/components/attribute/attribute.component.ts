import { WidgetFactory } from './../../services/widgetfactory';
import { Globals } from '../../services/globals';
import { Component} from '@angular/core';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core'
import { ItemConfig } from '../../interfaces/interfaces'

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent {
  // Reference to the place in the DOM to place the control
  @ViewChild("control", { read: ViewContainerRef }) control;
  controlRef: any;
  config: ItemConfig;
  id: string;
  factory: any;
  elementPath: string;

  constructor(public resolver: ComponentFactoryResolver, public global:Globals, public widgetFactory: WidgetFactory) {
  
   }

   change(){
    this.global.getString();
  }
   isEnabled(){
     return this.config.enabled;
   }

  setAttribute(attribute: ItemConfig, ePath: string) {

    
    //Attribute config
    this.config = attribute;

    if (this.config.required){
      this.config.enabled = true;
    }

    this.elementPath = ePath;

    // Create the editable control 
    this.factory = this.widgetFactory.getFactory(this.config.model, this.resolver);
    this.controlRef = this.control.createComponent(this.factory);

    // Set the config of the control
    this.controlRef.instance.setAttribParent(this);
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
