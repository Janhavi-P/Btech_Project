import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuserdialogComponent } from './viewuserdialog.component';

describe('ViewuserdialogComponent', () => {
  let component: ViewuserdialogComponent;
  let fixture: ComponentFixture<ViewuserdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewuserdialogComponent]
    });
    fixture = TestBed.createComponent(ViewuserdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
