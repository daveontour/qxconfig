import { EnterXSDComponent } from './../uploaddialog/enter-xsd/enter-xsd.component';
import { LoadYourOwnComponent } from './../uploaddialog/load-your-own/load-your-own.component';
import { PreLodedComponent } from './../uploaddialog/pre-loded/pre-loded.component';
import { Subscription } from 'rxjs';
import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import { Component, OnInit, ViewChild, ViewContainerRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { ValidationResult } from './../../interfaces/interfaces';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild('schemaChoice', { read: ViewContainerRef }) content;
  schemaCollections: string[];
  schemaFiles: string[];
  schemaTypes: string[];
  selectedCollection: string;
  selectedFile: string;
  selectedType: string;
  subscription: Subscription;
  dialogDeferred = false;
  initComplete = false;

  validationMessage = 'Validating...please wait';
  validationStatus = false;
  validateInProgress = false;
  schemaVersion = '16.1';
  supplementalMsg = '';

  constructor(
    private messenger: Messenger,
    private modalService: NgbModal,
    private http: HttpClient,
    private global: Globals,

  ) {
    this.subscription = messenger.openDialog$.subscribe(
      dialog => {
        if (!this.initComplete) {
          console.log('deferring dialog');
          this.dialogDeferred = true;
        } else {
          console.log('opening dialog');
          console.log(this.content);
          this.selectType(this.content);
        }
      }
    );

  }

  ngAfterContentInit() {
    console.log('Content Init complete');
  }

  ngAfterViewInit() {
    console.log('view Init complete');

    this.initComplete = true;
    if (this.dialogDeferred) {
      console.log('opening dereffed dialog');
      this.selectType(this.content);
    }
  }
  ngOnInit() {

  }

  docUpload(event) {
    console.log(event);
  }

  getCollection() {
    this.schemaFiles = [];
    this.schemaTypes = [];
    this.schemaCollections = [];
    this.selectedFile = null;
    this.selectedType = null;
    this.selectedCollection = null;

    this.http.get<string[]>(this.global.baseURL + '?op=getSchemas').subscribe(data => {

      this.schemaCollections = data;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  changeCollection() {
    this.global.selectedSchema = this.selectedCollection;
    this.schemaFiles = [];
    this.schemaTypes = [];
    this.selectedFile = null;
    this.selectedType = null;

    this.http.get<string[]>(this.global.baseURL + '?op=getSchemaFiles&schema=' + this.selectedCollection).subscribe(data => {

      this.schemaFiles = data;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  changeFile() {
    this.schemaTypes = [];
    this.selectedType = null;

    this.http.get<string[]>(this.global.baseURL +
      '?op=getSchemaTypes&' +
      '&schema=' + this.selectedCollection +
      '&file=' + this.selectedFile
    ).subscribe(data => {

      this.schemaTypes = data;
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  changeType() {
    this.messenger.announceMission(this.global.baseURL + '?op=getType' +
      '&schema=' + this.selectedCollection +
      '&file=' + this.selectedFile +
      '&type=' + this.selectedType);
    this.modalService.dismissAll();
  }

  selectType(method) {
    this.getCollection();

    switch (method) {
      case 'pre':
        try {
          this.modalService.open(PreLodedComponent, { centered: true, size: 'lg' });
        } catch (e) {
          console.log(e);
        }
        break;
      case 'user':
        try {
          this.modalService.open(LoadYourOwnComponent, { centered: true, size: 'lg' });
        } catch (e) {
          console.log(e);
        }
        break;
      case 'enter':
        try {
          this.modalService.open(EnterXSDComponent, { centered: true, size: 'lg' });
        } catch (e) {
          console.log(e);
        }
        break;
    }
  }

  goHome() {
    this.messenger.goHome();
  }

  validate(content) {

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

    // //Send the text for validation
    this.validateAIDXMessage();


    // //Then open up the modal dialog box which will display status
    // Indicators for the modal dialog box
    this.validationMessage = 'Validating...please wait';
    this.validateInProgress = true;
    this.validationStatus = false;
    this.supplementalMsg = '';

    this.modalService.open(content, { centered: true });

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
}
