import { Component, OnInit } from '@angular/core';
import { Globals } from './../../services/globals';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../services/messenger';
import * as $ from 'jquery';

@Component({
  selector: 'app-showxsd',
  templateUrl: './showxsd.component.html',
  styleUrls: ['./showxsd.component.scss']
})
export class ShowxsdComponent implements OnInit {

  data: any;
  fileContent: string = null;

  constructor(
    public messenger: Messenger,
    public http: HttpClient,
    public modalService: NgbModal,
    public global: Globals
  ) { }

  ngOnInit() {

    $('*').addClass('waiting');

    this.http.get<any>(this.global.rootURL + '/getJsonXSDFiles?schema=' + this.global.selectedSchema).subscribe(
        data => {

          $('*').removeClass('waiting');
          this.data = data.data;

          if (this.data.length === 0) {
            this.global.openModalAlert('Schema File Selection Error', 'No Schema Files Were Found');
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

  c(reason: string) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }
  d(reason: string) {
    this.modalService.dismissAll();
    this.messenger.dismiss();
  }

}

