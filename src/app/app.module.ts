import { GenericAlertComponent } from './components/utils/genericalert/generic-alert.component';
import { XSGMonthDayComponent } from './controls/xsgMonthDay/gMonthDay.component';
import { XSGMonthComponent } from './controls/xsgMonth/gMonth.component';
import { XSNumberComponent } from './controls/xsnumber/xsnumber.component';
import { XSDateTimeComponent } from './controls/xsdateTime/xsdateTime.component';
import { XSTimeComponent } from './controls/xstime/xstime.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ChangeDetectorRef } from '@angular/core';
import { BaseNullComponent } from './controls/basenull/basenull.component';
import { XSDecimalComponent } from './controls/xsdecimal/xsdecimal.component';
import { XSLanguageComponent } from './controls/xslanguage/xslanguage.component';
import { XSIntegerComponent } from './controls/xsinteger/xsinteger.component';
import { BaseComponent } from './controls/base/base.component';
import { XSBooleanComponent } from './controls/xsboolean/xsboolean.component';
import { EnumListComponent } from './controls/enumlist/enumlist.component';
import { NgbModule, NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, FormBuilder, FormGroup } from '@angular/forms';
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
import { UnionComponent } from './controls/union/union.component';
import { AlertswindowComponent } from './alertswindow/alertswindow.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { XSGDayComponent } from './controls/xsgDay/gDay.component';
import { OwlCheckBoxModule, OwlFormFieldModule, OwlSwitchModule, OwlInputModule} from 'owl-ng';
import { OwlBadgeModule, OwlAccordionModule} from 'owl-ng';
import { Messenger } from './services/messenger';
import { TopmenuComponent } from './components/topmenu/topmenu.component';
import { PreLodedComponent } from './components/uploaddialog/pre-loded/pre-loded.component';
import { LoadYourOwnComponent } from './components/uploaddialog/load-your-own/load-your-own.component';
import { EnterXSDComponent } from './components/uploaddialog/enter-xsd/enter-xsd.component';
import { IntroTextComponent } from './components/intro-text/intro-text.component';
import { SettingsComponent } from './components/utils/settings/settings.component';
import { ValidateComponent } from './components/utils/validate/validate.component';



// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: '',
  datePickerInput: 'YYYY-MM-DD',
  timePickerInput: 'HH:mm:SSZ',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
  declarations: [
    AppComponent,
    SequenceComponent,
    SimpleComponent,
    ChoiceComponent,
    PatternComponent,
    MinMaxLengthComponent,
    MinMaxInclusiveComponent,
    XSBooleanComponent,
    XSStringComponent,
    XSIntegerComponent,
    XSLanguageComponent,
    XSDecimalComponent,
    EnumListComponent,
    UnionComponent,
    BaseComponent,
    BaseNullComponent,
    XSDateComponent,
    XSDateTimeComponent,
    XSTimeComponent,
    AttributeComponent,
    jqxSplitterComponent,
    UnionComponent,
    AlertswindowComponent,
    XSGDayComponent,
    XSGMonthComponent,
    XSNumberComponent,
    XSGMonthDayComponent,
    TopmenuComponent,
    PreLodedComponent,
    LoadYourOwnComponent,
    EnterXSDComponent,
    GenericAlertComponent,
    IntroTextComponent,
    SettingsComponent,
    ValidateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot(),
    AceEditorModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    OwlBadgeModule,
    OwlAccordionModule,
    OwlSwitchModule,
    OwlCheckBoxModule,
    OwlInputModule,
    OwlFormFieldModule,
  ],
  providers: [
    Globals,
    Messenger,
    NgbPopoverConfig,
    WidgetFactory,
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SequenceComponent,
    SimpleComponent,
    ChoiceComponent,
    PatternComponent,
    UnionComponent,
    MinMaxLengthComponent,
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
    XSDateTimeComponent,
    XSTimeComponent,
    AttributeComponent,
    XSGDayComponent,
    XSGMonthComponent,
    XSGMonthDayComponent,
    XSNumberComponent,
    PreLodedComponent,
    LoadYourOwnComponent,
    EnterXSDComponent,
    GenericAlertComponent,
    IntroTextComponent,
    SettingsComponent,
    ValidateComponent
  ]
})
export class AppModule { }
