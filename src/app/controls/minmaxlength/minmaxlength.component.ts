
import { Globals } from '../../services/globals';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
  selector: 'app-minmaxlength',
  templateUrl: './minmaxlength.component.html'
})

export class MinMaxLengthComponent extends ControlComponent {
  public placeholder: string;

  constructor(public resolver: ComponentFactoryResolver, public global: Globals) {
    super(resolver, global);
  }

  setUpCommon() {

    if (this.config.model == "maxLength") {
      this.config.minLength = 0;
      this.popOverContent = "Maximum Length: " + this.config.maxLength;
    }
    if (this.config.model == "minLength") {
      this.config.maxLength = Number.MAX_SAFE_INTEGER;
      this.popOverContent = "Minimum Length: " + this.config.minLength;
    }
    if (this.config.model == "minMaxLength") {
      this.popOverContent = "Minimum Length: " + this.config.minLength + ", Maximum Length: " + this.config.maxLength;
    }
    if (this.config.model == "minmaxlengthpattern") {
      this.popOverContent = "Minimum Length: " + this.config.minLength + ", Maximum Length: " + this.config.maxLength + ", Pattern: " + this.config.pattern;
    }
    this.placeholder = this.popOverContent;

  }
}
