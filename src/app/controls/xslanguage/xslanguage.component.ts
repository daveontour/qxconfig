import { Globals } from './../../globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-xslanguage',
  templateUrl: './xslanguage.component.html'
})

export class XSLanguageComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  }
}
