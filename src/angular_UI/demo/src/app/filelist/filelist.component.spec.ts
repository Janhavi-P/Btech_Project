import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilelistComponent } from './filelist.component';

describe('FilelistComponent', () => {
  let component: FilelistComponent;
  let fixture: ComponentFixture<FilelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilelistComponent]
    });
    fixture = TestBed.createComponent(FilelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
