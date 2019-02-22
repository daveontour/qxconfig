import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlutilsComponent } from './xmlutils.component';

describe('XmlutilsComponent', () => {
  let component: XmlutilsComponent;
  let fixture: ComponentFixture<XmlutilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlutilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlutilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
