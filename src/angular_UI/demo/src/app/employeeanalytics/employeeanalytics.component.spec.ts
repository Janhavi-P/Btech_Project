import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeanalyticsComponent } from './employeeanalytics.component';

describe('EmployeeanalyticsComponent', () => {
  let component: EmployeeanalyticsComponent;
  let fixture: ComponentFixture<EmployeeanalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeanalyticsComponent]
    });
    fixture = TestBed.createComponent(EmployeeanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
