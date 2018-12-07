import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      }),
      params: {
        sessionID: this.global.sessionID
      },
      reportProgress: true
    };

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] === undefined) {
        this.Caption[i] = 'file' + i;
      }
      // Add DATA TO BE SENT
      formData.append(this.Caption[i], this.selectedFiles[i]);
    }

    this.http.post<UploadStatus>('http://localhost:8080/XSD_Forms/upload', formData, httpOptions)
    // .pipe(
    //   map(event => this.getEventMessage(event, file)),
    //   tap(message => this.showProgress(message)),
    //   last(), // return last (completed) message to caller
    //   catchError(this.handleError(file))
    // );
      .subscribe(data => {
        console.log(data);
        if (data.status) {
          alert('Upload OK ' + data.sessionID);
          this.global.sessionID = data.sessionID;
        } else {
          alert ('Upload Failed');
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
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

interface UploadStatus {
  status: boolean;
  sessionID: string;
}
