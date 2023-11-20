import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { LoginempService } from '../loginemp.service';
import { HttpClient } from '@angular/common/http';
import { ActionrendererComponent } from '../actionrenderer/actionrenderer.component';
import { DeleteusersComponent } from '../deleteusers/deleteusers.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewuserdialogComponent } from '../viewuserdialog/viewuserdialog.component';
@Component({
  selector: 'app-getusers',
  templateUrl: './getusers.component.html',
  styleUrls: ['./getusers.component.scss']
})
export class GetusersComponent implements OnInit {
 
  rowData: any;
 // Inject MatDialog
  paginationPageSize: number = 12; // Set your default page size here
  frameworkComponents: any = { // Define the frameworkComponents here
    actionsRenderer: ActionrendererComponent}
  constructor(private loginService:LoginempService,private http:HttpClient,private dialog: MatDialog){

  }
  colDefs:ColDef[]= [
    { headerName: 'Employee Id', field:'employeeid',width: 130},
    {headerName:'Name',field:'name', filter:true,unSortIcon:true,width: 135},
   // {headerName:'Position',field:'position',sortable:true,filter:true,unSortIcon:true },
    //{headerName:'Department',field:'department',sortable:true,filter:true,unSortIcon:true },
    {headerName:'Contact No.',field:'contact_no',sortable:true,filter:true,unSortIcon:true  },
    {headerName:'Email Id',field:'emailId',sortable:true,filter:true,unSortIcon:true  },
    {
      headerName: 'Actions',
      width: 200,
      field: 'actions',
      cellRenderer: ActionrendererComponent,
      cellRendererParams: {
        viewProfileCallback: (userId: any) => {
          // Find the user details based on the userId
          const userDetails = this.rowData.find((user: { employeeid: any; }) => user.employeeid === userId);

          if (userDetails) {
            this.openUserDetailsDialog(userDetails);
          }
        },
      },
    },
{headerName:'Remove user',cellRenderer:DeleteusersComponent,
cellRendererParams:{
  deleteUserCallback:this.deleteUser.bind(this)
}},
  ];

  viewProfile(userId:number)
  {
    console.log(userId);
  }
  deleteUser(userId:number){

  }
  openUserDetailsDialog(userDetails: any) {
    const dialogRef = this.dialog.open(ViewuserdialogComponent, {
      width: '400px',
      data: userDetails // Pass user details to the dialog
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
    });
  }
       ngOnInit(): void {
      this.loginService.getAllEmployees().subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    });
   
  }
}
