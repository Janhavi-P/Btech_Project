import { Component } from '@angular/core';

@Component({
  selector: 'app-actionrenderer',
  templateUrl: './actionrenderer.component.html',
  styleUrls: ['./actionrenderer.component.scss']
})
export class ActionrendererComponent {
params:any;
agInit(params:any):void{
  this.params=params;

}
viewProfile():void
{
  this.params.viewProfileCallback(this.params.data.employeeid);
}

}
