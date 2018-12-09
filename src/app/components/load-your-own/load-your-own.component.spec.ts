import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadYourOwnComponent } from './load-your-own.component';

describe('LoadYourOwnComponent', () => {
  let component: LoadYourOwnComponent;
  let fixture: ComponentFixture<LoadYourOwnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadYourOwnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadYourOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
