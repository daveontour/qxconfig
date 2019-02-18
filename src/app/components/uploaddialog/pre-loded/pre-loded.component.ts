import { Globals } from './../../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as $ from 'jquery';

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
  selectionMethod = 'pre';

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

    $('*').addClass('waiting');

    this.http.get<any>(this.global.rootURL + '/getJsonSchemas').subscribe(data => {

      $('*').removeClass('waiting');
      this.schemaCollections = data.data;
      this.global.sessionID = data.sessionID;

      if (this.schemaCollections.length === 0) {
        this.global.openModalAlert('Schema Archive Selection Error',
          'No Schema Archives Found');
        return;
      }
    },
      (err: HttpErrorResponse) => {
        $('*').removeClass('waiting');
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

    this.global.selectionMethod = 'pre';
    this.messenger.setSchema(this.global.selectedSchema);

    $('*').addClass('waiting');

    this.http.get<any>(this.global.rootURL + '/getJsonSchemaFiles?schema=' + this.selectedCollection +
      '&selectionMethod=' + this.selectionMethod).subscribe(data => {

        $('*').removeClass('waiting');
        this.schemaFiles = data.data;
        this.global.sessionID = data.sessionID;

        if (this.schemaFiles.length === 0) {
          this.global.openModalAlert('Schema File Selection Error',
            'No Schema Files Were Found in the Archive');
          return;
        }

      },
        (err: HttpErrorResponse) => {
          $('*').removeClass('waiting');
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
    if (this.selectionMethod === 'enter') {
      this.messenger.setSchemaFile('User Uploaded');
      this.global.selectedFile = 'enter';
    } else {
      this.messenger.setSchemaFile(this.selectedFile);
      this.global.selectedFile = this.selectedFile;
    }

    $('*').addClass('waiting');

    this.http.get<ElementAndTypes>(this.global.rootURL + '/getJsonSchemaTypes' +
      '?schema=' + this.selectedCollection +
      '&file=' + this.selectedFile +
      '&selectionMethod=' + this.selectionMethod
    ).subscribe(data => {

      $('*').removeClass('waiting');

      this.schemaTypes = data.types;
      this.schemaElements = data.elements;
      if (this.schemaTypes.length === 0 && this.schemaElements.length === 0) {
        this.global.openModalAlert('Element and Type Selection Error', 'No Elements or Types Were Found');
      return;
      }
    },
      (err: HttpErrorResponse) => {
        $('*').removeClass('waiting');
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
    this.messenger.announceMission(this.global.rootURL + '/getJsonType' +
      '?schema=' + this.selectedCollection +
      '&file=' + this.selectedFile +
      '&type=' + this.selectedType +
      '&selectionMethod=' + this.selectionMethod);
  }
}

interface ElementAndTypes {
  elements: string[];
  types: string[];
}

