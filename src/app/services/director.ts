
import { SettingsComponent } from './../components/utils/settings/settings.component';
import { ValidateComponent } from './../components/utils/validate/validate.component';
import { LoadYourOwnComponent } from './../components/uploaddialog/load-your-own/load-your-own.component';
import { NgbPopoverConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './messenger';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Globals, SaveObjFile } from './globals';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import * as $ from 'jquery';
import { PreLodedComponent } from '../components/uploaddialog/pre-loded/pre-loded.component';
import { EnterXSDComponent } from '../components/uploaddialog/enter-xsd/enter-xsd.component';


@Injectable()
export class Director {

  documentClean = true;
  method: string;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private messenger: Messenger,
    public config: NgbPopoverConfig,
    private global: Globals
  ) {

    const _this = this;

    // One of the Schema selection options is selected
    messenger.selectSchema$.subscribe(
      method => {

        _this.method = method;

        if (!_this.documentClean) {

          // Warn the user changes will be lost
          this.global.openModalQuestion('Warning', 'Any changes will be lost', '', 'Proceed', 'Cancel',
            // Function to execute id button1 (Proceed) is selected
            this.selectSchema,
            // Function to execute id button2 (Cancel) is selected
            function () { },
            // Parameter for  function proceed function
            method,
             // Parameter for  function cancel function
            null);
        } else {
          // No changes, so just go ahead
          this.selectSchema(method);
        }
      });

    // Validation of the XML is requested
    messenger.validate$.subscribe(
      data => {

        if (_this.global.selectedType == null) {
          _this.global.openModalAlert('Dave Stuffed Up', 'selectedType = null');
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

        // The ValidateComponent takes care of sending the request
        _this.modalService.open(ValidateComponent, { centered: true });
      });

    // Setting button is selected
    messenger.settings$.subscribe(
      data => {
        _this.modalService.open(SettingsComponent, { centered: true, size: 'lg' });
      });

    // Save File selected
    messenger.savefileselected$.subscribe(
      data => {
        _this.saveFileSelect(data);
      });

    // Save button is selected
    messenger.save$.subscribe(
      data => {
        const so = this.global.root.getSaveObj();
        const sof = new SaveObjFile();
        sof.o = so;
        sof.c = this.global.selectedSchema;
        sof.f = this.global.selectedFile;
        sof.t = this.global.selectedType;
        _this.save(JSON.stringify(sof));
        _this.messenger.setDocumentClean();
      }
    );

    messenger.docClean$.subscribe(
      data => {
        console.log('Document Status ', data);
        _this.documentClean = data;
      }
    );

    // Apply a previously saved object
    messenger.apply$.subscribe(
      data => {
        // Hidden form in app.componet.
        // File Input button is trigger.
        $('#saveFileDialog').trigger('click');
      }
    );


    // Handle the selection of the "Home" button
    messenger.home$.subscribe(
      data => {

        if (!_this.documentClean) {

          // Warn the user changes will be lost
          this.global.openModalQuestion('Warning', 'Any changes will be lost', '', 'Proceed', 'Cancel',
            // Function to execute id button1 (Proceed) is selected
            this.cleanDocument,
            // Function to execute id button1 (Proceed) is selected
            function () { }, null, null);
        } else {
          // No changes, so just go ahead
          this.cleanDocument();
        }
      }
    );

    // Handle selection of "Undo" button
    messenger.undo$.subscribe(
      data => {
        if (_this.global.undoStack.length <= 1) {
          return;
        }
        _this.global.lockChangeDet();
        // The last one on the stack represents the current state, so discard it.
        _this.global.undoStack.pop();
        $('body').addClass('waiting');
        _this.global.openModalAlert('Undo', 'Processing. Please Wait.');
        setTimeout(() => {
          _this.global.root.applyConfig(_this.global.undoStack.pop());
          $('body').removeClass('waiting');
          _this.modalService.dismissAll();
          setTimeout(() => {
            _this.global.enableChangeDet();
            _this.global.getString();
          });
        });
        // setTimeout(() => {
        //   _this.global.enableChangeDet();
        //   _this.global.getString();
        // });
      }
    );
  }

  selectSchema(method) {
debugger;
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

  cleanDocument() {
    this.modalService.dismissAll();
    this.global.XMLMessage = '';
    this.global.elementsUndefined = [];
    this.global.attributesUndefined = [];
    this.global.formatErrors = [];

    // Sends a message to the app.component to reset the page
    this.messenger.reset();
    this.messenger.setDocumentClean();
  }

  save(saveobject: string) {
    // Send the data to the host, which in turns
    // just reflects it back as a file.

    const url = this.global.baseURLUploadAndSaveFiles + this.global.sessionID;
    $('input[name="saveobject"]').val(saveobject);
    $('#downloadform').attr('action', url);
    $('#downloadform').submit();

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

    // Send the selected file to the host, which in turn
    // returns the contents as a string

    const formData: any = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('file', selectedFiles[i]);
    }

    const request = new HttpRequest(
      'POST',
      this.global.baseURLSaveFileReflector + this.global.sessionID,
      formData,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        }),
        reportProgress: false
      }
    );

    this.http.request<any>(request)
      .subscribe(
        event => {
          if (event.type === HttpEventType.Response) {
            const soFile = event.body;
            if (soFile.c !== this.global.selectedSchema
              || soFile.f !== this.global.selectedFile
              || soFile.t !== this.global.selectedType) {
              this.global.openModalAlert('Incorrect Schema', 'Wrong Schema');
            } else {
              this.global.root.applyConfig(soFile.o);
              this.messenger.setDocumentClean();
            }
          }
        }
      );
  }
}
