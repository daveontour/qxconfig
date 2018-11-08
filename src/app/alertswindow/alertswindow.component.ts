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

}
