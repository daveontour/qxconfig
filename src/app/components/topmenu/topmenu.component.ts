import { Messenger } from './../../services/messenger';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss']
})
export class TopmenuComponent implements OnInit {

  constructor(private messenger: Messenger) { }

  ngOnInit() {
  }

  sendAIDX(){
    this.messenger.announceMission('http://localhost:8080/XSD_Forms/json?type=aidx');
  }

  sendAIP(){
    this.messenger.announceMission('http://localhost:8080/XSD_Forms/json?type=aipfull');
  }

  sendTest(){
    this.messenger.announceMission('http://localhost:8080/XSD_Forms/json?type=test');
  }

  sendAIPTest(){
    this.messenger.announceMission('http://localhost:8080/XSD_Forms/json?type=aip');
  }
}

