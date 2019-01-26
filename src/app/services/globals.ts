import { Messenger } from './messenger';
import { GenericAlertComponent } from './../components/utils/genericalert/generic-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class Globals {

  public static OK = 1;
  public static STRUCTURECHANGE = -1;
  public static ATTRIBUTEHANDLED = 2;
  public static VALUEHANDLED = 3;

  /**
  * The Jenkins job that deploys the package has a build step
  * that uses SED to edit this file to replace the below two
  *  parameters with relative parameters
  */

  public baseURL = 'http://localhost:8080/XSD2XML/json';
  public baseURLValidate = 'http://localhost:8080/XSD2XML/validate';
  public baseURLUploadEntered = 'http://localhost:8080/XSD2XML/upload?uploadType=enteredxsd&sessionID=';
  public baseURLUploadFiles = 'http://localhost:8080/XSD2XML/upload?uploadType=files&sessionID=';
  public baseURLUploadAndSaveFiles = 'http://localhost:8080/XSD2XML/upload?uploadType=uploadandsave&sessionID=';
  public baseURLSaveFileReflector = 'http://localhost:8080/XSD2XML/upload?uploadType=savefilereflector&sessionID=';
  public baseURLSaveXMLFileReflector = 'http://localhost:8080/XSD2XML/upload?uploadType=savexmlfilereflector&sessionID=';

  public buildNumber = 'localbuild';

  public xmlMessage = '';
  public sampleXMLMessage = '';
  public XMLMessage = '';
  public alerts = 'No alerts';
  public elementsUndefined: string[] = [];
  public attributesUndefined: string[] = [];
  public formatErrors: string[] = [];
  public selectedSchema: string;
  public selectedFile: string;
  public selectedType: string;
  public sessionID = 'new';
  public selectionMethod: string;
  public triggers = 'mouseenter:mouseleave';
  public showPopovers = true;
  public editor: any;
  public lockEditorUpdates = false;
 // public undoStack: SaveObj[] = [];
  public root: any;
  private lockChangeDetection = false;
  private lockStack = [];
  public clean = true;
  public enteredXSD = '';

  constructor(
    private modalService: NgbModal,
    private messenger: Messenger
  ) {}

  // THe lock prevents continuous updating of generated XML
  // It uses a stack of locks, so everyone who calls for a lock is
  // also reponsible for
  lockChangeDet() {
    this.lockChangeDetection = true;
    this.lockStack.push(true);
  }
  enableChangeDet() {
    this.lockStack.pop();

    if (this.lockStack.length === 0) {
      this.lockChangeDetection = false;
    }
  }
  clearLocks() {
    this.lockStack = [];
    this.lockChangeDetection = false;
  }
  componentChanged() {
    if (!this.lockChangeDetection) {
      this.getString();
    }
  }
  formLoaded() {
    if (!this.lockChangeDetection) {
      this.getString();
    }
  }
  childRemoved() {
    if (!this.lockChangeDetection) {
      this.getString();
    }
  }
  siblingAdded() {
    if (!this.lockChangeDetection) {
      this.getString();
    }
  }
  controlChange() {
    if (!this.lockChangeDetection) {
      this.getString();
    }
  }

  getString() {

    if (this.lockChangeDetection) {
      return;
    }
 
    $('body').addClass('waiting');
 
    setTimeout(() => {
      this.lockEditorUpdates = true;
      this.alerts = '';
      this.formatErrors = [];
      this.elementsUndefined = [];
      this.attributesUndefined = [];
      this.sampleXMLMessage = this.formatXML(this.root.getElementString(''));
      this.XMLMessage = this.sampleXMLMessage;
      this.lockEditorUpdates = false;

      // Put it on the undoSack
   //   this.undoStack.push(this.root.getSaveObj());
      this.messenger.setDocumentDirty();
      $('body').removeClass('waiting');
    }, 0 );
  }

  public openModalAlert(title: string, message: string, message2: string = '') {
    const modalRef = this.modalService.open(GenericAlertComponent, { centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.message2 = message2;
    modalRef.componentInstance.button1 = 'Close';
    modalRef.componentInstance.showButton2 = false;
  }

  public openModalQuestion(title: string, message: string, message2: string = '', button1: string, button2: string,
   button1Fn: any, button2Fn: any, param1: any, param2: any) {
    const modalRef = this.modalService.open(GenericAlertComponent, {backdrop: 'static'});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.message2 = message2;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    modalRef.componentInstance.button1Fn = button1Fn;
    modalRef.componentInstance.button2Fn = button2Fn;
    modalRef.componentInstance.showButton2 = true;
    modalRef.componentInstance.param1 = param1;
    modalRef.componentInstance.param2 = param2;
  }
  public guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }

  formatXML(xml) {
    let reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
    let wsexp = / *(.*) +\n/g;
    let contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    let pad = 0;
    let formatted = '';
    let lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    let transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };

    for (let i = 0; i < lines.length; i++) {
      let ln = lines[i];

      // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
      if (ln.match(/\s*<\?xml/)) {
        formatted += ln + "\n";
        continue;
      }
      // ---

      let single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      let closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      let opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      let type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      let fromTo = lastType + '->' + type;
      lastType = type;
      let padding = '';

      indent += transitions[fromTo];
      for (let j = 0; j < indent; j++) {
        padding += '  ';
      }
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      } else {
        formatted += padding + ln + '\n';
      }
    }

    return formatted;
  }
}

export class XMLElement {
  constructor(n: string) {
    if (n.indexOf(':') !== -1) {
      n = n.substring(n.indexOf(':') + 1);
    }
    this.name = n;
  }
  name: string;
  path: string;
  value: string;
  parent: XMLElement;
  children: XMLElement[] = [];
  attributes: XMLAttribute[] = [];
  setValue(v: string) {
    this.value = v;
  }
}

export class XMLAttribute {
  constructor(n: string) {
    this.name = n;
  }
  name: string;
  value: string;
  setValue(v: string) {
    this.value = v;
  }
}

export class SaveObj {
  n: string;
  v: any;
  tl: boolean;
  a: AttItemConfig[] = [];
  c: SaveObj[] = [];
  s: SaveObj[] = [];
  sel: string;
  p: string;
  choice = false;
}

export class SaveObjFile {
  o: SaveObj;
  c: string;
  f: string;
  t: string;
  m: string;
  e: string;
  error: string;
  fls: XSDFile[] = [];
}

export class AttItemConfig {
  n: string;
  v: any;
  e: boolean;

  constructor( name: string, value: any, enabled: boolean) {
    this.n = name;
    this.v = value;
    this.e = enabled;
  }
}
export class XSDFile {
  n: string;
  c: string;
}
