import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';

import { HttpClient } from '@angular/common/http';
import { ActionrendererComponent } from '../actionrenderer/actionrenderer.component';
import { DeleteusersComponent } from '../deleteusers/deleteusers.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewuserdialogComponent } from '../viewuserdialog/viewuserdialog.component';


import { Component,EventEmitter, OnInit, Output} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router,NavigationExtras   } from '@angular/router';
import { FileUploadService } from '../file-upload.service';
import { LoginempService } from '../loginemp.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Chart, ChartDataset } from 'chart.js/auto';
import { DoccountService } from '../doccount.service';
@Component({
  selector: 'app-getusers',
  templateUrl: './getusers.component.html',
  styleUrls: ['./getusers.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '250px' })),
      state('out', style({ width: '50px' })),
      transition('in => out, out => in', animate('300ms ease-in-out')),
    ]),
     trigger('shiftContainer', [
    state('in', style({ transform: 'translateX(210px)' })),
    state('out', style({ transform: 'translateX(0)' })),
    transition('in => out, out => in', animate('300ms ease-in-out')),
  ]),
  
  ],
})
export class GetusersComponent implements OnInit {
 
  emailId: string = '';
  password: string = '';

  userRole: string | undefined;

  chartData: ChartDataset[] = [];

  @Output() sideNavToggled = new EventEmitter<boolean>();
  showFirstMatCard = true;

  menuState: string = 'out';
  showText: boolean = false; // Flag to control text visibility
  menuItems: any[] | undefined; // Define your menu items here

  //@ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger | undefined;
  loggedInUser:string='';
  private loggedInId: number | undefined;
  selectedFiles: File[] = []; // Use an array to store multiple files
  message: string | null = null;
  profilePictureData: Uint8Array | Blob | null | undefined;
  profilePictureUrl: SafeUrl | undefined;

  rowData: any;
 // Inject MatDialog
  paginationPageSize: number = 12; // Set your default page size here
  frameworkComponents: any = { // Define the frameworkComponents here
    actionsRenderer: ActionrendererComponent}
  constructor(private loginService:LoginempService,private http:HttpClient,private dialog: MatDialog,private count: DoccountService,private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer){

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
  logout()
  {
    const navigationExtras: NavigationExtras = { skipLocationChange: true };
    this.router.navigate(['/login'], { replaceUrl: true });


  }
  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.sideNavToggled.emit(this.menuState === 'in');
    console.log('Menu State:', this.menuState);
  }
  getLoggedInId():number | undefined
{
  return this.loggedInId;

}
navigateToEditProfile() {
  // Navigate to the EditprofileComponent and pass the loggedInId as a route parameter
  this.router.navigate(['/edit-profile', { id: this.loggedInId }]);
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
  private createProfilePictureUrl(data: Blob | null): SafeUrl {
    // console.log("profilepicurl",data);
    // console.log("profilepicurl",typeof data);
    if (data instanceof Blob) {
      // The data is already a Blob, proceed as usual
      const blobUrl = URL.createObjectURL(data);
      return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    } else if (typeof data === 'string') {
     // console.log("inside string");
      // Convert the base64-encoded string to a Blob
      const binaryData = atob(data);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
  
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Adjust the type if necessary
      const blobUrl = URL.createObjectURL(blob);
      return this.sanitizer.bypassSecurityTrustUrl(blobUrl);
    }
    return '';
  }
       ngOnInit(): void {
      this.loginService.getAllEmployees().subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    });
    this.userRole = this.emplogin.getLoggedInUserRole();
    // Retrieve the user's name from the service
    this.loggedInUser = this.emplogin.getLoggedInUser();
    this.loggedInId = this.emplogin.getLoggedInId();
    console.log("empid:",this.loggedInId);
    const profilePictureData = this.emplogin.getProfilePictureData();
    //console.log("profilepicdata",profilePictureData);
    if (profilePictureData) {
      this.profilePictureUrl = this.createProfilePictureUrl(profilePictureData as Blob);
            //console.log("profilepicurl",this.profilePictureUrl);
            

    }
    
  }
}
