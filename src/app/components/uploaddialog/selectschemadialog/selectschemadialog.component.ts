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

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals
  ) { }

  ngOnInit(  ) {
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
