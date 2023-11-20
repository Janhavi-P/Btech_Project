import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteusersComponent } from './deleteusers.component';

describe('DeleteusersComponent', () => {
  let component: DeleteusersComponent;
  let fixture: ComponentFixture<DeleteusersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteusersComponent]
    });
    fixture = TestBed.createComponent(DeleteusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
