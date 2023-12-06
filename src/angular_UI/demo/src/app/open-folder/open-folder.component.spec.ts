import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFolderComponent } from './open-folder.component';

describe('OpenFolderComponent', () => {
  let component: OpenFolderComponent;
  let fixture: ComponentFixture<OpenFolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenFolderComponent]
    });
    fixture = TestBed.createComponent(OpenFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
