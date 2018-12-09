import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreLodedComponent } from './pre-loded.component';

describe('PreLodedComponent', () => {
  let component: PreLodedComponent;
  let fixture: ComponentFixture<PreLodedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLodedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreLodedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
