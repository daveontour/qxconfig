import { SavefileuploadComponent } from './../components/uploaddialog/savefileupload/savefileupload.component';
import { Subscription } from 'rxjs';
import { ItemConfig, PostEvent } from './../interfaces/interfaces';
import { SettingsComponent } from './../components/utils/settings/settings.component';
import { ValidateComponent } from './../components/utils/validate/validate.component';
import { LoadYourOwnComponent } from './../components/uploaddialog/load-your-own/load-your-own.component';
import { NgbPopoverConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './messenger';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Globals, SaveObjFile } from './globals';
import { Injectable } from '@angular/core';
import { PreLodedComponent } from '../components/uploaddialog/pre-loded/pre-loded.component';
import { EnterXSDComponent } from '../components/uploaddialog/enter-xsd/enter-xsd.component';
import * as $ from 'jquery';

@Injectable()
export class Director {

  private documentClean = true;
  private method: string;
  private oldMethod: string;
  private tempSub: Subscription;
  private tempSub2: Subscription;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private messenger: Messenger,
    public config: NgbPopoverConfig,
    private global: Globals
  ) {

    const _this = this;

    // Listen for new mission annoucement and act on them.
    messenger.missionAnnounced$.subscribe(
      mission => {
        this.retrieveData(mission);
      }
    );

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
        _this.modalService.open(ValidateComponent, { centered: true,  backdrop: 'static'});
      });

    // Setting button is selected
    messenger.settings$.subscribe(
      data => {
        _this.modalService.open(SettingsComponent, { centered: true, size: 'sm',  backdrop: 'static' });
      });

    // Save File selected
    messenger.savefileselected$.subscribe(
      data => {
        _this.saveFileSelect(data);
      });

    // Upload XSD
    messenger.uploadXSD$.subscribe(
      data => {
        _this.uploadXSD(data);
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
        sof.m = this.method;
        _this.save(JSON.stringify(sof));
        _this.messenger.setDocumentClean();
      }
    );

    messenger.docClean$.subscribe(
      data => {
        _this.documentClean = data;
      }
    );

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
    messenger.fetchandapply$.subscribe(
      sofFile => {
        _this.fetchAndApply(sofFile);
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
            function () { }, _this, null);
        } else {
          // No changes, so just go ahead
          this.cleanDocument(_this);
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

  selectSchema(_this: any) {
    try {
      switch (_this.method) {
        case 'pre':
          this.modalService.open(PreLodedComponent, { centered: true, size: 'lg', backdrop: 'static' });
          break;
        case 'user':
          this.modalService.open(LoadYourOwnComponent, { centered: true, size: 'lg', backdrop: 'static' });
          break;
        case 'enter':
          this.modalService.open(EnterXSDComponent, { centered: true, size: 'lg', backdrop: 'static'});
          break;
      }
    } catch (e) {
      console.log(e);
    }
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

//    this.global.openModalAlert('Load Saved File', 'Uploading and Processing the Selected File');
    this.modalService.open(SavefileuploadComponent, { centered: true, size: 'lg', backdrop: 'static' });
    this.messenger.setStatus('Uploading File');

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
        reportProgress: true
      }
    );

    this.http.request<any>(request).subscribe(
      event => {

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
          this.messenger.setStatus( percentDone + '% uploaded');
          this.messenger.setUploadPercentage(percentDone);
        }

        if (event.type === 3) {
          this.modalService.dismissAll();
          this.global.openModalAlert('Save File Error', 'Error Saving the Selected File. The file size exceeds the configured maximum');
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

    if (soFile.m === 'pre') {
      // First, set up a listener to listen when the file has been processed
      // 'formready' is fired by the app.component whene the XSF has been loaded.
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
      this.messenger.announceMission(this.global.baseURL + '?op=getType' +
        '&schema=' + soFile.c +
        '&file=' + soFile.f +
        '&type=' + soFile.t +
        '&sessionID=' + this.global.sessionID +
        '&selectionMethod=pre');
    }

    if (soFile.m === 'user') {
      // First, set up a listener to listen when the file has been processed
      // 'formready' is fired by the app.component whene the XSF has been loaded.
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
      this.messenger.announceMission(this.global.baseURL + '?op=getType' +
        '&schema=' + this.global.sessionID +
        '&file=' + soFile.f +
        '&type=' + soFile.t +
        '&sessionID=' + this.global.sessionID +
        '&selectionMethod=user');
    }

    if (soFile.m === 'enter') {
      // First, set up a listener to listen when the file has been processed
      // 'formready' is fired by the app.component whene the XSF has been loaded.
      this.tempSub = this.messenger.xsduploaded$.subscribe(
        data => {
          this.tempSub.unsubscribe();
          this.messenger.setSchema(soFile.c);
          this.messenger.setSchemaFile(soFile.f);
          this.messenger.setType(soFile.t);

          this.tempSub2 = this.messenger.formready$.subscribe(
            data2 => {
              this.tempSub2.unsubscribe();
              this.global.root.applyConfig(soFile.o);
            });

          // Request the schema to be loaded
          this.messenger.announceMission(this.global.baseURL + '?op=getType' +
            '&schema=' + soFile.c +
            '&file=' + soFile.f +
            '&type=' + soFile.t +
            '&sessionID=' + this.global.sessionID +
            '&selectionMethod=enter');
        }
      );

      this.uploadXSD(soFile.e);
    }
  }

  retrieveData(url: string) {
    this.messenger.setStatus('Retrieving Data');
    this.messenger.reset();
    this.global.root = null;
    this.global.undoStack = [];

    this.global.openModalAlert('Schema Processing', 'Processing Schema. Please Wait.');

    this.http.get<ItemConfig>(url).subscribe(data => {

      this.modalService.dismissAll();

      if (data.failed) {
        this.messenger.setStatus('Retrival Failure');
        this.global.openModalAlert('Problem Reading Schema', data.msg);
      } else {
        this.messenger.setStatus('Ready');
        data.elementPath = data.name;
        data.isRoot = true;
        this.messenger.newXSDReady(data);

        // // This prevents ExpressionChangedAfterItHasBeenCheckedError
        // // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
        // this.cdRef.detectChanges();
      }
    },
      (err: HttpErrorResponse) => {
        this.modalService.dismissAll();
        if (err.error instanceof Error) {
          this.global.openModalAlert('An error occurred:', err.error.message);
        } else {
          this.global.openModalAlert('An error occurred:', 'Check Console');
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
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
      this.global.baseURLUploadEntered + this.global.sessionID,
      this.global.enteredXSD,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        }),
        reportProgress: true
      }
    );


    this.http.request<PostEvent>(request).subscribe(
      event => {
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
