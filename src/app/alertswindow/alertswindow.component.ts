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
    return this.global.attributesUndefined.length > 0 || this.global.elementsUndefined.length > 0 || this.global.formatErrors.length > 0;
  }

  hasAttributeWarnings(){
    return this.global.attributesUndefined.length > 0 
  }
  hasElementWarnings(){
    return this.global.elementsUndefined.length > 0;
  }

  hasFormatErrors(){
    return this.global.formatErrors.length > 0;
  }
}
