import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindocanalysisComponent } from './admindocanalysis.component';

describe('AdmindocanalysisComponent', () => {
  let component: AdmindocanalysisComponent;
  let fixture: ComponentFixture<AdmindocanalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmindocanalysisComponent]
    });
    fixture = TestBed.createComponent(AdmindocanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
