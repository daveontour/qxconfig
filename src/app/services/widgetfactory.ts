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