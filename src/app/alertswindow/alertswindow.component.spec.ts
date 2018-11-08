import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertswindowComponent } from './alertswindow.component';

describe('AlertswindowComponent', () => {
  let component: AlertswindowComponent;
  let fixture: ComponentFixture<AlertswindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertswindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertswindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
