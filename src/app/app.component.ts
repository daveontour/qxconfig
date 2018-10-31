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
export class AppComponent implements OnInit {
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
      this.walkStructure(data, data);
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

  walkStructure(data, compRef, ) {
    var x = this;

    //Dispatch the item to the selected type handler
    if (data.type == "sequence") {
      this.walkSequence(data, compRef);
    } else if (data.type == "choice") {
      this.walkChoice(data, compRef);
    } else {
      this.createSimple(data, compRef);
    }
  }

  walkSequence(data,parentRef) {

    console.log("Start of --- Sequence ----" + data.name);

    /*
    Create the item
    */

    // Cycle through the child items to call the same,
    for (var i = 0; i < data.allOf.length; i++){
      let child = data.allOf[i];
      this.walkStructure(child,data);
    }

    console.log("End of --- Sequence ----" + data.name);
    //Create the sequence Element
    //Assign it as a child of the parent
    //For all it's children walkStructure()
  }

  walkChoice(data,parentRef) {
      console.log("Start of --- Choice ----");
      for (var i = 0; i < data.oneOf.length; i++){
        let child = data.oneOf[i];
        console.log(child.name + "  "+parentRef.name);
        this.walkStructure(child,data);
      }
      console.log("End of --- Choice ----" + data.name);
  }

  createSimple(data, compRef){
      console.log("--- Simple ---"  + data.name);
  }

}
