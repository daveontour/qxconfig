import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-enumlist',
  templateUrl: './enumlist.component.html'
})


export class EnumListComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver, global);
  }

  setUpCommon(){
    this.popOverContent = "Length: min("+this.config.minLength+"), max("+this.config.maxLength+"), Pattern: "+this.config.pattern;
    
    if (typeof this.config.modelDescription != 'undefined')
    this.popOverContent = this.config.modelDescription+"\n"+this.popOverContent;
}
}
