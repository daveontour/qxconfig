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

  constructor(
    private messenger: Messenger,
    private modalService: NgbModal,
    private http: HttpClient,
    ) { }

  ngOnInit() {

  }

  getCollection() {
    this.schemaFiles = [];
    this.schemaTypes = [];
    this.schemaCollections = [];
    this.selectedFile = null;
    this.selectedType = null;
    this.selectedCollection = null;

    this.http.get<string[]>('http://localhost:8080/XSD_Forms/json?schemaCollections=true').subscribe(data => {

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
    this.schemaFiles = [];
    this.schemaTypes = [];
    this.selectedFile = null;
    this.selectedType = null;

    this.http.get<string[]>('http://localhost:8080/XSD_Forms/json?collectionFiles=' + this.selectedCollection).subscribe(data => {

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

    this.http.get<string[]>('http://localhost:8080/XSD_Forms/json?fileTypes=' + this.selectedFile +
    '&fileSchema=' + this.selectedCollection).subscribe(data => {

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
    this.messenger.announceMission('http://localhost:8080/XSD_Forms/json?dir=' + this.selectedCollection +
    '&file=' + this.selectedFile + '&root=' + this.selectedType);
  }

  selectType(content) {
    this.getCollection();
    this.modalService.open(content, { centered: true });
  }
}

