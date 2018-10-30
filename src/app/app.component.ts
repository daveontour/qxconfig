import { Globals } from './globals';
import { ItemConfig } from './interfaces/interfaces';
import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import * as $ from "jquery";




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild("container", { read: ViewContainerRef }) container;
  componentRef: any;
  elements: any[] = [];
  title = "AIDX Flight Messages";
  elementID: number = 100;
  idx: number = 4;
  

  constructor(
    private resolver: ComponentFactoryResolver, 
    private http: HttpClient, 
     public global: Globals
  ) { 

  }

  ngOnInit(): void {
    this.createElement();
  }


  createElement() {

    // Need to cater for Choice as a root element

    this.http.get<ItemConfig>('http://localhost:8080/XSD_Forms/json?type=aidx').subscribe(data => {
      console.log(data);
      data.elementPath = data.name;
      if (data.type == "simple") {
        const factory = this.resolver.resolveComponentFactory(SimpleComponent);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.setParentID("/");
        this.componentRef.instance.isRoot = true;
        this.componentRef.instance.setConfig(data);
        this.global.root = this.componentRef.instance;
      } else {
        const factory = this.resolver.resolveComponentFactory(SequenceComponent);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.setParentID("/");
        this.componentRef.instance.isRoot = true;
        this.componentRef.instance.setConfig(data);
        this.global.root = this.componentRef.instance;
      }

      this.global.getString();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }
}
