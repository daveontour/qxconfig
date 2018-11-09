import { Globals } from './../services/globals';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-alertswindow',
  templateUrl: './alertswindow.component.html',
  styleUrls: ['./alertswindow.component.scss']
})
export class AlertswindowComponent implements OnInit {

  constructor( public global: Globals) { }

  ngOnInit() {
  }

  hasWarning(){
    return this.global.attributesUndefined.length > 0 || this.global.elementsUndefined.length > 0;
  }

}
