import { Globals } from './../../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  popOver: boolean;

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) { }

  ngOnInit() {
  }

  changePop() {
    if (this.global.showPopovers) {
      this.messenger.setPopoverTrigger('mouseenter:mouseleave');
      this.global.triggers = 'mouseenter:mouseleave';
    } else {
      this.messenger.setPopoverTrigger('');
      this.global.triggers = '';
    }
  }

  c(reason) {
    this.modalService.dismissAll();
  }
  d(reason) {
    this.modalService.dismissAll();
  }
}
