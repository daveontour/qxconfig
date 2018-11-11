import { XSGMonthDayComponent } from './../controls/xsgMonthDay/gMonthDay.component';
import { XSNumberComponent } from './../controls/xsnumber/xsnumber.component';
import { XSGDayComponent } from './../controls/xsgDay/gDay.component';
import { XSGMonthComponent } from './../controls/xsgMonth/gMonth.component';
import { XSTimeComponent } from './../controls/xstime/xstime.component';
import { XSDateTimeComponent } from './../controls/xsdateTime/xsdateTime.component';
import { UnionComponent } from './../controls/union/union.component';
import { Injectable } from '@angular/core';
import { XSDateComponent } from './../controls/xsdate/xsdate.component';
import { BaseNullComponent } from './../controls/basenull/basenull.component';
import { XSDecimalComponent } from './../controls/xsdecimal/xsdecimal.component';
import { XSLanguageComponent } from './../controls/xslanguage/xslanguage.component';
import { XSIntegerComponent } from './../controls/xsinteger/xsinteger.component';
import { XSStringComponent } from './../controls/xsstring/xsstring.component';
import { BaseComponent } from './../controls/base/base.component';
import { EnumListComponent } from './../controls/enumlist/enumlist.component';
import { PatternComponent } from './../controls/pattern/pattern.component';
import { XSBooleanComponent } from './../controls/xsboolean/xsboolean.component';
import { MinMaxLengthComponent } from './../controls/minmaxlength/minmaxlength.component';
import { MinMaxInclusiveComponent } from './../controls/minmaxinclusive/minmaxinclusive.component';

@Injectable()
export class WidgetFactory {
 
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
        case "xs:NMTOKEN":
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
        case "xs:unsignedbyte":
        case "xs:unsignedint":
        case "xs:unsignedlong":
        case "xs:unsignedshort":
        case "xs:positiveinteger":
        case "xs:negativeinteger":
        case "xs:nonpositiveinteger":
        case "xs:nonnegativeinteger":
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