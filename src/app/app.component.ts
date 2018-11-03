import { ChoiceComponent } from './components/choice/choice.component';
import { Globals } from './globals';
import { ItemConfig } from './interfaces/interfaces';
import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

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
  public depth = 0;
  children : any[] = [];


  constructor( private resolver: ComponentFactoryResolver, private http: HttpClient,  public global: Globals ) {
  
  }

  public getContainer(){
    return this.container;
  }

  ngOnInit(): void {

    this.http.get<ItemConfig>('http://localhost:8080/XSD_Forms/json?type=aidx').subscribe(data => {
      data.elementPath = data.name;
      data.isRoot = true;
      this.walkStructure(data, this);
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

 walkStructure(data, parentObject ) {
    //Dispatch the item to the selected type handler
    if (data.type == "sequence") {
      this.walkSequence(data, parentObject);
    } else if (data.type == "choice") {
      this.walkChoice(data,parentObject);
    } else {
      this.createSimple(data, parentObject);
    }
  }

  walkSequence(data,parentObject) {

    console.log("Start of --- Sequence ----" + data.name);

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(SequenceComponent);
    let newObjRef = parentObject.getContainer().createComponent(factory).instance;
    
    // Initialise the object with it's configuration data
    let topLevel : boolean = true;
    if (data.isSibling){
      topLevel = false;
    }
    newObjRef.setConfig(data, this, parentObject, topLevel);
    
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);
   
    // Go through the same process with all the configured child objects recursively.
    for (var i = 0; i < data.allOf.length; i++){
      this.walkStructure(data.allOf[i], newObjRef);
    }

    console.log("End of --- Sequence ----" + data.name);

  }

  walkChoice(data,parentObject) {

    return;
    console.log("Start of ---Choice ----" + data.name);

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    let newObjRef = parentObject.getContainer().createComponent(factory).instance;
    
    // Initialise the object with it's configuration data
    newObjRef.setConfig(data, this);
    
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);
   
    // Go through the same process with all the configured child objects recursively.
    for (var i = 0; i < data.allOf.length; i++){
      this.walkStructure(data.allOf[i], newObjRef);
    }

    console.log("End of --- Choice ----" + data.name);
  }

  createSimple(data, parentObject){

    // Create the new Sequence Object (newObjRef)
     let factory = this.resolver.resolveComponentFactory(SimpleComponent);
     let newObjRef = parentObject.getContainer().createComponent(factory).instance;
     
     // Initialise the object with it's configuration data
     newObjRef.setParentID(parentObject.id + "/" + data.name);
     newObjRef.setParent(parentObject);
     newObjRef.setConfig(data);
     
     // Assign the new object as a child of the parent object
     parentObject.children.push(newObjRef);     
  }

  /*
  * For when a sibling of a sequence needs to be created
  */
  walkSequenceSibling(parentObject) {

    let conf = JSON.parse(JSON.stringify(parentObject.config));
    console.log("Start of --- Sequence Sibling ----" +conf.name);
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(SequenceComponent);
    let newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;
    
    newObjRef.setSiblingConfig(conf, this, parentObject);
    
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);
   
    // Go through the same process with all the configured child objects recursively.
    for (var i = 0; i < conf.allOf.length; i++){
      this.walkStructure(conf.allOf[i], newObjRef);
    }

    console.log("End of --- Sequence Sibling ----" + conf.name);

  }
}
