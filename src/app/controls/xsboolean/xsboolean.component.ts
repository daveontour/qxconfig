
import { Globals } from '../../services/globals';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { SimpleComponent } from '../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';


@Component({
  selector: 'app-xsboolean',
  templateUrl: './xsboolean.component.html'
})


export class XSBooleanComponent extends ControlComponent {

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver, global);
  }

  setUpCommon(){
    this.popOverContent = "Length: min("+this.config.minLength+"), max("+this.config.maxLength+"), Pattern: "+this.config.pattern;
    
    if (typeof this.config.modelDescription != 'undefined')
    this.popOverContent = this.config.modelDescription+"\n"+this.popOverContent;
}

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.config.value = "true";
    this.bElement = true;

  }
  setAttribParent(parent: AttributeComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.config.value = "true";
  }
}
