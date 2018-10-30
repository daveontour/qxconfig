import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
 // baseURL: string = 'http://aidx.quaysystems.com.au';
  baseURL: string = 'http://localhost:8080/XSD_Forms/json';
  xmlMessage: string = "";
  sampleXMLMessage: string = "";
  root:any;

  getString(){
    try {
    this.sampleXMLMessage =this.root.getElementString("");
    } catch {
      console.log("globals.ts, line 13 error");
    }
  }

 public guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }
  
}