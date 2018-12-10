import { PreLodedComponent } from './../pre-loded/pre-loded.component';
import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpEventType, HttpRequest, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import { PostEvent, UploadStatus } from './..//../interfaces/interfaces';


@Component({
  selector: 'app-load-your-own',
  templateUrl: './load-your-own.component.html',
  styleUrls: ['./load-your-own.component.scss']
})
export class LoadYourOwnComponent extends PreLodedComponent implements OnInit {

  Caption = [];
  selectedFiles = [];
  notAllowedList = [];
  afterUpload: boolean;
  multiple = true;
  maxSize = 20;
  selectionMethod =  'loadyourown';
  percentComplete = 0;

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) {
      super(messenger, http, modalService, global);
     }

  ngOnInit() {
  }

  clear() {
    this.selectedFiles = [];
    this.percentComplete = 0;

    this.messenger.setSchema('-');
    this.messenger.setSchemaFile('-');
    this.messenger.setType('-');
    this.messenger.setStatus('Ready');
  }
  onChange(event) {
    this.messenger.setSchema('User Uploaded');
    this.messenger.setStatus('Ready to Upload File');
    this.global.selectionMethod = this.selectionMethod;
    this.selectedFiles = [];
    this.Caption = [];

    const file = event.target.files || event.srcElement.files;
    for (let i = 0; i < file.length; i++) {
      if (file[i].size > this.maxSize * 1024000) {
        console.log('SIZE NOT ALLOWED (' + file[i].size + ')');
        this.notAllowedList.push({
          fileName: file[i].name,
          fileSize: file[i].size,
          errorMsg: 'Invalid size'
        });
        continue;
      } else {
        // format allowed and size allowed then add file to selectedFile array
        this.selectedFiles.push(file[i]);
      }
    }
  }

  upload() {
    this.messenger.setStatus('Uploading Files');
    const formData: any = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] === undefined) {
        this.Caption[i] = 'file' + i;
      }
      // Add DATA TO BE SENT
      formData.append(this.Caption[i], this.selectedFiles[i]);
    }

    const request = new HttpRequest(
      'POST',
      'http://localhost:8080/XSD_Forms/upload?uploadType=files&sessionID=' + this.global.sessionID,
      formData,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        }),
        reportProgress: true
      }
    );

    this.http.request<PostEvent>(request)
      .subscribe(
        event => {

          if (event.type === HttpEventType.DownloadProgress) {
            this.percentComplete = 100 * Math.round(event.loaded / event.total);
            this.messenger.setStatus('Uploading Files ' + this.percentComplete + '% Complete');
            console.log('Download progress event', event);
          }

          if (event.type === HttpEventType.UploadProgress) {
            this.percentComplete = 100 * Math.round(event.loaded / event.total);
            this.messenger.setStatus('Uploading Files ' + this.percentComplete + '% Complete');
             console.log('Upload progress event', event);
          }

          if (event.type === HttpEventType.Response) {
            console.log('response received...', event.body);
            if (event.body.status) {

              this.global.sessionID = event.body.sessionID;

              // The SessionID is used as the directory name on the server
              this.selectedCollection = this.global.sessionID;

              this.schemaFiles = [];
              for (let i = 0; i < this.selectedFiles.length; i++) {
                this.schemaFiles.push(this.selectedFiles[i].name);
              }

            } else {
              this.global.openModalAlert('Upload Failure', 'Uploading of selected files failed');
              this.messenger.setStatus('Uploading Files Failed');
            }
          }
        }
      );
  }
}

