import { Globals } from './../../globals';
import { SimpleComponent } from '../../components/simple/simple.component';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';



@Component({
  selector: 'app-minmaxinclusive',
  templateUrl: './minmaxinclusive.component.html'
})


export class MinMaxInclusiveComponent extends ControlComponent {
  num: number = 0;
 
  constructor(public resolver: ComponentFactoryResolver, public global:Globals) {
    super(resolver, global);
  }

  clickNum(step:number) {

 
    this.num = Number(this.config.value) + step;

    if ( this.config.minInclusive == null){
      this.config.minInclusive = 1;
    }
    if ( this.config.maxInclusive == null){
      this.config.maxInclusive = Number.MAX_SAFE_INTEGER;
    }  
    if (this.num < this.config.minInclusive) {
      this.num = this.config.minInclusive;
    }
    if (this.num > this.config.maxInclusive) {
      this.num = this.config.maxInclusive;
    }

    this.config.value = String(this.num);
  }

  setAttribParent(parent: AttributeComponent) {

    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.num = Number(this.config.minInclusive);
    if (isNaN(this.num)){
      this.num = 1;
     }
     this.config.value = String(this.num);
  }

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = true;
    this.num = Number(this.config.minInclusive);
    if (isNaN(this.num)){
      this.num = 1;
    }
    this.config.value = String(this.num);

  }
}
