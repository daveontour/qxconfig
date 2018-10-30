import { Globals } from './../../globals';
import { SimpleComponent } from '../../components/simple/simple.component';
import { ItemConfig } from '../../interfaces/interfaces';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { Component, ComponentFactoryResolver } from '@angular/core';



@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export abstract class ControlComponent {

  parent: any;
  bElement: boolean = false;
  config: ItemConfig;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) { }

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = true;

  }

  change(){
    this.global.getString();
  }

  requireStar(){
    return (this.config.enabled || this.config.required);
  }
  setAttribParent(parent: AttributeComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
  }
  setValue(value: any) {
    this.config.value = value;
  }

  getValue() {
    return this.config.value;
  }

  isElement() {
    return this.bElement;
  }

  isEnabled() {

    if (this.parent.config.enabled || this.isElement() && this.config.required || !this.isElement) {
      return true;
    } else {
      return false;
    }
  }

  isInvalid(){
    if (this.isEnabled && (typeof this.config.value == 'undefined' ||  this.config.value == '')){
      return true
    }
  }

  isRequired() {
    return this.parent.config.enabled;
  }
}
