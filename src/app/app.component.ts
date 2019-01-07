import { IntroTextComponent } from './components/intro-text/intro-text.component';
import { Messenger } from './services/messenger';
import { ChoiceComponent } from './components/choice/choice.component';
import { Globals, SaveObj } from './services/globals';
import { ItemConfig } from './interfaces/interfaces';
import { SimpleComponent } from './components/simple/simple.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { OnInit, AfterViewInit, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterpretter } from './services/token-interpretter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbPopoverConfig]
})
export class AppComponent implements AfterViewInit, AfterContentInit {
  @ViewChild('container', { read: ViewContainerRef }) container;
  @ViewChild('siblings', { read: ViewContainerRef }) siblingsPt;
  @ViewChild('sampleEditor') editor;
  componentRef: any;
  elements: any[] = [];
  public depth = 0;
  children: any[] = [];
  public elementPath = '';
  public name = 'ROOTPAGE';

  schema = '-';
  prevSchema = '-';
  schemaFile = '-';
  prevScehmaFile = '-';
  type = '-';
  prevType = '-';
  status = 'Ready';
  wait = false;
  ace: any;
  sess: any;
  editorStatus: string;
  soText: string;

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
    private messenger: Messenger,
    public config: NgbPopoverConfig) {

    config.triggers = 'triggers="mouseenter:mouseleave';

    const _this = this;

    messenger.missionAnnounced$.subscribe(
      mission => {
        this.retrieveData(mission);
      }
    );
    messenger.schema$.subscribe(
      data => {
        this.prevSchema = this.schema;
        this.schema = data;
      }
    );
    messenger.schemaFile$.subscribe(
      data => {
        this.prevScehmaFile = this.schemaFile;
        this.schemaFile = data;
      }
    );
    messenger.type$.subscribe(
      data => {
        this.prevType = this.type;
        this.type = data;
      }
    );
    messenger.status$.subscribe(
      data => {
        this.status = data;
      }
    );
    messenger.home$.subscribe(
      data => {
        this.global.XMLMessage = '';
        this.global.elementsUndefined = [];
        this.global.attributesUndefined = [];
        this.global.formatErrors = [];
        this.getContainer().clear();
        this.schema = '-';
        this.schemaFile = '-';
        this.type = '-';
        this.status = 'Ready';
        this.getContainer().createComponent(this.resolver.resolveComponentFactory(IntroTextComponent));
      }
    );
    messenger.dismiss$.subscribe(
      data => {
        this.schema = this.prevSchema;
        this.schemaFile = this.prevScehmaFile;
        this.type = this.prevType;
        this.status = 'Ready';
      }
    );
    messenger.save$.subscribe(
      data => {
        const so = _this.global.root.getSaveObj();
        _this.soText = JSON.stringify(so);

        console.log(_this.soText);
        console.log(so);
      }
    );
    messenger.apply$.subscribe(
      data => {
        const so = JSON.parse(_this.soText);
        console.log('Applying saved object');
        _this.global.root.applyConfig(so);
      }
    );
    messenger.undo$.subscribe(
      data => {
        if (_this.global.undoStack.length <= 1) {
          return;
        }
        _this.global.lockChangeDet();
        // The last one on the stack represents the current state, so discard it. 
        _this.global.undoStack.pop();
        $('body').addClass('waiting');
        _this.global.openModalAlert('Undo', 'Processing. Please Wait.');
         setTimeout(() => {
          _this.global.root.applyConfig(_this.global.undoStack.pop());
          $('body').removeClass('waiting');
          _this.modalService.dismissAll();
          setTimeout(() => {
            _this.global.enableChangeDet();
            _this.global.getString();
          });
        });
        // setTimeout(() => {
        //   _this.global.enableChangeDet();
        //   _this.global.getString();
        // });
      }
    );
  }

  public getContainer() {
    return this.container;
  }

  public getSiblingsContainer() {
    return this.siblingsPt;
  }

  ngAfterViewInit(): void {
    const factory = this.resolver.resolveComponentFactory(IntroTextComponent);
    const newObjRef = this.getContainer().createComponent(factory).instance;
  }

  ngAfterContentInit() {

    const _this = this;

    // Set up the keystroke handler for the editor to limit what is editable
    this.global.editor = this.editor;
    this.ace = this.global.editor.getEditor();
    this.sess = this.ace.session;

    this.editor._editor.keyBinding.addKeyboardHandler(function ($data, hashId, keyString, keyCode, e) {

      // Clear any status message

      _this.editorStatus = '';
      _this.cdRef.detectChanges();

      // Allow cursor movements
      if (keyString === 'up'
        || keyString === 'down'
        || keyString === 'right'
        || keyString === 'left'
      ) {
        return;
      }

      const pos = _this.editor._editor.selection.getCursor();
      const token = _this.sess.getTokenAt(pos.row, pos.column);
      let token2 = _this.sess.getTokenAt(pos.row, pos.column + 1);

      if (token2 == null || token == null) {
        return { command: 'null' };
      }
      if (token.type === 'meta.tag.punctuation.tag-close.xml' && token2.type === 'meta.tag.punctuation.end-tag-open.xml') {
        if (keyString === 'backspace' || keyString === 'delete') {
          return { command: 'null' };
        } else {
          return;
        }
      }

      if (token.type === 'text.xml' && token2.type === 'meta.tag.punctuation.end-tag-open.xml' && keyString === 'delete') {
        return { command: 'null' };
      }
      if (token.type === 'meta.tag.punctuation.tag-close.xml' && token2.type === 'text.xml' && keyString === 'delete') {
        return;
      }
      // Protect agains removing space between tag and first attribute
      if (token.type === 'text.tag-whitespace.xml' && keyString === 'backspace') {
        token2 = _this.sess.getTokenAt(pos.row, pos.column - 1);
        if (token2.type === 'meta.tag.tag-name.xml') {
          return { command: 'null' };
        }
      }
      // Don't delete the closing tag
      if ((token.type === 'text.tag-whitespace.xml' || token.type === 'string.attribute-value.xml') && keyString === 'delete') {
        token2 = _this.sess.getTokenAt(pos.row, pos.column + 1);
        if (token2.type === 'meta.tag.punctuation.tag-close.xml') {
          return { command: 'null' };
        }
      }

      // Allow editing of these types
      if (token.type === 'text.xml'
        || token.type === 'string.attribute-value.xml'
        || token.type === 'text.tag-whitespace.xml'
        || token.type === 'entity.other.attribute-name.xml'
        || token.type === 'keyword.operator.attribute-equals.xml') {
        return;
      }

      // Put up a status message and disallow the keystroke
      _this.editorStatus = 'Warning: You can only edit element values and attributes here';
      _this.cdRef.detectChanges();
      return { command: 'null' };

    });
  }

  retrieveData(url: string) {
    this.status = 'Retrieving Data';
    this.wait = true;
    this.container.clear();
    this.global.root = null;
    this.global.undoStack = [];

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
        // this.global.openModalAlert('Schema Retrieved', 'Schema interpretted successfully');
        this.modalService.dismissAll();
      }
      data.elementPath = data.name;
      data.isRoot = true;
      this.global.lockChangeDet();
      console.log('Start Walk Structure');
      this.walkStructure(data, this);
      console.log('End Walk Structure');
      setTimeout(() => {
        this.global.enableChangeDet();
        this.global.formLoaded();
      });


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

  onTextChange(event) {

    this.editorStatus = '';
    this.cdRef.detectChanges();
    this.global.lockChangeDet();

    const ti = new TokenInterpretter(this.global)
    const res = this.global.root.setText([ti.getRoot()]);

    if (res === Globals.VALUEHANDLED || res === Globals.ATTRIBUTEHANDLED) {
      this.editorStatus = 'Changes Processed';
      this.cdRef.detectChanges();
      this.global.enableChangeDet();
      return;
    }

    if (res === Globals.OK) {
      this.editorStatus = 'No changes made yet';
      this.cdRef.detectChanges();
      this.global.enableChangeDet();
      return;
    }

    this.global.enableChangeDet();
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

  walkSequenceSibling(parentObject) {

    const conf = JSON.parse(JSON.stringify(parentObject.config));
    conf.isSibling = true;

    // Create the new Sequence Object (newObjRef)
    const factory = this.resolver.resolveComponentFactory(SequenceComponent);
    const newObjRef = parentObject.getSiblingsContainer().createComponent(factory).instance;

    newObjRef.setSiblingConfig(conf, this, parentObject);

    // Assign the new object as a child of the parent object
    parentObject.children.push(newObjRef);

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

