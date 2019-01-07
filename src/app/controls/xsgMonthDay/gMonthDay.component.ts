import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-gMonthDay',
  templateUrl: './gMonthDay.component.html'
})


export class XSGMonthDayComponent extends ControlComponent {

  valueMonths: any;
  valueDays: any;

  months:any[] = [
    {"d":"01", "v":'--01'},
    {"d":"02", "v":'--02'},
    {"d":"03", "v":'--03'},
    {"d":"04", "v":'--04'},
    {"d":"05", "v":'--05'},
    {"d":"06", "v":'--06'},
    {"d":"07", "v":'--07'},
    {"d":"08", "v":'--08'},
    {"d":"09", "v":'--09'},
    {"d":"10", "v":'--10'},
    {"d":"11", "v":'--11'},
    {"d":"12", "v":'--12'}
  ];

  days:any[] = [
    {"d":"01", "v":'---01'},
    {"d":"02", "v":'---02'},
    {"d":"03", "v":'---03'},
    {"d":"04", "v":'---04'},
    {"d":"05", "v":'---05'},
    {"d":"06", "v":'---06'},
    {"d":"07", "v":'---07'},
    {"d":"08", "v":'---08'},
    {"d":"09", "v":'---09'},
    {"d":"10", "v":'---10'},
    {"d":"11", "v":'---11'},
    {"d":"12", "v":'---12'},
    {"d":"13", "v":'---13'},
    {"d":"14", "v":'---14'},
    {"d":"15", "v":'---15'},
    {"d":"16", "v":'---16'},
    {"d":"17", "v":'---17'},
    {"d":"18", "v":'---18'},
    {"d":"19", "v":'---19'},
    {"d":"20", "v":'---20'},
    {"d":"21", "v":'---21'},
    {"d":"22", "v":'---22'},
    {"d":"23", "v":'---23'},
    {"d":"24", "v":'---24'},
    {"d":"25", "v":'---25'},
    {"d":"26", "v":'---26'},
    {"d":"27", "v":'---27'},
    {"d":"28", "v":'---28'},
    {"d":"29", "v":'---29'},
    {"d":"30", "v":'---30'},
    {"d":"31", "v":'---31'}
  ];
  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  setUpCommon() {

  }

  public change() {

    if (typeof this.valueMonths === 'undefined' || typeof this.valueDays === 'undefined' ) {
      delete this.config.value;
    } else {
      this.config.value =  this.valueMonths + this.valueDays.substring(2);
    }

    this.global.controlChange();

  }
}
