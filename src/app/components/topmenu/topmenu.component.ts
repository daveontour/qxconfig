import { Messenger } from './../../services/messenger';
import { Component } from '@angular/core';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent {
  constructor(
    private messenger: Messenger
  ) { }

  selectType(method) {
     this.messenger.selectSchema(method);
  }

  settings() {
    this.messenger.settings();
  }

  goHome() {
    this.messenger.goHome();
  }

  save() {
    this.messenger.save();
  }
  showXSD() {
    this.messenger.showXSD();
  }

  apply() {
    this.messenger.apply();
  }
  undo() {
    this.messenger.undo();
  }

  validate() {
    this.messenger.validate();
  }
}
