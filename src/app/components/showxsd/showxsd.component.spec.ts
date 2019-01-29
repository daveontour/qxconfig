import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowxsdComponent } from './showxsd.component';

describe('ShowxsdComponent', () => {
  let component: ShowxsdComponent;
  let fixture: ComponentFixture<ShowxsdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowxsdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowxsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
