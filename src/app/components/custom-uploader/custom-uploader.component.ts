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

  constructor() { }

  ngOnInit() {
  }

  onChange(event) {

    this.selectedFiles = [];
    this.Caption = [];

    const file = event.target.files || event.srcElement.files;
    for (let i = 0; i < file.length; i++) {
      console.log(file[i].name);
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
    this.sendFiles();
  }

  sendFiles() {
    const _this = this;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.Caption[i] === undefined) {
        this.Caption[i] = 'file' + i;
      }
      // Add DATA TO BE SENT
      formData.append(this.Caption[i], this.selectedFiles[i] /*, this.selectedFiles[i].name*/);
    }

    xhr.onreadystatechange = function (evnt) {

      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          // isError = true;
          // _this.progressBarShow = false;
          // _this.uploadBtn = false;
          // _this.uploadMsg = true;
          // _this.afterUpload = true;
          // _this.uploadMsgText = 'Upload Failed !';
          // _this.uploadMsgClass = 'text-danger lead';
        }
        // _this.ApiResponse.emit(xhr);
      }
    };

    // Handle the progress
    xhr.upload.onprogress = function (evnt) {
      if (evnt.lengthComputable) {
        const percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
        console.log('Progress...' + percentComplete + '%');
      }
    };

    // Handle the errors
    xhr.onerror = function (evnt) {
      // console.log("onerror");
      // console.log(evnt);
    };

    // Handle upload completion

    xhr.onload = function (evnt) {
      // // console.log("onload");
      // // console.log(evnt);
      // _this.progressBarShow = false;
      // _this.uploadBtn = false;
      // _this.uploadMsg = true;
      // _this.afterUpload = true;
      // if (!isError) {
      //   _this.uploadMsgText = 'Successfully Uploaded !';
      //   _this.uploadMsgClass = 'text-success lead';
      //   // console.log(this.uploadMsgText + " " + this.selectedFiles.length + " file");
      // }
    };


    // Open the connect for sending
    xhr.open('POST', 'http://localhost:8080/XSD_Forms/upload', true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
 
    // Finally send the files
    xhr.send(formData);
  }

  uploadProgress(event) {

  }

}
