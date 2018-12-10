import { PreLodedComponent } from './../pre-loded/pre-loded.component';
import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpEventType, HttpRequest, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import { PostEvent, UploadStatus } from './..//../interfaces/interfaces';

@Component({
  selector: 'app-enter-xsd',
  templateUrl: './enter-xsd.component.html',
  styleUrls: ['./enter-xsd.component.scss']
})
export class EnterXSDComponent extends PreLodedComponent implements OnInit {

  selectionMethod = 'enterxsd';
  enteredXSD = '';

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals) {
    super(messenger, http, modalService, global);
  }

  ngOnInit() {
  }

  upload() {

    this.messenger.setSchema('User Uploaded');
    this.messenger.setSchemaFile('User Uploaded');
    this.messenger.setType('-');
    this.messenger.setStatus('Ready');

    this.global.selectionMethod = this.selectionMethod;
    const request = new HttpRequest(
      'POST',
      'http://localhost:8080/XSD_Forms/upload?uploadType=enteredxsd&sessionID=' + this.global.sessionID,
      this.enteredXSD,
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
            console.log('Download progress event', event);
          }

          if (event.type === HttpEventType.UploadProgress) {
            console.log('Upload progress event', event);
          }

          if (event.type === HttpEventType.Response) {
            console.log('response received...', event.body);
            if (event.body.status) {
              this.global.sessionID = event.body.sessionID;

              // The SessionID is used as the directory name on the server
              this.selectedCollection = this.global.sessionID;
              this.selectedFile = this.global.sessionID + '.xsd';
              this.changeFile();
            } else {
              this.messenger.setStatus('XSD Upload failure');
              this.global.openModalAlert('XSD Save Failure', 'The XSD could not be uploaded to the server for processing');
            }
          }
        }
      );
  }
}
