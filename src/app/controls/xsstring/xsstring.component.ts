import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';
@Component({
  selector: 'app-xsstring',
  templateUrl: './xsstring.component.html'
})

export class XSStringComponent extends ControlComponent {
  popover: string;
  typeConfig: any;
  stringType: string;

  xsstring = {};
  xsnormalizedString = {};
  xstoken = {};
  xslanguage = {
    "pattern": "[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*"
  };
  xsNMTOKEN = {
    "pattern": "\c+"
  };
  xsNMTOKENS = {};
  xsName = {
    "pattern": "\\i\\c*"
  };
  xsNCName = {
    "pattern": "[\\i-[:]][\\c-[:]]*"
  };
  xsID = {
    "pattern": "[\\i-[:]][\\c-[:]]*"
  };
  xsIDREF = {
    "pattern": "[\\i-[:]][\\c-[:]]*"
  };
  xsIDREFS = {};
  xsENTITY = {
    "pattern": "[\\i-[:]][\\c-[:]]*"
  };
  xsENTITIES = {};
  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  public change() {
    debugger;
    this.validate(this.config.value, true);
    this.global.getString();
  }

  getValue() {
    this.validate(this.config.value, true);
    if (typeof this.config.value == "undefined") {
      if (this.bElement) {
        this.global.elementsUndefined.push(this.parent.elementPath);
      } else {
        this.global.attributesUndefined.push(this.parent.elementPath);
      }
    }
    return this.config.value;
  }

  setUpCommon() {

    switch (this.config.model) {
      case "xs:string":
        this.typeConfig = this.xsstring;
        break;
      case "xs:normalizedString":
        this.typeConfig = this.xsnormalizedString
        break;
      case "xs:token":
        this.typeConfig = this.xstoken;
        break;
      case "xs:language":
        this.typeConfig = this.xslanguage;
        break;
      case "xs:NMTOKEN":
        this.typeConfig = this.xsNMTOKEN;
        break;
      case "xs:NMTOKENS":
        this.typeConfig = this.xsNMTOKENS;
        break;
      case "xs:Name":
        this.typeConfig = this.xsName;
        break;
      case "xs:NCName":
        this.typeConfig = this.xsNCName;
        break;
      case "xs:ID":
        this.typeConfig = this.xsID;
        break;
      case "xs:IDREF":
        this.typeConfig = this.xsIDREF;
        break;
      case "xs:IDREFS":
        this.typeConfig = this.xsIDREFS;
        break;
      case "xsENTITY":
        this.typeConfig = this.xsENTITY;
        break;
      case "xsENTITIES":
        this.typeConfig = this.xsENTITIES;
        break;
    }
  }

  public validate(val: string, warn: boolean) {

    let valid: boolean = true;

    switch (this.config.model) {
      case "xs:string":
      case "xs:token":
      case "xs:language":
      case "xs:normalizedString":
      case "xs:NMTOKEN":
      case "xs:Name":
        if (val.indexOf("<") != -1) {
          if (warn) {
            this.global.formatErrors.push("Unescaped '<' symbol " + this.parent.elementPath);
          }
          valid = false;
        }
        if (val.indexOf("&") != val.indexOf("&amp;")) {
          if (val.indexOf("&") != val.indexOf("&lt;")) {
            if (warn) {
              this.global.formatErrors.push("Unescaped '&' symbol " + this.parent.elementPath);
            }
            valid = false;
          }
        }
        break;
    }
  }
}