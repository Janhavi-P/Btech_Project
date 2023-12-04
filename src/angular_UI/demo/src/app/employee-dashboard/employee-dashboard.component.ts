import { Component,EventEmitter, OnInit, Output} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router,NavigationExtras   } from '@angular/router';
import { FileUploadService } from '../file-upload.service';
import { LoginempService } from '../loginemp.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FolderService } from '../folder.service';

interface ApiResponse {
  status: string;
  message: string;
}
interface Folder {
  name: string;
  createdTime?: string; // Make createdTime property optional
  isNew?: boolean;
  fileType: string;
  isClickable?: boolean;
 
}
interface Folderdb {
  fileType: string;
  filename: string;
  folderName: string;
  createdTime: string; // Make isNew property optional
  // Add any other properties you need for a folder
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
     trigger('shiftContainer', [
    state('in', style({ transform: 'translateX(210px)' })),
    state('out', style({ transform: 'translateX(0)' })),
    transition('in => out, out => in', animate('300ms ease-in-out')),
  ]),
  
  ],
  

})
export class EmployeeDashboardComponent implements OnInit {

  file_folder:string = "";
  searchQuery: string = '';

  folders:Folder[]=[{name:'default',fileType:'folder'}];
  newFolder: Folder = { name: '' ,fileType:'folder'};
  isInEditMode = false; // Flag to determine whether the new row is in edit mode
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Folder>(this.folders);
  @Output() sideNavToggled = new EventEmitter<boolean>();
  showFirstMatCard = true;

  menuState: string = 'out';
  showText: boolean = false; // Flag to control text visibility
  menuItems: any[] | undefined; // Define your menu items here

  //@ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger | undefined;
  loggedInUser:string='';
  private loggedInId: number | undefined ;
  selectedFiles: File[] = []; // Use an array to store multiple files
  message: string | null = null;
  profilePictureData: Uint8Array | Blob | null | undefined;
  profilePictureUrl: SafeUrl | undefined;

  constructor(private folderService: FolderService,private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer) {}
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
    if (this.loggedInId !== undefined) {
      // Call the new service method to get the folders for the logged-in employee
      this.folderService.getFoldersByEmployeeId(this.loggedInId).subscribe(
        (response: any) => {
          console.log('Folders:', response);
          // Update the folders array with the fetched data
          this.folders = response
          .filter((folder: Folderdb) => folder.fileType === 'folder' && folder.folderName === null)
          .map((folder: Folderdb) => ({
            name: folder.filename,
            fileType: folder.fileType,
            createdTime: folder.createdTime,
            folderName:folder.folderName,
            isNew: false, // Assuming all fetched folders are not new
          }));
          console.log('Filtered Folders:', this.folders);
          this.folders.sort((a, b) => {
            return new Date(b.createdTime!).getTime() - new Date(a.createdTime!).getTime();
          });
          this.folders.forEach(folder => this.setClickableStatus(folder));

          this.dataSource.data = [...this.folders];
          console.log(this.dataSource.data);
        },
        (error) => {
          console.error('Error fetching folders:', error);
        }
      );
    } else {
      console.error('Logged-in ID is undefined.');
    
    }
  }
  openFolder(folder: Folder): void {
    console.log('Open folder:', folder);
    // Add your logic to open the folder
  }

  deleteFolder(folder: Folder): void {
    console.log('Delete folder:', folder);
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
openfolder(folderName: string):void {
  //const folderName='default';
  this.router.navigate(['/openfolder',folderName]);}

  addNewFolder(): void {
    if (!this.isInEditMode) {
      // If not in edit mode, enter edit mode and add a new folder
      this.isInEditMode = true;
      this.newFolder = { name: '', isNew: true ,fileType:'folder'}; // Mark the folder as new
      this.folders.unshift(this.newFolder);  

      this.dataSource.data = [...this.folders];
    }
  }
  // completeNewFolder(folder: Folder): void {
  //   if (folder.name.trim() === '') {
  //     // Handle invalid input, show a message, etc.
  //     // For now, you can remove the folder from the array
  //     this.folders = this.folders.filter(f => f !== folder);
  //     this.dataSource.data = [...this.folders];
  //     return;
  //   }
  
  //   // Mark the folder as not new and exit edit mode
  //   this.isInEditMode = false;
  //   folder.isNew = false;
  //   this.dataSource.data = [...this.folders];
  // }
  completeNewFolder(folder: Folder): void {
   
  if (folder.name.trim() === '') {
    // Handle invalid input, show a message, etc.
    // For now, you can remove the folder from the array
    this.folders = this.folders.filter((f) => f !== folder);
    this.dataSource.data = [...this.folders];
    return;
  }

  // Update the createdTime on the frontend immediately
  folder.createdTime = new Date().toLocaleString(); // Replace with the actual timestamp format
console.log(folder.name);
  // Make an API call to create the folder
  this.folderService.createFolder({
    folderName: folder.name,
    employeeId: this.loggedInId,
   
  }).subscribe(
    (response: any) => {
      console.log('Folder created successfully:', response);
      // Update the folder with the received data, e.g., createdTime
      folder.createdTime = response.createdTime;
      folder.fileType = 'folder';
    },
    (error) => {
      console.error('Error creating folder:', error);
      // Handle the error appropriately
    }
  );

  // Mark the folder as not new and exit edit mode
  this.isInEditMode = false;
  folder.isNew = false;
 // this.dataSource.data = [...this.folders];
}
setClickableStatus(folder: Folder): void {
  folder.isClickable = true; // Set to true if the folder should be clickable
}
stopPropagation(event: Event): void {
  event.stopPropagation();
}
searchFolders(): void {
  const filteredFolders = this.folders.filter((folder) =>
    folder.name && folder.name.toLowerCase().includes(this.searchQuery.toLowerCase())
  );

  this.dataSource.data = [...filteredFolders];
}
}
