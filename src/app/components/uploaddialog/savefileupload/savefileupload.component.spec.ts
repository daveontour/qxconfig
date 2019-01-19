import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavefileuploadComponent } from './savefileupload.component';

describe('SavefileuploadComponent', () => {
  let component: SavefileuploadComponent;
  let fixture: ComponentFixture<SavefileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavefileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavefileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
