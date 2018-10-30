import { Globals } from './../../globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-xsdecimal',
  templateUrl: './xsdecimal.component.html'
})

export class XSDecimalComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  }


}
