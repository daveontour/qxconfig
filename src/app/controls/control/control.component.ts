import { Globals } from '../../services/globals';
import { ItemConfig } from '../../interfaces/interfaces';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { Component, ComponentFactoryResolver } from '@angular/core';

export abstract class ControlComponent {

  parent: any;
  bElement: boolean = false;
  config: ItemConfig;
  popOverContent : string = ""

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) { }

  abstract setUpCommon() :void;

  public setElementParent(parent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = true;
    this.setUpCommon();
  }

  setAttribParent(parent: AttributeComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.setUpCommon();
  }


  change(){
    this.global.getString();
  }

  requireStar(){
    return (this.config.enabled || this.config.required);
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
