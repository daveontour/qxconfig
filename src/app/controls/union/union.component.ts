import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-union',
  templateUrl: './union.component.html'
})


export class UnionComponent extends ControlComponent {

   i : number = 0;
   value: any;
  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  }

}
