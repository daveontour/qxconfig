import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html'
})

// Simple control that just uses a supplied regex pattern for validation of the text input field
// This is the default controller. Regex pattern will be defualt set to anything
export class BaseComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver, global);
  }

  setUpCommon(){
    this.popOverContent = "Length: min("+this.config.minLength+"), max("+this.config.maxLength+"), Pattern: "+this.config.pattern;
    
    if (typeof this.config.modelDescription != 'undefined')
    this.popOverContent = this.config.modelDescription+"\n"+this.popOverContent;
}
}
