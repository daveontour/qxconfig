import { Globals } from './../../../services/globals';
import { Messenger } from './../../../services/messenger';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationResult } from './../../../interfaces/interfaces';


@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit, AfterViewInit {

  validationMessage = 'Validating...please wait';
  validationStatus = false;
  validateInProgress = false;
  supplementalMsg = '';


  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.validateAIDXMessage();
  }

  validateAIDXMessage() {

    // Indicators for the modal dialog box
    this.validationMessage = 'Validating...please wait';
    this.validateInProgress = true;
    this.validationStatus = false;
    this.supplementalMsg = '';


    const params = new HttpParams();
    params.append('schema', this.global.selectedSchema);
    params.append('sessionID', this.global.sessionID);
    params.append('selectionMethod', this.global.selectionMethod);

    // this.http.post<ValidatonResult>(this.global.baseURL + '/validate', this.global.xmlMessage, {
    this.http.post<ValidationResult>(this.global.baseURLValidate +
      '?schema=' + this.global.selectedSchema +
      '&sessionID=' + this.global.sessionID +
      '&selectionMethod=' + this.global.selectionMethod,
      this.global.XMLMessage, {
        params: params
      }).subscribe(data => {
        // Update the indicators for the modal dialog box
        this.validationMessage = data.message;
        this.validationStatus = data.status;
        this.validateInProgress = false;

        if (this.validationMessage.indexOf('The markup in the document following the root element must be well-formed') > 0) {
          this.supplementalMsg = 'Did you include multipe messages? This validator only hanldes one message at a time';
        } else
          if (this.validationMessage.indexOf('Cannot find the declaration of element') > 0) {
            this.supplementalMsg = 'Did you select the correct message type?';
          } else
            if (this.validationMessage.indexOf('Premature end of file') > 0) {
              this.supplementalMsg = 'It appears no message data was entered';
            } else
              if (this.validationMessage.indexOf('Content is not allowed in prolog') > 0) {
                this.supplementalMsg = 'The message is badly formed XML';
              } else {
                if (!this.validationStatus) {
                  this.supplementalMsg = 'Refer to above error message';
                }
              }
      },
        (err: HttpErrorResponse) => {
          this.modalService.dismissAll();
          if (err.error instanceof Error) {
            this.global.openModalAlert('An error occurred:', 'Check Console');
            console.log('An error occurred:', err.error.message);
          } else {
            this.global.openModalAlert('An error occurred:', 'Check Console');
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          }
        });
  }

  c(reason) {
    this.modalService.dismissAll();
    // this.messenger.dismiss();
  }
  d(reason) {
    this.modalService.dismissAll();
    // this.messenger.dismiss();
  }

}
