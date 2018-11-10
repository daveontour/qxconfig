import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-gMonth',
  templateUrl: './gMonth.component.html'
})


export class XSGMonthComponent extends ControlComponent {

  items:any[] = [
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
  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  setUpCommon() {

  }
}
