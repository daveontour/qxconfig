import { PreLodedComponent } from './../pre-loded/pre-loded.component';
import { Globals } from './../../../services/globals';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';
import { PostEvent} from './../../../interfaces/interfaces';

@Component({
  selector: 'app-enter-xsd',
  templateUrl: './enter-xsd.component.html',
  styleUrls: ['./enter-xsd.component.scss']
})
export class EnterXSDComponent extends PreLodedComponent {

  selectionMethod = 'enterxsd';
  enteredXSD = '';

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) {
    super(messenger, http, modalService, global);

    // Hamdler for after the XSD has been uploaded sucessfully
    messenger.xsduploaded$.subscribe(
      data => {
        this.selectedCollection = this.global.sessionID;
        this.selectedFile = this.global.sessionID + '.xsd';
        this.changeFile();
      });
  }

  upload() {

    // The upload is handled by the director
    this.messenger.uploadXSD(this.enteredXSD);
  }
}
