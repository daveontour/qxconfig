import { Globals } from '../../services/globals';
import { AttributeComponent } from './../../components/attribute/attribute.component';
import { SimpleComponent } from './../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { CheckboxRequiredValidator } from '@angular/forms';

@Component({
  selector: 'app-xsnumber',
  templateUrl: './xsnumber.component.html'
})

export class XSNumberComponent extends ControlComponent {

  typeConfig: any;
  inputOK: boolean = false;
  inputNotOK: boolean = true;

  byte = {
    "minValue": -128,
    "maxValue": 127,
    "description": "Integer value between -128 and 127"
  }
  int = {
    "minValue": -2147483648,
    "maxValue": 21474836487,
    "description": "Integer value between  -2147483648  and 2147483647"
  }

  long = {
    "minValue": -9223372036854775808,
    "maxValue": 9223372036854775807,
    "description": "Integer value between -9223372036854775808  and 9223372036854775807"
  }
  short = {
    "minValue": -32768,
    "maxValue": 32767,
    "description": "Integer value between -32768  and 32768"
  }

  unsignedByte = {
    "minValue": 0,
    "maxValue": 255,
    "description": "Integer value between 0 and 255"
  }
  unsignedInt = {
    "minValue": 0,
    "maxValue": 4294967295,
    "description": "Integer value between  0  and 4294967295"
  }

  unsignedLong = {
    "minValue": 0,
    "maxValue": 18446744073709551615,
    "description": "Integer value between 0  and 18446744073709551615"
  }
  unsignedShort = {
    "minValue": 0,
    "maxValue": 65535,
    "description": "Integer value between 0  and 65535"
  }
  positiveInteger = {
    "minValue": 1,
    "maxValue": Number.MAX_SAFE_INTEGER,
    "description": "Positive Integer equal or greater than 1"
  }
  nonPositiveInteger = {
    "minValue": -1 * Number.MAX_SAFE_INTEGER,
    "maxValue": 0,
    "description": "Negative Integer 0 or less"
  }
  nonNegativeInteger = {
    "minValue": 0,
    "maxValue": Number.MAX_SAFE_INTEGER,
    "description": "Positive Integer 0 or greater"
  }
  negativeInteger = {
    "minValue": -1 * Number.MAX_SAFE_INTEGER,
    "maxValue": -1,
    "description": "Negative Integer -1 or less"
  }
  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  setUpCommon() {


    switch (this.config.model) {
      case "xs:byte":
        this.typeConfig = this.byte;
        break;
      case "xs:int":
        this.typeConfig = this.int;
        break;
      case "xs:long":
        this.typeConfig = this.long;
        break;
      case "xs:short":
        this.typeConfig = this.short;
        break;
      case "xs:unsignedByte":
        this.typeConfig = this.unsignedByte;
        break;
      case "xs:unsignedInt":
        this.typeConfig = this.unsignedInt;
        break;
      case "xs:unsignedLong":
        this.typeConfig = this.unsignedLong;
        break;
      case "xs:unsignedShort":
        this.typeConfig = this.unsignedShort;
        break;
      case "xs:positiveInteger":
        this.typeConfig = this.positiveInteger;
        break;
      case "xs:negativeInteger":
        this.typeConfig = this.negativeInteger;
        break;
      case "xs:nonPositiveInteger":
        this.typeConfig = this.nonPositiveInteger;
        break;
      case "xs:nonNegativeInteger":
        this.typeConfig = this.nonNegativeInteger;
        break;

    }
  }

  public keyUp(evt) {

    let cVal = evt.srcElement.value;

    if (cVal == "") {
      this.inputNotOK = true;
      this.inputOK = false;
      return;
    }
    let cNum = Number(cVal);
    this.checkValid(cNum, true);
  }

  public checkValid(cNum, warning: boolean) {


    if (isNaN(cNum)) {
      this.inputNotOK = true;
      this.inputOK = false;
      if (warning) {
        alert("Only integer values allowed");
      }
      return this.inputOK;
    }

    if (cNum < this.typeConfig.minValue || cNum > this.typeConfig.maxValue) {
      this.inputNotOK = true;
      this.inputOK = false;
      if (warning) {
        alert("Value must be between " + this.typeConfig.minValue + " and " + this.typeConfig.maxValue)
      }
      return this.inputOK;
    } else {
      this.inputOK = true;
      this.inputNotOK = false;
      return this.inputOK;
    }
  }

  setElementParent(parent: SimpleComponent) {
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
}
