import { PreLodedComponent } from './../pre-loded/pre-loded.component';
import { Globals } from './../../../services/globals';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';

@Component({
  selector: 'app-enter-xsd',
  templateUrl: './enter-xsd.component.html',
  styleUrls: ['./enter-xsd.component.scss']
})
export class EnterXSDComponent extends PreLodedComponent implements OnInit {

  selectionMethod = 'enter';
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

  ngOnInit() {
    this.enteredXSD = this.global.enteredXSD;
  }

  upload() {

    // The upload is handled by the director
    this.global.selectionMethod = 'enter';
    this.messenger.uploadXSD(this.enteredXSD);
  }
}
