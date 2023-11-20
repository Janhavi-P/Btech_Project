import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadbuttonComponent } from './downloadbutton.component';

describe('DownloadbuttonComponent', () => {
  let component: DownloadbuttonComponent;
  let fixture: ComponentFixture<DownloadbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadbuttonComponent]
    });
    fixture = TestBed.createComponent(DownloadbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
