import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionrendererComponent } from './actionrenderer.component';

describe('ActionrendererComponent', () => {
  let component: ActionrendererComponent;
  let fixture: ComponentFixture<ActionrendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionrendererComponent]
    });
    fixture = TestBed.createComponent(ActionrendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
