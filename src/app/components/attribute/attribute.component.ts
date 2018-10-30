import { Globals } from './../../globals';
import { Component} from '@angular/core';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core'
import { ItemConfig } from '../../interfaces/interfaces';
import { DisplaywidgetComponent} from '../displaywidget/displaywidget.component';


@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent extends DisplaywidgetComponent{
  // Reference to the place in the DOM to place the control
  @ViewChild("control", { read: ViewContainerRef }) control;
  controlRef: any;
  config: ItemConfig;
  id: string;
  factory: any;

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super ();
   }

   change(){
    this.global.getString();
  }
   isEnabled(){
     return this.config.enabled;
   }

  setAttribute(attribute: ItemConfig) {
    //Attribute config
    this.config = attribute;

    if (this.config.required){
      this.config.enabled = true;
    }

    // Create the editable control 
    // getFactory() is in tbe DisplaywidgetComponent
    this.factory = this.getFactory(this.config.model, this.resolver);
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
