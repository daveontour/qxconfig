import { SaveObjFile } from './globals';
import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import { ItemConfig } from '../interfaces/interfaces';


/*
Dispatched messages and events between the different components.
Mainly used by the Director which listens for events and coordinates actions
*/
@Injectable()
export class Messenger {

    // Observable string sources
    private missionAnnouncedSource = new Subject<string>();
    private missionConfirmedSource = new Subject<string>();
    private openSchemaDialog = new Subject<string>();
    private announceSchema = new Subject<string>();
    private announceSchemaFile = new Subject<string>();
    private announceType = new Subject<string>();
    private announceStatus = new Subject<string>();
    private announceGoHome = new Subject<string>();
    private announceDismiss = new Subject<string>();
    private announceTrigger = new Subject<string>();
    private announceSave = new Subject<string>();
    private announceApply = new Subject<string>();
    private announceUndo = new Subject<string>();
    private announceMenuSelectSchema = new Subject<string>();
    private announceValidate = new Subject<string>();
    private announceSettings = new Subject<string>();
    private announceReset = new Subject<string>();
    private announceSaveFileSelect = new Subject<any>();
    private announceDocumentClean = new Subject<boolean>();
    private announceFetchAndApply = new Subject<SaveObjFile>();
    private announceNewXSD = new Subject<ItemConfig>();
    private announceFormReady = new Subject<string>();
    private announceUploadXSD = new Subject<string>();
    private announceXSDUploaded = new Subject<string>();
    private announceUploadedPercentage = new Subject<number>();
    private announceDownloadXML = new Subject();
    private announceShowXSD = new Subject();
    private announceXMLUtils = new Subject();
    // Observable string streams
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();
    openDialog$ = this.openSchemaDialog.asObservable();
    schema$ = this.announceSchema.asObservable();
    schemaFile$ = this.announceSchemaFile.asObservable();
    type$ = this.announceType.asObservable();
    status$ = this.announceStatus.asObservable();
    home$ = this.announceGoHome.asObservable();
    dismiss$ = this.announceDismiss.asObservable();
    triggers$ = this.announceTrigger.asObservable();
    save$ = this.announceSave.asObservable();
    apply$ = this.announceApply.asObservable();
    undo$ = this.announceUndo.asObservable();
    selectSchema$ = this.announceMenuSelectSchema.asObservable();
    validate$ = this.announceValidate.asObservable();
    settings$ = this.announceSettings.asObservable();
    reset$ = this.announceReset.asObservable();
    savefileselected$ = this.announceSaveFileSelect.asObservable();
    docClean$ = this.announceDocumentClean.asObservable();
    fetchandapply$ = this.announceFetchAndApply.asObservable();
    newxsd$ = this.announceNewXSD.asObservable();
    formready$ = this.announceFormReady.asObservable();
    uploadXSD$ = this.announceUploadXSD.asObservable();
    xsduploaded$ = this.announceXSDUploaded.asObservable();
    uploadpercentage$ = this.announceUploadedPercentage.asObservable();
    downloadxml$ = this.announceDownloadXML.asObservable();
    showXSD$ = this.announceShowXSD.asObservable();
    xmlUtils$ = this.announceXMLUtils.asObservable();


    // Service message commands
    announceMission(mission: string) {
      this.missionAnnouncedSource.next(mission);
    }
    setUploadPercentage(percent: number ) {
      this.announceUploadedPercentage.next(percent);
    }
    confirmMission(astronaut: string) {
      this.missionConfirmedSource.next(astronaut);
    }
    openSchemaSelection(string: string) {
      this.openSchemaDialog.next(string);
    }
    selectSchema(string: string) {
      this.announceMenuSelectSchema.next(string);
    }
    setSchema(string: string) {
      this.announceSchema.next(string);
    }
    setSchemaFile(string: string) {
      this.announceSchemaFile.next(string);
    }
    setType(string: string) {
      this.announceType.next(string);
    }
    setStatus(string: string) {
      this.announceStatus.next(string);
    }
    goHome() {
      this.announceGoHome.next('goHome');
    }
    save() {
      this.announceSave.next();
    }
    showXSD() {
      this.announceShowXSD.next();
    }
    apply() {
      this.announceApply.next();
    }
    undo() {
      this.announceUndo.next();
    }
    dismiss() {
      this.announceDismiss.next();
    }
    setPopoverTrigger(trigger) {
      this.announceTrigger.next(trigger);
    }
    validate() {
      this.announceValidate.next();
    }
    settings() {
      this.announceSettings.next();
    }
    reset() {
      this.announceReset.next();
    }
    saveFileSelect(event: any) {
      this.announceSaveFileSelect.next(event);
    }
    setDocumentClean() {
      this.announceDocumentClean.next(true);
    }
    setDocumentDirty() {
      this.announceDocumentClean.next(false);
    }
    fetchAndApply(soFile: SaveObjFile) {
      this.announceFetchAndApply.next(soFile);
    }
    newXSDReady(xsd: ItemConfig) {
      this.announceNewXSD.next(xsd);
    }
    formReady() {
      this.announceFormReady.next();
    }
    uploadXSD(xsd: string) {
      this.announceUploadXSD.next(xsd);
    }
    xsduploaded() {
      this.announceXSDUploaded.next();
    }
    downloadXML() {
      this.announceDownloadXML.next();
    }
    xmlUtils() {
      this.announceXMLUtils.next();
    }
}
