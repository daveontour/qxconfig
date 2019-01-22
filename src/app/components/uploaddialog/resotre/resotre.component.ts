import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Messenger } from './../../../services/messenger';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-resotre',
  templateUrl: './resotre.component.html',
  styleUrls: ['./resotre.component.scss']
})
export class ResotreComponent implements OnInit {

  constructor(
    private messenger: Messenger,
    private modalService: NgbModal
  ) { }


  ngOnInit() {
  }

  apply() {
    this.modalService.dismissAll();
    this.messenger.apply();
  }
}
