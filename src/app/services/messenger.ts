import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';

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

    // Service message commands
    announceMission(mission: string) {
      this.missionAnnouncedSource.next(mission);
    }

    confirmMission(astronaut: string) {
      this.missionConfirmedSource.next(astronaut);
    }

    openSchemaSelection(string: string) {
      this.openSchemaDialog.next(string);
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

}
