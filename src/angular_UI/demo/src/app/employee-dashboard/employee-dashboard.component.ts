import { Component,EventEmitter, OnInit, Output} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router,NavigationExtras   } from '@angular/router';
import { FileUploadService } from '../file-upload.service';
import { LoginempService } from '../loginemp.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


interface ApiResponse {
  status: string;
  message: string;
}

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'], 
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '250px' })),
      state('out', style({ width: '50px' })),
      transition('in => out, out => in', animate('300ms ease-in-out')),
    ]),
  ],
  

})
export class EmployeeDashboardComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<boolean>();
 
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

  constructor(private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
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

  onUpload() {
    if (this.selectedFiles.length > 0) {
      // Iterate through the selectedFiles array and upload each file
      for (const file of this.selectedFiles) {
        this.uploadFile(file);
      }
    }
  }

  uploadFile(file: File) {
    this.fileUploadService.uploadFileToDatabase(file).subscribe(
      (response: any) => {
        console.log('Response:', response);

        if (response.status === 'success') {
          this.message = 'File(s) successfully uploaded';
        } else {
          this.message = 'File upload to the database failed';
        }
      },
      (error) => {
        this.message = 'File upload to the database failed ';
      }
    );
  }

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
  console.log('Menu State:', this.menuState);
}
}
