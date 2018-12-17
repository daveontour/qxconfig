import { IntroTextComponent } from './components/intro-text/intro-text.component';
import { Messenger } from './services/messenger';
import { ChoiceComponent } from './components/choice/choice.component';
import { Globals } from './services/globals';
import { ItemConfig } from './interfaces/interfaces';
import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { OnInit, AfterViewInit, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild('container', { read: ViewContainerRef }) container;
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  componentRef: any;
  elements: any[] = [];
  public depth = 0;
  children: any[] = [];
  public elementPath = '';
  public name = 'ROOTPAGE';
  private subscription: Subscription;
  private schemaSub: Subscription;
  private schemaFileSub: Subscription;
  private typeSub: Subscription;
  private statusSub: Subscription;
  private homeSub: Subscription;
  schema = '-';
  schemaFile = '-';
  type = '-';
  status = 'Ready';
  wait = false;


  validationMessage = 'Validating...please wait';
  validationStatus = false;
  validateInProgress = false;
  schemaVersion = '18.1';
  supplementalMsg = '';

  constructor(
    private resolver: ComponentFactoryResolver,
    private modalService: NgbModal,
    private http: HttpClient,
    public global: Globals,
    private cdRef: ChangeDetectorRef,
    private messenger: Messenger) {

    this.subscription = messenger.missionAnnounced$.subscribe(
      mission => {
        this.retrieveData(mission);
      }
    );
    this.schemaSub = messenger.schema$.subscribe(
      data => {
        this.schema = data;
      }
    );

    this.schemaFileSub = messenger.schemaFile$.subscribe(
      data => {
        this.schemaFile = data;
      }
    );

    this.typeSub = messenger.type$.subscribe(
      data => {
        this.type = data;
      }
    );

    this.statusSub = messenger.status$.subscribe(
      data => {
        this.status = data;
      }
    );
    this.homeSub = messenger.home$.subscribe(
      data => {
        this.getContainer().clear();
        const factory = this.resolver.resolveComponentFactory(IntroTextComponent);
        const newObjRef = this.getContainer().createComponent(factory).instance;
      }
    );

  }

  public getContainer() {

    return this.container;
  }

  public getSiblingsContainer() {
    return this.siblingsPt;
  }


  ngOnInit(): void {
    // moved to ngAfterViewInit
  }

  ngAfterViewInit(): void {

    const factory = this.resolver.resolveComponentFactory(IntroTextComponent);
    const newObjRef = this.getContainer().createComponent(factory).instance;

    // const initURL = this.global.baseURL + '?op=getType&schema=AIDX18.1&file=IATA_AIDX_FlightLegNotifRQ.xsd' +
    //   '&type=IATA_AIDX_FlightLegNotifRQ&sessionID=new&selectionMethod=preload';
    // this.retrieveData(initURL);
    // this.messenger.setSchema('AIDX18.1');
    // this.messenger.setSchemaFile('IATA_AIDX_FlightLegNotifRQ.xsd');
    // this.messenger.setType('IATA_AIDX_FlightLegNotifRQ');
    // this.messenger.setStatus('Retrieving Schema');

    // this.global.selectedSchema = 'AIDX18.1';
    // this.global.sessionID = 'new';
    // this.global.selectionMethod = 'preload';

  }

  retrieveData(url: string) {
    this.status = 'Retrieving Data';
    this.wait = true;
    this.container.clear();
    this.global.root = null;

 //   this.modalService.dismissAll();
    this.global.openModalAlert('Schema Processing', 'Processing Schema. Please Wait.');

    this.http.get<ItemConfig>(url).subscribe(data => {
      this.wait = false;
      this.modalService.dismissAll();
      if (data.failed) {
        this.status = 'Retrival Failure';
        this.global.openModalAlert('Problem Reading Schema', data.msg);
        return;
      } else {
        this.status = 'Ready';
        this.global.openModalAlert('Schema Retrieved', 'Schema interpretted successfully');
      }
      data.elementPath = data.name;
      data.isRoot = true;
      this.walkStructure(data, this);
      this.global.getString();

      // This prevents ExpressionChangedAfterItHasBeenCheckedError
      // reference: https://stackoverflow.com/questions/43375532/expressionchangedafterithasbeencheckederror-explained
      this.cdRef.detectChanges();
    },
      (err: HttpErrorResponse) => {
        this.modalService.dismissAll();
        this.wait = false;
        if (err.error instanceof Error) {
          this.global.openModalAlert('An error occurred:', err.error.message);
        } else {
          this.global.openModalAlert('An error occurred:', 'Check Console');
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      });
  }

  ngAfterContentInit() {
    // this.global.getString();
  }

  walkStructure(data, parentObject) {

    // Dispatch the item to the selected type handler
    if (data.type === 'sequence') {
      this.walkSequence(data, parentObject);
    } else if (data.type === 'choice') {
      this.walkChoice(data, parentObject);
    } else {
      this.createSimple(data, parentObject);
    }
  }

  walkSequence(data, parentObject) {

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(SequenceComponent);
    const newObjRef = parentObject.getContainer().createComponent(factory).instance;

    if (this.global.root == null) {
      this.global.root = newObjRef;
    }

    parentObject.children.push(newObjRef);
    newObjRef.setConfig(data, this, parentObject);

    // All the children of the object are created when the created objects calls walkSiblingSequence
    // The "headline" object is created and it takes care of creating the
    // required number of "real" objects (siblings)
  }

  walkChoice(data, parentObject) {

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    const newObjRef = parentObject.getContainer().createComponent(factory).instance;


    if (this.global.root == null) {
      this.global.root = newObjRef;
    }
    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);

    // Initialise the object with it's configuration data
    newObjRef.setConfig(data, this, parentObject);

  }

  createSimple(data, parentObject) {

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(SimpleComponent);
    const newObjRef = parentObject.getContainer().createComponent(factory).instance;

    if (this.global.root == null) {
      this.global.root = newObjRef;
    }

    // Initialise the object with it's configuration data
    newObjRef.setParentID(parentObject.id + '/' + data.name);
    newObjRef.setParent(parentObject);
    newObjRef.setConfig(data, parentObject);

    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);
  }

  /*
  * For when a sibling of a sequence needs to be created
  */
  walkSequenceSibling(parentObject) {

    const conf = JSON.parse(JSON.stringify(parentObject.config));
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(SequenceComponent);
    const newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;

    newObjRef.setSiblingConfig(conf, this, parentObject);

    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);


    // Deferred until the object AfterViewInit
    // Go through the same process with all the configured child objects recursively.
    // for (var i = 0; i < conf.allOf.length; i++){
    //   this.walkStructure(conf.allOf[i], newObjRef);
    // }

    // newObjRef.setDefferedConf(conf);
  }

  createChoiceSibling(parentObject) {

    const conf = JSON.parse(JSON.stringify(parentObject.config));
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(ChoiceComponent);
    const newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;

    newObjRef.setSiblingConfig(conf, this, parentObject);

    // Assign the new object as a child of the parent object
    parentObject.parent.children.push(newObjRef);
    parentObject.siblings.push(newObjRef);
  }

  createChoiceElement(data, parentObj) {
    this.walkStructure(data, parentObj);
  }
}

