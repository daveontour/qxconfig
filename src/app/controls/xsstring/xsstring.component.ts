import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-xsstring',
  templateUrl: './xsstring.component.html'
})

export class XSStringComponent extends ControlComponent {
  popover : string;

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
    this.popover = "Fix Popover";
  }

  getPopOver(){
    return "Dave was Here";
  }
}
