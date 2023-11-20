import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-viewuserdialog',
  templateUrl: './viewuserdialog.component.html',
  styleUrls: ['./viewuserdialog.component.scss']
})
export class ViewuserdialogComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data:any){}
}
