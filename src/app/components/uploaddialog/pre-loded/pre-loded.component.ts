import { Globals } from './../../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-pre-loded',
  templateUrl: './pre-loded.component.html',
  styleUrls: ['./pre-loded.component.scss']
})
export class PreLodedComponent implements OnInit {
  @ViewChild('schemaChoice', { read: ViewContainerRef }) content;

  Caption = [];
  selectedFiles = [];
  notAllowedList = [];
  afterUpload: boolean;
  multiple = true;
  maxSize = 20;

  schemaCollections: string[];
  schemaFiles: string[];
  schemaTypes: string[];
  schemaElements: string[];
  selectedCollection: string;
  selectedFile: string;
  selectedType: string;
  selectionMethod = 'preload';

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) { }

  ngOnInit() {
    this.getCollection();
    this.messenger.setSchema('-');
    this.messenger.setSchemaFile('-');
    this.messenger.setType('-');
    this.messenger.setStatus('Ready');
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
    this.schemaElements = [];
    this.selectedFile = null;
    this.selectedType = null;

    this.global.selectionMethod = this.selectionMethod;
    this.messenger.setSchema(this.global.selectedSchema);

    this.http.get<string[]>(this.global.baseURL + '?op=getSchemaFiles&schema=' + this.selectedCollection +
      '&selectionMethod=' + this.selectionMethod).subscribe(data => {

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
    this.schemaElements = [];
    this.selectedType = null;
    if (this.selectionMethod === 'enterxsd') {
      this.messenger.setSchemaFile('User Uploaded');
      this.global.selectedFile = 'User Uploaded';
    } else {
      this.messenger.setSchemaFile(this.selectedFile);
      this.global.selectedFile = this.selectedFile;
    }

    this.http.get<ElementAndTypes>(this.global.baseURL + '?op=getSchemaTypes' +
      '&schema=' + this.selectedCollection +
      '&file=' + this.selectedFile +
      '&sessionID=' + this.global.sessionID +
      '&selectionMethod=' + this.selectionMethod
    ).subscribe(data => {

      this.schemaTypes = data.types;
      this.schemaElements = data.elements;
      if (this.schemaTypes.length === 0  && this.schemaElements.length === 0) {
        alert('No Elements or Types were found');
      }
    },
      (err: HttpErrorResponse) => {
        this.messenger.setStatus('File Selection Failure');
        this.global.openModalAlert('Schema File Selection Error',
        'There was an error selecting the file. Unable to retrieve types from schema');
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  changeType() {

    this.modalService.dismissAll();

    this.schemaTypes = [];
    this.global.selectedType = this.selectedType;
    this.messenger.setType(this.selectedType);
    this.messenger.announceMission(this.global.baseURL + '?op=getType' +
      '&schema=' + this.selectedCollection +
      '&file=' + this.selectedFile +
      '&type=' + this.selectedType +
      '&sessionID=' + this.global.sessionID +
      '&selectionMethod=' + this.selectionMethod);
  }


  c(reason) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }
  d(reason) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }
}

interface ElementAndTypes {
  elements: string[];
  types: string[];
}

