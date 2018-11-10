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

  unsignedbyte = {
    "minValue": 0,
    "maxValue": 255,
    "description": "Integer value between 0 and 255"
  }
  unsignedint = {
    "minValue": 0,
    "maxValue": 4294967295,
    "description": "Integer value between  0  and 4294967295"
  }

  unsignedlong = {
    "minValue": 0,
    "maxValue": 18446744073709551615,
    "description": "Integer value between 0  and 18446744073709551615"
  }
  unsignedshort = {
    "minValue": 0,
    "maxValue": 65535,
    "description": "Integer value between 0  and 65535"
  }
  positiveinteger = {
    "minValue": 1,
    "maxValue": Number.MAX_SAFE_INTEGER,
    "description": "Positive Integer equal or greater than 1"
  }
  nonpositiveinteger = {
    "minValue": -1 * Number.MAX_SAFE_INTEGER,
    "maxValue": 0,
    "description": "Negative Integer 0 or less"
  }
  nonnegativeinteger = {
    "minValue": 0,
    "maxValue": Number.MAX_SAFE_INTEGER,
    "description": "Positive Integer 0 or greater"
  }
  negativeinteger = {
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
      case "xs:unsignedbyte":
        this.typeConfig = this.unsignedbyte;
        break;
      case "xs:unsignedint":
        this.typeConfig = this.unsignedint;
        break;
      case "xs:unsignedlong":
        this.typeConfig = this.unsignedlong;
        break;
      case "xs:unsignedshort":
        this.typeConfig = this.unsignedshort;
        break;
      case "xs:positiveinteger":
        this.typeConfig = this.positiveinteger;
        break;
      case "xs:negativeinteger":
        this.typeConfig = this.negativeinteger;
        break;
      case "xs:nonpositiveinteger":
        this.typeConfig = this.nonpositiveinteger;
        break;
      case "xs:nonnegativeinteger":
        this.typeConfig = this.nonnegativeinteger;
        break;

    }
  }

  public keyUp(evt) {

    debugger;

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
    return this.inputOK;
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
