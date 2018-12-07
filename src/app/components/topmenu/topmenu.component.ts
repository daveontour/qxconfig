import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent implements OnInit {

  schemaCollections: string[];
  schemaFiles: string[];
  schemaTypes: string[];
  selectedCollection: string;
  selectedFile: string;
  selectedType: string;
  afuConfig = {
    multiple: true,
    formatsAllowed: '.xsd',
    maxSize: '100',
    uploadAPI:  {
      url: 'http://localhost:8080/XSD_Forms/upload',
      headers: {
        'Access-Control-Allow-Origin' : '*'
      }
    },
  //  theme: 'dragNDrop',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false
};

  constructor(
    private messenger: Messenger,
    private modalService: NgbModal,
    private http: HttpClient,
    private global: Globals,

    ) { }

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

    this.http.get<string[]>(this.global.baseURL + '?op=getSchemaTypes&' +
    '&schema=' + this.selectedCollection + '&fname=' + this.selectedFile).subscribe(data => {

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

  selectType(content) {
    this.getCollection();
    this.modalService.open(content, { centered: true });
  }
  uploadSchema(content) {
    this.modalService.open(content, { centered: true });
  }
}
