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
    dismiss() {
      this.announceDismiss.next();
    }

}
