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
    public global: Globals
  ) { }

  selectType(method) {
    this.hideMenu();
     this.messenger.selectSchema(method);
  }

  settings() {
    this.hideMenu();
    this.messenger.settings();
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

  showMenu() {
    $('.menuBlock').css('display', 'grid');
    $('.menuBlock2').css('display', 'none');
  }
  hideMenu() {
    $('.menuBlock').css('display', 'none');
  }
}
