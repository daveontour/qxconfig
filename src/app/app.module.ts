import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BaseNullComponent } from './controls/basenull/basenull.component';
import { XSDecimalComponent } from './controls/xsdecimal/xsdecimal.component';
import { XSLanguageComponent } from './controls/xslanguage/xslanguage.component';
import { XSIntegerComponent } from './controls/xsinteger/xsinteger.component';
import { BaseComponent } from './controls/base/base.component';
import { XSBooleanComponent } from './controls/xsboolean/xsboolean.component';
import { MinMaxLengthPatternComponent } from './controls/minmaxlengthpattern/minmaxlengthpattern.component';
import { EnumListComponent } from './controls/enumlist/enumlist.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, FormBuilder, FormGroup }   from '@angular/forms';
import { Globals } from './services/globals';
import { WidgetFactory } from './services/widgetfactory';
import { AceEditorModule } from 'ng2-ace-editor';
import { SequenceComponent } from './components/sequence/sequence.component';
import { SimpleComponent } from './components/simple/simple.component';
import { ChoiceComponent } from './components/choice/choice.component';
import { PatternComponent } from './controls/pattern/pattern.component';
import { AttributeComponent } from './components/attribute/attribute.component';
import { MinMaxLengthComponent } from './controls/minmaxlength/minmaxlength.component';
import { MinMaxInclusiveComponent } from './controls/minmaxinclusive/minmaxinclusive.component';
import { XSStringComponent } from './controls/xsstring/xsstring.component';
import { XSDateComponent } from './controls/xsdate/xsdate.component';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';



@NgModule({
  declarations: [
    AppComponent,
    SequenceComponent,
    SimpleComponent,
    ChoiceComponent,
    PatternComponent,
    MinMaxLengthComponent,
    MinMaxLengthPatternComponent,
    MinMaxInclusiveComponent,
    XSBooleanComponent,
    XSStringComponent,
    XSIntegerComponent,
    XSLanguageComponent,
    XSDecimalComponent,
    EnumListComponent,
    BaseComponent,
    BaseNullComponent,
    XSDateComponent,
    AttributeComponent,
    jqxSplitterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    AceEditorModule
  ],
  providers: [
    Globals,
    WidgetFactory
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SequenceComponent, 
    SimpleComponent, 
    ChoiceComponent, 
    PatternComponent,
    MinMaxLengthComponent,
    MinMaxLengthPatternComponent,
    MinMaxInclusiveComponent,
    EnumListComponent,
    XSBooleanComponent,
    XSStringComponent,
    BaseComponent,
    BaseNullComponent,
    XSIntegerComponent,
    XSLanguageComponent,
    XSDecimalComponent,
    XSDateComponent,
    AttributeComponent
  ]
})
export class AppModule { }
