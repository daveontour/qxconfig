import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUploaderComponent } from './custom-uploader.component';

describe('CustomUploaderComponent', () => {
  let component: CustomUploaderComponent;
  let fixture: ComponentFixture<CustomUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
