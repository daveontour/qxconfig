import { XmlutilsComponent } from './../components/utils/xmlutils/xmlutils.component';
import { ShowxsdComponent } from './../components/showxsd/showxsd.component';
import { SelectschemadialogComponent } from './../components/uploaddialog/selectschemadialog/selectschemadialog.component';
import { SavefileuploadComponent } from './../components/uploaddialog/savefileupload/savefileupload.component';
import { Subscription } from 'rxjs';
import { ItemConfig, PostEvent } from './../interfaces/interfaces';
import { SettingsComponent } from './../components/utils/settings/settings.component';
import { ValidateComponent } from './../components/utils/validate/validate.component';
import { NgbPopoverConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './messenger';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Globals, SaveObjFile } from './globals';
import { Injectable } from '@angular/core';

import * as $ from 'jquery';

@Injectable()
export class Director {

  private documentClean = true;
  private method: string;
  private oldMethod: string;
  private tempSub: Subscription;
  private tempSub2: Subscription;

  /*
  The constructor registers listeners for various events that are published by the Messenger.
  Each of the listeners then handles the event or dispatches it to a function that handles it


  */

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private messenger: Messenger,
    public config: NgbPopoverConfig,
    private global: Globals
  ) {

    const _this = this;

    // Listen for new mission annoucement and act on them.
    messenger.missionAnnounced$.subscribe( mission => { this.retrieveData(mission); } );

    // One of the Schema selection options is selected
    messenger.selectSchema$.subscribe(
      method => {


        _this.oldMethod = _this.method;
        _this.method = method;
        _this.global.selectionMethod = method;

        if (!_this.documentClean) {

          // Warn the user changes will be lost
          this.global.openModalQuestion('Warning', 'Any changes will be lost', '', 'Proceed', 'Cancel',
            // Function to execute id button1 (Proceed) is selected
            this.selectSchema,
            // Function to execute id button2 (Cancel) is selected
            function (th) { th.method = th.oldMethod; th.global.selectionMethod = th.oldMethod; },
            // Parameter for  function proceed function
            _this,
            // Parameter for  function cancel function
            _this);
        } else {
          // No changes, so just go ahead
          this.selectSchema(_this);
        }
      });

    // Validation of the XML is requested
    messenger.validate$.subscribe(
      data => {

        if (_this.global.selectedType == null) {
          _this.global.openModalAlert('Validation Error', 'Nothing to Validate. ' +
            'Please load a schema and select the type before validating');
        }

        if (_this.global.selectedType.indexOf('(') !== -1) {
          _this.global.openModalAlert('Unable to Validate', 'Sorry, the XML can\'t be validated. ' +
            'A schema type has been selected. At the moment this tool only validates "elements" specified in the schema');
          return;
        }
        if (_this.global.XMLMessage.length < 10) {
          _this.global.openModalAlert('Validation Error', 'No XML has been generated yet. \nSelect a schema and type to begin');
          return;
        }

        // Display a modela dialog box with the ValidateComponent.
        // The ValidateComponent takes care of sending the request.
        _this.modalService.open(ValidateComponent, { centered: true, backdrop: 'static' });
      });

    // Setting button is selected
    // tslint:disable-next-line:max-line-length
    messenger.settings$.subscribe( data => { _this.modalService.open(SettingsComponent, { centered: true, size: 'sm', backdrop: 'static' });  });

    // Save File selected
    messenger.savefileselected$.subscribe( data => {  _this.saveFileSelect(data); });

    // Upload XSD
    messenger.uploadXSD$.subscribe( data => { _this.uploadXSD(data); });

    // Save button is selected
    messenger.save$.subscribe(
      data => {
        if (typeof this.global.root === 'undefined') {
          _this.global.openModalAlert('Unable to Save', 'No XSD Schema has been selected yet');
          return;
        }
        const so = this.global.root.getSaveObj();
        const sof = new SaveObjFile();
        sof.o = so;
        sof.c = this.global.selectedSchema;
        sof.f = this.global.selectedFile;
        sof.t = this.global.selectedType;
        sof.m = this.global.selectionMethod;
        _this.save(JSON.stringify(sof));
        _this.messenger.setDocumentClean();
      }
    );

    // Show XSD button is selected
    messenger.showXSD$.subscribe(
      data => {
        if (typeof this.global.root === 'undefined') {
          _this.global.openModalAlert('Unable to Show XSD', 'No XSD Schema has been selected yet');
          return;
        }
        this.modalService.open(ShowxsdComponent, { centered: true, size: 'lg', backdrop: 'static' });
      }
    );

    messenger.xmlUtils$.subscribe(
      data => {
        this.modalService.open(XmlutilsComponent, { centered: true, size: 'lg', backdrop: 'static' });
      }
    );



    messenger.docClean$.subscribe(data => { _this.documentClean = data; } );

    // Apply a previously saved object
    messenger.apply$.subscribe(
      data => {
        // Hidden form in app.componet.
        // File Input button is trigger.
        $('#saveFileDialog').val(null);
        $('#saveFileDialog').trigger('click');
      }
    );

    // Apply a previously saved object
    messenger.fetchandapply$.subscribe( sofFile => { _this.fetchAndApply(sofFile); });


    // Handle the selection of the "Home" button
    messenger.home$.subscribe(
      data => {

        if (!_this.documentClean) {

          // Warn the user changes will be lost
          this.global.openModalQuestion('Warning', 'Any changes will be lost', '', 'Proceed', 'Cancel',
            // Function to execute id button1 (Proceed) is selected
            this.cleanDocument,
            // Function to execute id button1 (Proceed) is selected
            function () { }, _this, null);
        } else {
          // No changes, so just go ahead
          this.cleanDocument(_this);
        }
      }
    );

    // Download the XML
    messenger.downloadxml$.subscribe( data => { this.downloadXML(); });


    // End of Constructor
  }

  selectSchema(_this: any) {
    this.modalService.open(SelectschemadialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
  }

  cleanDocument(_this: any) {
    _this.modalService.dismissAll();
    _this.global.XMLMessage = '';
    _this.global.elementsUndefined = [];
    _this.global.attributesUndefined = [];
    _this.global.formatErrors = [];

    // Sends a message to the app.component to reset the page
    _this.messenger.reset();
    _this.messenger.setDocumentClean();
  }

  save(saveobject: string) {
    // Send the data to the host, which in turns
    // just reflects it back as a file.

    const url = this.global.baseURLUploadAndSaveFiles;
    $('input[name="saveobject"]').val(saveobject);
    $('#downloadform').attr('action', url);
    $('#downloadform').submit();

  }

  downloadXML() {
    // Send the data to the host, which in turns
    // just reflects it back as a file.

    $('input[name="xml"]').val(this.global.XMLMessage);
    $('#downloadxmlform').attr('action', this.global.rootURL + '/saveXML');
    $('#downloadxmlform').submit();

  }

  saveFileSelect(event: any) {

    const selectedFiles = [];
    const file = event.target.files || event.srcElement.files;
    for (let i = 0; i < file.length; i++) {
      selectedFiles.push(file[i]);
    }
    this.uploadSavedFile(selectedFiles);
  }

  uploadSavedFile(selectedFiles: any[]) {

    //    this.global.openModalAlert('Load Saved File', 'Uploading and Processing the Selected File');
    this.modalService.open(SavefileuploadComponent, { centered: true, size: 'lg', backdrop: 'static' });
    this.messenger.setStatus('Uploading File');
    $('*').addClass('waiting');

    const formData: any = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('file', selectedFiles[i]);
    }

    const request = new HttpRequest(
      'POST',
      this.global.baseURLSaveFileReflector,
      formData,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        }),
        reportProgress: true
      }
    );

    this.http.request<any>(request).subscribe(
      event => {
        $('*').removeClass('waiting');
        if (event.type === HttpEventType.Response) {
          const soFile = event.body;

          this.global.selectedSchema = soFile.c;
          this.global.selectedFile = soFile.f;
          this.global.selectedType = soFile.t;
          this.global.sessionID = soFile.id;
          this.messenger.fetchAndApply(soFile);
        }

        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.messenger.setStatus(percentDone + '% uploaded');
          this.messenger.setUploadPercentage(percentDone);
        }

        if (event.type === HttpEventType.Sent) {
          console.log('Sent Event');
        }

        if (event.type === HttpEventType.ResponseHeader) {
          console.log('Response Header Event');
        }

        if (event.type === HttpEventType.DownloadProgress) {
          console.log('Download Progress Event');
        }

        if (event.type === HttpEventType.User) {
          console.log('User Event');
        }
      }
    );
  }

  fetchAndApply(soFile: SaveObjFile) {

    this.modalService.dismissAll();
    this.messenger.setStatus('Ready');

    if (soFile.error != null) {
      this.global.openModalAlert('Save File Error', soFile.error);
      return;
    }

    //   this.schemaTypes = [];
    this.global.selectedType = soFile.t;
    this.messenger.setType(soFile.t);

    this.tempSub = this.messenger.formready$.subscribe(
      data => {
        this.tempSub.unsubscribe();
        this.global.root.applyConfig(soFile.o);
        this.messenger.setSchema(soFile.c);
        this.messenger.setSchemaFile(soFile.f);
        this.messenger.setType(soFile.t);
      }
    );

    // Request the schema to be loaded
    this.messenger.announceMission(this.global.rootURL + '/getJsonType' +
      '?schema=' + soFile.c +
      '&file=' + soFile.f +
      '&type=' + soFile.t +
      '&selectionMethod=' + soFile.m);

  }

  retrieveData(url: string) {
    this.messenger.setStatus('Retrieving Data');
    // this.messenger.reset();
    this.global.root = null;
    // this.global.undoStack = [];

    this.global.openModalAlert('Schema Processing', 'Processing Schema. Please Wait.');
    $('*').addClass('waiting');

    this.http.get<ItemConfig>(url).subscribe(data => {
      $('*').removeClass('waiting');
      this.modalService.dismissAll();

      if (data.failed) {
        this.messenger.setStatus('Retrival Failure');
        this.global.openModalQuestion('Problem Interpreting Schema', 'Please select \'Report\' if you believe the XSD is correct',
         '', 'Report', 'Cancel',
        // Function to execute id button1 (Proceed) is selected
        this.reportBadSchema,
        // Function to execute id button2 (Cancel) is selected
        function (th) { th.method = th.oldMethod; th.global.selectionMethod = th.oldMethod; },
        // Parameter for  function report function
        this,
        // Parameter for  function cancel function
        this);
      } else {
        this.messenger.setStatus('Ready');
        data.elementPath = data.name;
        data.isRoot = true;
        this.messenger.newXSDReady(data);

        if (this.global.intro) {
          this.global.openModalAlert('Welcome To XSD2XML',
          'A sample schema has been loaded. Use the "Menu" button to select or load your own XSD defintion');
          this.global.intro = false;
        }

        // // This prevents ExpressionChangedAfterItHasBeenCheckedError
        // // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
        // this.cdRef.detectChanges();
      }
    },
      (err: HttpErrorResponse) => {
        $('*').removeClass('waiting');
        this.modalService.dismissAll();
        if (err.error instanceof Error) {
          this.global.openModalAlert('An error occurred:', err.error.message);
        } else {
          this.global.openModalAlert('An error occurred:', 'Check Console');
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  reportBadSchema(_this: any) {

    _this.http.get(_this.global.rootURL + '/reportBadSchema'
  ).subscribe(data => {
      $('*').removeClass('waiting');
      _this.global.openModalAlert('Report Submitted', 'Your report was submitted. The support team will investigate the problem');
  },
    (err: HttpErrorResponse) => {
      $('*').removeClass('waiting');
      _this.global.openModalAlert('Report Submital Failure', 'Sorry, there was an error submitting your report');
    });
  }

  uploadXSD(xsd: string) {

    this.messenger.setSchema('User Uploaded');
    this.messenger.setSchemaFile('User Uploaded');
    this.messenger.setType('-');
    this.messenger.setStatus('Ready');

    this.global.selectionMethod = 'enter';
    this.global.enteredXSD = xsd;

    const request = new HttpRequest('POST',
      this.global.baseURLUploadEntered,
      this.global.enteredXSD,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        }),
        reportProgress: true
      }
    );

    $('*').addClass('waiting');
    this.http.request<PostEvent>(request).subscribe(
      event => {
        $('*').removeClass('waiting');
        if (event.type === HttpEventType.Response) {
          if (event.body.status) {
            this.global.sessionID = event.body.sessionID;
            this.messenger.xsduploaded();
          } else {
            this.messenger.setStatus('XSD Upload failure');
            this.global.openModalAlert('XSD Save Failure', 'The XSD could not be uploaded to the server for processing');
          }
        }
      }
    );
  }
}
