import { Component, OnInit } from '@angular/core';
import { Globals } from './../../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';

@Component({
  selector: 'app-selectschemadialog',
  templateUrl: './selectschemadialog.component.html',
  styleUrls: ['./selectschemadialog.component.scss']
})
export class SelectschemadialogComponent implements OnInit {

  tabIndex = 0;
  tabDescription: string;

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals
  ) { }

  ngOnInit() {
    switch (this.global.selectionMethod) {
      case 'pre':
        this.tabIndex = 0;
        break;
      case 'user':
        this.tabIndex = 1;
        break;
      case 'enter':
        this.tabIndex = 2;
        break;
      default:
        this.tabIndex = 0;
    }

    this.indexChange(this.tabIndex);
  }

  indexChange(event) {
    this.tabIndex = event;
    switch (this.tabIndex) {
      case 0:
        this.tabDescription = 'Select from the sechma sets that have been preloaded';
        break;
      case 1:
        this.tabDescription = 'Choose a set of schema files or a zip file contatining a set of schema files';
        break;
      case 2:
        this.tabDescription = 'Enter the XML Schema Defition directly';
        break;
    }
  }

  c(reason: string) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }
  d(reason: string) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }
}
