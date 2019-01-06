import { ValidateComponent } from './../utils/validate/validate.component';
import { SettingsComponent } from './../utils/settings/settings.component';
import { EnterXSDComponent } from './../uploaddialog/enter-xsd/enter-xsd.component';
import { LoadYourOwnComponent } from './../uploaddialog/load-your-own/load-your-own.component';
import { PreLodedComponent } from './../uploaddialog/pre-loded/pre-loded.component';
import { Globals } from './../../services/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import { Component } from '@angular/core';


@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent {
  constructor(
    private messenger: Messenger,
    private modalService: NgbModal,
    private global: Globals,

  ) { }

  selectType(method) {

    try {
      switch (method) {
        case 'pre':
          this.modalService.open(PreLodedComponent, { centered: true, size: 'lg' });
          break;
        case 'user':
          this.modalService.open(LoadYourOwnComponent, { centered: true, size: 'lg' });
          break;
        case 'enter':
          this.modalService.open(EnterXSDComponent, { centered: true, size: 'lg' });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }

  settings() {
    this.modalService.open(SettingsComponent, { centered: true, size: 'lg' });
  }

  goHome() {
    this.messenger.goHome();
  }

  save() {
    this.messenger.save();
  }

  apply() {
    this.messenger.apply();
  }
  undo() {
    this.messenger.undo();
  }

  validate() {

    if (this.global.selectedType == null) {
      this.global.openModalAlert('Dave Stuffed Up', 'selectedType = null');
    }

    if (this.global.selectedType.indexOf('(') !== -1) {
      this.global.openModalAlert('Unable to Validate', 'Sorry, the XML can\'t be validated. ' +
        'A schema type has been selected. At the moment this tool only validates "elements" specified in the schema');
      return;
    }
    if (this.global.XMLMessage.length < 10) {
      this.global.openModalAlert('Validation Error', 'No XML has been generated yet. \nSelect a schema and type to begin');
      return;
    }

    // The ValidateComponent takes care of sending the request
    this.modalService.open(ValidateComponent, { centered: true });

  }
}
