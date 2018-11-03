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
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
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

  public getSiblingsContainer(){
    return this.siblingsPt;
  }

  ngOnInit(): void {

    this.http.get<ItemConfig>('http://localhost:8080/XSD_Forms/json?type=test').subscribe(data => {
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

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(SequenceComponent);
    let newObjRef = parentObject.getContainer().createComponent(factory).instance;
    newObjRef.setConfig(data, this, parentObject);
    parentObject.children.push(newObjRef);

    // All the children of the object are created when the created objects calls walkSiblingSequence
    // The "headline" object is created and it takes care of creating the 
    // required number of "real" objects (siblings)
   }

  walkChoice(data,parentObject) {

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    let newObjRef = parentObject.getContainer().createComponent(factory).instance;
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);

    // Initialise the object with it's configuration data
    newObjRef.setConfig(data, this,parentObject);
    
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
  }

  createChoiceSibling(parentObject) {

    let conf = JSON.parse(JSON.stringify(parentObject.config));
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    let newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;
    
    newObjRef.setSiblingConfig(conf, this, parentObject);
    
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);
   
  }

  createChoiceElement(data, parentObj){
    this.walkStructure(data,parentObj);
  }
}
