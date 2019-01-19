import { Globals } from './../../../services/globals';
import { Messenger } from './../../../services/messenger';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-savefileupload',
  templateUrl: './savefileupload.component.html',
  styleUrls: ['./savefileupload.component.scss']
})
export class SavefileuploadComponent implements OnInit {

  public percentComplete: number;
  public message = 'Uploading File';

  constructor (
  private modalService: NgbModal,
  private messenger: Messenger,
  private global: Globals

  ) { }

  ngOnInit() {

    this.messenger.uploadpercentage$.subscribe(
      data => {
        this.percentComplete = data;
        this.message = 'Uploading File -' + data + '% Complete';
        if (this.percentComplete > 99) {
          this.message = 'Extracting and Processing File. Please Wait';
        }
      }
    );
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
