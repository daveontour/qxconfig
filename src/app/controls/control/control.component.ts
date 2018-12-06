import { Globals } from '../../services/globals';
import { ItemConfig } from '../../interfaces/interfaces';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { Component, ComponentFactoryResolver, AfterViewInit } from '@angular/core';


export abstract class ControlComponent implements AfterViewInit{

  parent: any;
  bElement = false;
  public config: ItemConfig;
  popOverContent = '';
  public unionMember = false;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) { }

  abstract setUpCommon(): void;

  ngAfterViewInit() {
    if (this.unionMember) {
      this.parent.childReady();
    }
  }

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


  change() {
    if (this.unionMember) {
      this.parent.memberChange(this);
    } else {
      this.global.getString();
    }
  }

  childReady() {
    // For signalling to union component when the child id ready
  }

  requireStar() {
    return (this.config.enabled || this.config.required);
  }
  setValue(value: any) {
    this.config.value = value;
  }

  getValue() {
    if (typeof this.config.value === 'undefined') {
      if (this.bElement) {
        this.global.elementsUndefined.push(this.parent.elementPath);
      } else {
        this.global.attributesUndefined.push(this.parent.elementPath);
      }
    }
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

  isInvalid() {
    if (this.isEnabled && (typeof this.config.value === 'undefined' || this.config.value === '')) {
      return true;
    }
  }

  isRequired() {
    return this.parent.config.enabled;
  }
}
