import { Globals } from '../../services/globals';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { SimpleComponent } from '../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';
import * as moment from "moment";


@Component({
  selector: 'app-xsdateTime',
  templateUrl: './xsdateTime.component.html'
})

export class XSDateTimeComponent extends ControlComponent {

  d:  moment.Moment = moment();
  do: moment.Moment = moment();

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  
 }

  setUpCommon(){}


  getValue(){
    return this.d.toISOString();
  }

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.config.value = this.do;
    this.bElement = true;
    this.setUpCommon();

  }
  setAttribParent(parent: AttributeComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.setUpCommon();
  }
}
