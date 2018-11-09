import { Globals } from '../../services/globals';
import { AttributeComponent } from './../../components/attribute/attribute.component';
import { SimpleComponent } from './../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';
import * as moment from "moment";


@Component({
  selector: 'app-xsdateg',
  templateUrl: './xsdate.component.html'
})

export class XSDateComponent extends ControlComponent {

  d:  moment.Moment = moment();
  do: moment.Moment = moment();

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  
 }

  setUpCommon(){

}


  getValue(){
    // if (typeof this.d == 'undefined'){
    //   return "Pending";
    // }

    let m: string;
    let da: string;
    let month = 1 + this.d.month();
    if (month < 10) {
        m = '0' + month;
    } else {
      m = ''+month;
    }
    var day = this.d.date()
    if (day < 10) {
        da = '0' + day
    } else {
      da = ''+day;
    }
    return this.d.year()+"-"+m+'-'+da;
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
