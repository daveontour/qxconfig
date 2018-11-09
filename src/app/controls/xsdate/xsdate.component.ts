import { Globals } from '../../services/globals';
import { AttributeComponent } from './../../components/attribute/attribute.component';
import { SimpleComponent } from './../../components/simple/simple.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';


@Component({
  selector: 'app-xsdateg',
  templateUrl: './xsdate.component.html'
})

export class XSDateComponent extends ControlComponent {

  d: Date;
  do: any;

  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver,global);
  

    this.d = new Date();

    this.do = {
      year: this.d.getFullYear(),
      month: this.d.getMonth()+1,
      day: this.d.getDate()
    }
  }

  setUpCommon(){

}


  getValue(){

    // debugger;
    // let day = this.config.value.day;
    // let month = this.config.value.month;

    // if (Number(this.config.value.month) < 10){
    //   month = "0".concat(this.config.value.month);
    // }
    // if (Number(this.config.value.day) < 10){
    //   day = "0".concat(this.config.value.day);
    // }
    // let x = this.config.value.year + "-" + month + "-" + day;
    
    return "FIX THIS";
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
    this.config.value = this.do;
    this.setUpCommon();
  }
}
