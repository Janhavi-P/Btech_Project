import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-deleteusers',
  templateUrl: './deleteusers.component.html',
  styleUrls: ['./deleteusers.component.scss']
})
export class DeleteusersComponent {
  params:any;
  agInit(params:any):void{
    this.params=params;
  
  }
  deleteUser():void
  {
    this.params.deleteUser(this.params.data.employeeid);
  }
}
