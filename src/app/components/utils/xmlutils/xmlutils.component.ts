

import { Globals } from './../../../services/globals';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';

@Component({
  selector: 'app-xmlutils',
  templateUrl: './xmlutils.component.html',
  styleUrls: ['./xmlutils.component.scss']
})
export class XmlutilsComponent  {
  @ViewChild('xmlEditor') editor;

  showChrome = true;
  showEclipse = false;
  enteredXML = '';
  theme = 'chrome';

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) { }

  format() {
    this.enteredXML = this.global.formatXML(this.enteredXML);
  }

  copytoclip() {
    this.editor.getEditor().selectAll();
    document.execCommand('copy');
    this.global.openModalAlert('Copy to Clipboard', 'The XML has been copied to the clipboard');
  }

  removeComments() {
    this.enteredXML = this.enteredXML.replace(/<!--[\s\S]*?-->/g, '' );
  }

  c(reason: string) {
    this.modalService.dismissAll();
  }
  d(reason: string) {
    this.modalService.dismissAll();
  }
}
