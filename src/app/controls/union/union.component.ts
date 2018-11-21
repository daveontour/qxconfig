
import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ControlComponent } from '../control/control.component';
import { XSGMonthDayComponent } from '../../controls/xsgMonthDay/gMonthDay.component';
import { XSNumberComponent } from '../../controls/xsnumber/xsnumber.component';
import { XSGDayComponent } from '../../controls/xsgDay/gDay.component';
import { XSGMonthComponent } from '../../controls/xsgMonth/gMonth.component';
import { XSTimeComponent } from '../../controls/xstime/xstime.component';
import { XSDateTimeComponent } from '../../controls/xsdateTime/xsdateTime.component';
import { XSDateComponent } from '../../controls/xsdate/xsdate.component';
import { BaseNullComponent } from '../../controls/basenull/basenull.component';
import { XSDecimalComponent } from '../../controls/xsdecimal/xsdecimal.component';
import { XSLanguageComponent } from '../../controls/xslanguage/xslanguage.component';
import { XSIntegerComponent } from '../../controls/xsinteger/xsinteger.component';
import { XSStringComponent } from '../../controls/xsstring/xsstring.component';
import { BaseComponent } from '../../controls/base/base.component';
import { EnumListComponent } from '../../controls/enumlist/enumlist.component';
import { PatternComponent } from '../../controls/pattern/pattern.component';
import { XSBooleanComponent } from '../../controls/xsboolean/xsboolean.component';
import { MinMaxLengthComponent } from '../../controls/minmaxlength/minmaxlength.component';
import { MinMaxInclusiveComponent } from '../../controls/minmaxinclusive/minmaxinclusive.component';

@Component({
  selector: 'app-union',
  templateUrl: './union.component.html',
  styleUrls: ['./union.component.css']
})


export class UnionComponent extends ControlComponent implements AfterViewInit {
  @ViewChild("members", { read: ViewContainerRef }) membersPt;
  members :any[] = [];
  activeMember:ControlComponent;


  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  ngAfterViewInit() {

    this.config.union.forEach(x => {
      if (this.config.model != null) {
        let factory = this.getFactory(x.model, this.resolver);
        let controlRef = this.membersPt.createComponent(factory);
        controlRef.instance.setElementParent(this);
        controlRef.instance.unionMember = true;
        this.activeMember = controlRef;
      }
    });
  }

  public memberChange(member){
    debugger;
    this.activeMember = member;
    this.global.getString();
  }

  getValue() {

    debugger;
    if (typeof this.activeMember == "undefined"){
      return "undefined";
    }
    let value = this.activeMember.getValue();

    if (typeof value == "undefined") {
      if (this.bElement) {
        this.global.elementsUndefined.push(this.parent.elementPath);
      } else {
        this.global.attributesUndefined.push(this.parent.elementPath);
      }
    }
    return value;
  }

  setUpCommon() {
    this.popOverContent = "Length: min(" + this.config.minLength + "), max(" + this.config.maxLength + "), Pattern: " + this.config.pattern;

    if (typeof this.config.modelDescription != 'undefined')
      this.popOverContent = this.config.modelDescription + "\n" + this.popOverContent;
  }

  public setElementParent(parent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = true;
    this.setUpCommon();
  }

  public setAttribParent(parent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.setUpCommon();
  }

  getFactory(model: string, resolver: any) {

    if (model == null) {
      return  resolver.resolveComponentFactory(BaseNullComponent);
    }

    var factory: any;

    switch (model) {
      case "enum":
        factory = resolver.resolveComponentFactory(EnumListComponent);
        break;
      case "integerLimited":
        factory = resolver.resolveComponentFactory(MinMaxInclusiveComponent);
        break;
        case "minmaxlengthpattern":
        case "minMaxLength":
        case "minLength":
        case "maxLength":
        factory = resolver.resolveComponentFactory(MinMaxLengthComponent);
        break;
      case "xs:boolean":
        factory = resolver.resolveComponentFactory(XSBooleanComponent);
        break;
        case "xs:string":
        case "xs:normalizedString":
        case "xs:token":
        case "xs:language":
        case "xs:NMTOKEN":
        case "xs:NMTOKENS":
        case "xs:Name":
        case "xs:NCName":
        case "xs:ID":
        case "xs:IDREF":
        case "xs:IDREFS":
        case "xs:ENTITY":
        case "xs:ENTITIES":
        factory = resolver.resolveComponentFactory(XSStringComponent);
        break;
      case "xs:integer":
        factory = resolver.resolveComponentFactory(XSIntegerComponent);
        break;
      case "xs:language":
        factory = resolver.resolveComponentFactory(XSLanguageComponent);
        break;
        case "xs:decimal":
        factory = resolver.resolveComponentFactory(XSDecimalComponent);
        break;
        case "xs:date":
        factory = resolver.resolveComponentFactory(XSDateComponent);
        break;
        case "xs:time":
        factory = resolver.resolveComponentFactory(XSTimeComponent);
        break;
        case "xs:dateTime":
        factory = resolver.resolveComponentFactory(XSDateTimeComponent);
        break;
        case "xs:gDay":
        factory = resolver.resolveComponentFactory(XSGDayComponent);
        break;
        case "xs:gMonthDay":
        factory = resolver.resolveComponentFactory(XSGMonthDayComponent);
        break;
        case "xs:gMonth":
        factory = resolver.resolveComponentFactory(XSGMonthComponent);
        break;
 
        case "xs:byte":
        case "xs:int":
        case "xs:long":
        case "xs:short":
        case "xs:unsignedByte":
        case "xs:unsignedInt":
        case "xs:unsignedLong":
        case "xs:unsignedShort":
        case "xs:positiveInteger":
        case "xs:negativeInteger":
        case "xs:nonPositiveInteger":
        case "xs:nonNegativeInteger":
        factory = resolver.resolveComponentFactory(XSNumberComponent);
        break;
        case "pattern":
        factory = resolver.resolveComponentFactory(PatternComponent);
        break;
        case "union":
        factory = resolver.resolveComponentFactory(UnionComponent);
        break;
      default:
        factory = resolver.resolveComponentFactory(BaseComponent);
        break;
    }

    return factory;
  }


}
