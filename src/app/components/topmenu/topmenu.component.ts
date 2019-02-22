import { AboutComponent } from './../utils/about/about.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from './../../services/globals';
import { Messenger } from './../../services/messenger';
import { Component } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent {

  showPop = false;

  constructor(
    private messenger: Messenger,
    public global: Globals,
    private modalService: NgbModal
  ) { }

  selectType(method) {
    this.hideMenu();
     this.messenger.selectSchema(method);
  }

   goHome() {
    this.hideMenu();
    this.messenger.goHome();
  }

  save() {
    this.hideMenu();
    this.messenger.save();
  }
  showXSD() {
    this.hideMenu();
    this.messenger.showXSD();
  }

  apply() {
    this.hideMenu();
    this.messenger.apply();
  }

  showXMLUtils() {
    this.hideMenu();
    this.messenger.xmlUtils();
  }

  about() {
    this.modalService.open(AboutComponent, { centered: true, backdrop: 'static', size: 'lg' });
  }

  showMenu() {
    $('.menuBlock').css('display', 'grid');
    $('.menuBlock2').css('display', 'none');
  }
  hideMenu() {
    $('.menuBlock').css('display', 'none');
  }
}
