import { Globals } from './../../globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-basenull',
  templateUrl: './basenull.component.html'
})

// Simple control that just uses a supplied regex pattern for validation of the text input field
// This is the default controller. Regex pattern will be defualt set to anything
export class BaseNullComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver, global);
  }
}
