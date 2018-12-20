import { Globals } from '../../services/globals';
import { SimpleComponent } from '../../components/simple/simple.component';
import { AttributeComponent } from '../../components/attribute/attribute.component';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';



@Component({
  selector: 'app-minmaxinclusive',
  templateUrl: './minmaxinclusive.component.html',
  styleUrls: ['./minmaxinclusive.component.scss']
})


export class MinMaxInclusiveComponent extends ControlComponent {
  num = 0;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  public setUpCommon() {

    // Enable it for inclusive and exclussive use
    if (typeof this.config.maxExclusive !== 'undefined') {
      this.config.maxInclusive = this.config.maxExclusive - 1;
    }
    if (typeof this.config.minExclusive !== 'undefined') {
      this.config.minInclusive = this.config.minExclusive + 1;
    }

    if (typeof this.config.modelDescription !== 'undefined') {
      this.popOverContent = this.config.modelDescription + '\n' + this.popOverContent;
    }
  }

  clickNum(step: number) {


    this.num = Number(this.config.value) + step;

    if (this.config.minInclusive == null) {
      this.config.minInclusive = -1 * Number.MAX_SAFE_INTEGER;
    }
    if (this.config.maxInclusive == null) {
      this.config.maxInclusive = Number.MAX_SAFE_INTEGER;
    }
    if (this.num < this.config.minInclusive) {
      this.num = this.config.minInclusive;
    }
    if (this.num > this.config.maxInclusive) {
      this.num = this.config.maxInclusive;
    }

    this.config.value = String(this.num);
    this.change();
  }

  setAttribParent(parent: AttributeComponent) {

    this.parent = parent;
    this.config = parent.config;
    this.bElement = false;
    this.num = Number(this.config.minInclusive);
    if (isNaN(this.num)) {
      this.num = 1;
    }
    this.config.value = String(this.num);
    this.setUpCommon();
  }

  setElementParent(parent: SimpleComponent) {
    this.parent = parent;
    this.config = parent.config;
    this.bElement = true;
    this.num = Number(this.config.minInclusive);
    if (isNaN(this.num)) {
      this.num = 1;
    }
    this.config.value = String(this.num);
    this.setUpCommon();
  }
}
