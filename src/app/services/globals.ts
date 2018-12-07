import { Injectable} from '@angular/core';

@Injectable()
export class Globals {
  // baseURL: string = 'http://aidx.quaysystems.com.au';
  baseURL = 'http://localhost:8080/XSD_Forms/json';
  baseURLValidate = 'http://localhost:8080/XSD_Forms/validate';
  xmlMessage = '';
  sampleXMLMessage = '';
  XMLMessage = '';
  public alerts = 'No alerts';
  public elementsUndefined: string[] = [];
  public attributesUndefined: string[] = [];
  public formatErrors: string[] = [];
  public selectedSchema: string;
  public sessionID = 'new';
  root: any;


  getString() {
    this.alerts = '';
    this.formatErrors = [];
    this.elementsUndefined = [];
    this.attributesUndefined = [];
    this.sampleXMLMessage = this.formatXML(this.root.getElementString(''));
    this.XMLMessage = this.sampleXMLMessage;
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