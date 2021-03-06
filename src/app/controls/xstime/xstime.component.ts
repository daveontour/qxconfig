import { Globals } from '../../services/globals';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { SimpleComponent } from '../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';
import * as moment from 'moment';


@Component({
  selector: 'app-xstime',
  templateUrl: './xstime.component.html'
})

export class XSTimeComponent extends ControlComponent {

  d:  moment.Moment = moment();

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
 }

  setUpCommon() {

}
  getValue() {
    return this.d.format('HH:mm:ssZ');
  }

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.config.value = this.d;
    this.bElement = true;
    this.setUpCommon();

  }
  setAttribParent(parent: AttributeComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.setUpCommon();
  }
  tickle() {
    this.d = moment(this.config.value);
  }
}
