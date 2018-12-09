import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterXSDComponent } from './enter-xsd.component';

describe('EnterXSDComponent', () => {
  let component: EnterXSDComponent;
  let fixture: ComponentFixture<EnterXSDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterXSDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterXSDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
