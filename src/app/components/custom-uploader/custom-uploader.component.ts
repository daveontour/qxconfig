import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpEventType, HttpRequest, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-custom-uploader',
  templateUrl: './custom-uploader.component.html',
  styleUrls: ['./custom-uploader.component.scss']
})
export class CustomUploaderComponent implements OnInit {

  Caption = [];
  selectedFiles = [];
  notAllowedList = [];
  afterUpload: boolean;
  multiple = true;
  maxSize = 20;

  constructor(
    private http: HttpClient,
    public global: Globals) { }

  ngOnInit() {
  }

  onChange(event) {

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
      'http://localhost:8080/XSD_Forms/upload?sessionID=' + this.global.sessionID,
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
            console.log('Download progress event', event);
          }

          if (event.type === HttpEventType.UploadProgress) {
            console.log('Upload progress event', event);
          }

          if (event.type === HttpEventType.Response) {
            console.log('response received...', event.body);
            if (event.body.status) {
              alert('Upload OK ' + event.body.sessionID);
              this.global.sessionID = event.body.sessionID;
            } else {
              alert('Upload Failed');
            }
          }
        }


      );
    // .pipe(
    //   map(event => this.getEventMessage(event, file)),
    //   tap(message => this.showProgress(message)),
    //   last(), // return last (completed) message to caller
    //   catchError(this.handleError(file))
    // );
    // .subscribe(data => {
    //    if (data.status) {
    //     alert('Upload OK ' + data.sessionID);
    //     this.global.sessionID = data.sessionID;
    //   } else {
    //     alert ('Upload Failed');
    //   }
    // }, (err: HttpErrorResponse) => {
    //   if (err.error instanceof Error) {
    //     console.log('An error occurred:', err.error.message);
    //   } else {
    //     console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //   }
    // });
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;
      case HttpEventType.UploadProgress:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `File "${file.name}" is ${percentDone}% uploaded.`;
      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;
      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
}

interface PostEvent {
  type: any;
  body: UploadStatus;
  sessionID: string;
  status: boolean;
}

interface UploadStatus {
  status: boolean;
  sessionID: string;
}
