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

  xsstring = {
    "modelDescription":"The type xsd:string represents a character string that may contain any Unicode character allowed by XML. Certain characters, namely the 'less than' symbol (<) and the ampersand (&), must be escaped (using the entities &lt; and &amp;, respectively) when used in strings in XML instances.", 
    "pattern":".*"
  };
  xsnormalizedString = {
    "modelDescription":"The type xsd:string represents a character string that may contain any Unicode character allowed by XML. Certain characters, namely the 'less than' symbol (<) and the ampersand (&), must be escaped (using the entities &lt; and &amp;, respectively) when used in strings in XML instances. Carriage returns, linefeeds and tabs will be replaced by a single space",
    "pattern":".*"
  };
  xstoken = {
    "modelDescription":"The type xsd:string represents a character string that may contain any Unicode character allowed by XML. Certain characters, namely the 'less than' symbol (<) and the ampersand (&), must be escaped (using the entities &lt; and &amp;, respectively) when used in strings in XML instances. Carriage returns, linefeeds and tabs will be replaced by a single space. Multiple spaces are replaced by a single space, leading and trailing spaces removed",
    "pattern":".*"
  };
  xslanguage = {
    "modelDescription":"Values of the xsd:language type conform to RFC 3066, Tags for the Identification of Languages.",
    "pattern": "[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*"
  };
  xsNMTOKEN = {
    "modelDescription":"The type xsd:NMTOKEN represents a single string token. xsd:NMTOKEN values may consist of letters, digits, periods (.), hyphens (-), underscores (_), and colons (:). They may start with any of these characters. xsd:NMTOKEN has a whiteSpace facet value of collapse, so any leading or trailing whitespace will be removed. However, no whitespace may appear within the value itself.",
    "pattern": "\c+"
  };
  xsNMTOKENS = {
    "pattern":".*",
    "modelDescription":"List of NMTOKENS"
  };
  xsName = {
    "pattern": "\\i\\c*",
    "modelDescription":"The type xsd:Name represents an XML name, which can be used as an element-type name or attribute name, among other things. Specifically, this means that values must start with a letter, underscore(_), or colon (:), and may contain only letters, digits, underscores (_), colons (:), hyphens (-), and periods (.). Colons should only be used to separate namespace prefixes from local names."
    };
  xsNCName = {
    "pattern": "[\\i-[:]][\\c-[:]]*",
    "modelDescription":"The type xsd:NCName represents an XML non-colonized name, which is simply a name that does not contain colons. An xsd:NCName value must start with either a letter or underscore (_) and may contain only letters, digits, underscores (_), hyphens (-), and periods (.). This is equivalent to the Name type, except that colons are not permitted."
  };
  xsID = {
    "pattern": "[\\i-[:]][\\c-[:]]*",
    "modelDescription":"The type xsd:ID is used for an attribute that uniquely identifies an element in an XML document. An xsd:ID value must be an NCName. This means that it must start with a letter or underscore, and can only contain letters, digits, underscores, hyphens, and periods."
  };
  xsIDREF = {
    "pattern": "[\\i-[:]][\\c-[:]]*",
    "modelDescription":"The type xsd:IDREF is used for an attribute that references an ID. All attributes of type xsd:IDREF must reference an xsd:ID in the same XML document. A common use case for xsd:IDREF is to create a cross-reference to a particular section of a document. Like ID, an xsd:IDREF value must be an NCName."
  };
  xsIDREFS = {
    
  };
  xsENTITY = {
    "pattern": "[\\i-[:]][\\c-[:]]*",
    "modelDescription":"The type xsd:ENTITY represents a reference to an unparsed entity. The xsd:ENTITY type is most often used to include information from another location that is not in XML format, such as graphics. An xsd:ENTITY value must be an NCName. An xsd:ENTITY value carries the additional constraint that it must match the name of an unparsed entity in a document type definition (DTD) for the instance."
  };
  xsENTITIES = {};
  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  public change() {
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
          valid = false;
          if (warn) {
            this.global.formatErrors.push("Unescaped '<' symbol " + this.parent.elementPath);
          }
        }
        if (val.indexOf("&") != val.indexOf("&amp;") && val.indexOf("&") != val.indexOf("&lt;")) {
          valid = false;
          if (warn) {
            this.global.formatErrors.push("Unescaped '&' symbol " + this.parent.elementPath);
          }
        }
        break;
    }
  }

 
}