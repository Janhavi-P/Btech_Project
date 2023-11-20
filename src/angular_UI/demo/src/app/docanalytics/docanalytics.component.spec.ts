import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocanalyticsComponent } from './docanalytics.component';

describe('DocanalyticsComponent', () => {
  let component: DocanalyticsComponent;
  let fixture: ComponentFixture<DocanalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocanalyticsComponent]
    });
    fixture = TestBed.createComponent(DocanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
