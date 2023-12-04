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
  selector: 'app-admin-db',
  templateUrl: './admin-db.component.html',
  styleUrls: ['./admin-db.component.scss'],
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
export class AdminDBComponent implements OnInit {
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

  constructor(private count: DoccountService,private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
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
    this.count.getCountByType().subscribe((data: any) => {
     
      this.createPieChart(data);
    });
  }
 
  createPieChart(data: any) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(data), // Use the keys as labels
        datasets: [
          {
            data: Object.values(data), // Use the values as data points
            backgroundColor: ['red', 'green', 'blue'], // Colors for the slices
          },
        ],
      },
      options: {
        
        responsive: true, // Make the chart responsive to its container
    maintainAspectRatio: false, 
      },
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
 
  onFileChanged(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target && target.files) {
      // Push all selected files into the selectedFiles array
      for (let i = 0; i < target.files.length; i++) {
        this.selectedFiles.push(target.files[i]);
      }
    }
  }

  // onUpload() {
  //   if (this.selectedFiles.length > 0) {
  //     // Iterate through the selectedFiles array and upload each file
  //     for (const file of this.selectedFiles) {
  //       this.uploadFile(file);
  //     }
  //   }
  // }

  // uploadFile(file: File) {
  //   this.fileUploadService.uploadFileToDatabase(file).subscribe(
  //     (response: any) => {
  //       console.log('Response:', response);

  //       if (response.status === 'success') {
  //         this.message = 'File(s) successfully uploaded';
  //       } else {
  //         this.message = 'File upload to the database failed';
  //       }
  //     },
  //     (error) => {
  //       this.message = 'File upload to the database failed ';
  //     }
  //   );
  // }

  navigateToFileList() {
    this.router.navigate(['/file-list']);
  }
  logout()
  {
    const navigationExtras: NavigationExtras = { skipLocationChange: true };
    this.router.navigate(['/login'], { replaceUrl: true });


  }
getLoggedInId():number | undefined
{
  return this.loggedInId;

}
navigateToEditProfile() {
  // Navigate to the EditprofileComponent and pass the loggedInId as a route parameter
  this.router.navigate(['/edit-profile', { id: this.loggedInId }]);
}
toggleMenu() {
  this.menuState = this.menuState === 'out' ? 'in' : 'out';
  this.sideNavToggled.emit(this.menuState === 'in');
  console.log('Menu State:', this.menuState);
}
triggerFileInput() {
  document.getElementById('fileInput')?.click();
}
// Add a method to toggle the flag
openfolder() {
  const folderName='default';
  this.router.navigate(['/openfolder',folderName]);}
}