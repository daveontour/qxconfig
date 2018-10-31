import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { ComponentFactoryResolver, Injectable } from '@angular/core';


@Injectable({
  providedIn:'root'
})
export class UIComponentFactory {

  public createChoice( resolver:ComponentFactoryResolver){
    return resolver.resolveComponentFactory(ChoiceComponent);
  }

  public createSequence( resolver:ComponentFactoryResolver){
    return resolver.resolveComponentFactory(SequenceComponent);
  }
  public createSimple( resolver:ComponentFactoryResolver){
    return resolver.resolveComponentFactory(SimpleComponent);
  }
}