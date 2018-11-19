import { Messenger } from './services/messenger';
import { ChoiceComponent } from './components/choice/choice.component';
import { Globals } from './services/globals';
import { ItemConfig } from './interfaces/interfaces';
import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnInit, AfterViewInit, AfterContentInit,ChangeDetectorRef  } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild("container", { read: ViewContainerRef }) container;
  @ViewChild("siblings", { read: ViewContainerRef }) siblingsPt;
  componentRef: any;
  elements: any[] = [];
  public depth = 0;
  children : any[] = [];
  public elementPath :string = "";
  public name :string = "ROOTPAGE";
  subscription :Subscription;

  constructor( private resolver: ComponentFactoryResolver, private http: HttpClient,  public global: Globals,  private cdRef : ChangeDetectorRef, private messenger: Messenger) {
    this.subscription = messenger.missionAnnounced$.subscribe(
      mission => {
        this.retrieveData(mission);
      }
    )
  }

  public getContainer(){

    return this.container;
  }

  public getSiblingsContainer(){
    return this.siblingsPt;
  }

  
  ngOnInit(): void {
//moved to ngAfterViewInit
  }

  ngAfterViewInit() : void {
    this.retrieveData('http://localhost:8080/XSD_Forms/json?type=aidx');
   }

  retrieveData(url: string){
   
    this.container.clear();
    this.global.root = null;
    this.http.get<ItemConfig>(url).subscribe(data => {

      data.elementPath = data.name;
      data.isRoot = true;
      this.walkStructure(data, this);
      this.global.getString();

    //This prevents ExpressionChangedAfterItHasBeenCheckedError
    // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
      this.cdRef.detectChanges();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  ngAfterContentInit(){
    //this.global.getString();
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
    
    if (this.global.root == null){
      this.global.root = newObjRef;
    }

    parentObject.children.push(newObjRef);
    newObjRef.setConfig(data, this, parentObject);
    

    // All the children of the object are created when the created objects calls walkSiblingSequence
    // The "headline" object is created and it takes care of creating the 
    // required number of "real" objects (siblings)
   }

  walkChoice(data,parentObject) {

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    let newObjRef = parentObject.getContainer().createComponent(factory).instance;

    if (this.global.root == null){
      this.global.root = newObjRef;
    }
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);

    // Initialise the object with it's configuration data
    newObjRef.setConfig(data, this,parentObject);
    
  }

  createSimple(data, parentObject){

    // Create the new Sequence Object (newObjRef)
     let factory = this.resolver.resolveComponentFactory(SimpleComponent);
     let newObjRef = parentObject.getContainer().createComponent(factory).instance;

     if (this.global.root == null){
      this.global.root = newObjRef;
    }
     
     // Initialise the object with it's configuration data
     newObjRef.setParentID(parentObject.id + "/" + data.name);
     newObjRef.setParent(parentObject);
     newObjRef.setConfig(data, parentObject);
     
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
   

    // Deferred until the object AfterViewInit
    // Go through the same process with all the configured child objects recursively.
    // for (var i = 0; i < conf.allOf.length; i++){
    //   this.walkStructure(conf.allOf[i], newObjRef);
    // }

    //newObjRef.setDefferedConf(conf);
  }

  createChoiceSibling(parentObject) {

    let conf = JSON.parse(JSON.stringify(parentObject.config));
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    let factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    let newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;
    
    newObjRef.setSiblingConfig(conf, this, parentObject);
    
    // Assign the new object as a child of the parent object
    parentObject.parent.children.push(newObjRef);
    parentObject.siblings.push(newObjRef);
  }

  createChoiceElement(data, parentObj){
    this.walkStructure(data,parentObj);
  }
}
