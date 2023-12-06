import { ChangeDetectorRef, Component,EventEmitter, OnInit, Output,ViewChild,ElementRef, HostListener,} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router,NavigationExtras   } from '@angular/router';
import { FileUploadService } from '../file-upload.service';
import { LoginempService } from '../loginemp.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FolderService } from '../folder.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';


interface ApiResponse {
  status: string;
  message: string;
}
interface Folder {
  filename: string;
  fileType: string;
  createdTime?: string; // Make createdTime property optional
  isNew?: boolean;
  isClickable?: boolean;
 
  id?: number;
  versionId?: number;
  parentFolderName?: string;
  keyId?: {
    id: number;
    version_id: number;
  };
}
@Component({
  selector: 'app-open-folder',
  templateUrl: './open-folder.component.html',
  styleUrls: ['./open-folder.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '250px' })),
      state('out', style({ width: '50px' })),
      transition('in => out, out => in', animate('300ms ease-in-out')),
    ]),
     trigger('shiftContainer', [
    state('in', style ({ transform: 'translateX(210px)' })),
    state('out', style({ transform: 'translateX(0)' })),
    transition('in => out, out => in', animate('300ms ease-in-out')),
  ]),
  
  ],
})
export class OpenFolderComponent implements OnInit {
  
  fileIcons: { [key: string]: string } = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'application/pdf':  'picture_as_pdf',
    'text/plain': 'description',
    'application/msword': 'word',
    'folder':'folder',
    'default': 'description', // Default icon
    //'text/plain': 'file_text',
  };

  searchQuery: string = '';


  folders:Folder[]=[{filename:'',fileType:'folder'}];
  newFolder: Folder = { filename: '' ,fileType:'folder'};
  isInEditMode = false; // Flag to determine whether the new row is in edit mode
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Folder>(this.folders);
  folderFiles: any[] = []; // Store the files in this array
  errorMessageVisible: boolean = false;
  filesSelected: boolean = false;
  errorMessage="please upload files first";
  folderName:string="";
  @Output() sideNavToggled = new EventEmitter<boolean>();
  showFirstMatCard = true;
  file_folder:string="";
  menuState: string = 'out';
  showText: boolean = false; // Flag to control text visibility
  menuItems: any[] | undefined; // Define your menu items here

  loggedInUser:string='';
  private loggedInId: number | undefined;
  selectedFiles: File[] = []; // Use an array to store multiple files
  message: string | null = null;
  profilePictureData: Uint8Array | Blob | null | undefined;
  profilePictureUrl: SafeUrl | undefined;

  constructor( private http: HttpClient,private cdr: ChangeDetectorRef ,private folderService: FolderService ,private fileUploadService: FileUploadService, private router: Router,private emplogin:LoginempService,private sanitizer: DomSanitizer,private route:ActivatedRoute) {}
  ngOnInit(): void {
    
    this.loggedInUser = this.emplogin.getLoggedInUser();
    this.loggedInId = this.emplogin.getLoggedInId();
    console.log("empid:",this.loggedInId);
    const profilePictureData = this.emplogin.getProfilePictureData();
   
    if (profilePictureData) {
      this.profilePictureUrl = this.createProfilePictureUrl(profilePictureData as Blob);
      
    }

this.route.params.subscribe((params) => {
  console.log('params', params['folderName']);
  this.folderName = params['folderName'];
  console.log('folderName', this.folderName);

  // Call the service method to get files in the folder
  if (this.loggedInId !== undefined) {
    // Call the service method to get files in the folder
    this.folderService.getFilesInFolder(this.loggedInId, this.folderName).subscribe(
      (response: any) => {
        console.log('Folders:', response);
        // Update the folders array with the fetched data
        this.folders = response
                .map((folder: Folder) => ({
                  
          filename: folder.filename,
          fileType: folder.fileType,
          createdTime: folder.createdTime,
          
          id: folder.keyId?.id || 0, // Default to 0 if keyId is undefined
          versionId: folder.keyId?.version_id || 0, // Default to 0 if keyId is undefined
          keyId:folder.keyId,
          isNew: false, // Assuming all fetched folders are not new
        }));
        this.folders.sort((a, b) => {
          return new Date(b.createdTime!).getTime() - new Date(a.createdTime!).getTime();
        });
        this.folders.forEach(folder => this.setClickableStatus(folder));

        this.dataSource.data = [...this.folders];
        console.log(this.dataSource.data);
      },
      (error) => {
        console.error('Error fetching files in folder:', error);
      }
    );
  } else {
    console.error('Error: loggedInId is undefined');
    // Handle the case where this.loggedInId is undefined
    // You might want to display an error message or take appropriate action
  }
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
    this.filesSelected = true;
  }

  onUpload() {
    console.log('Inside onUpload');
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please select files to upload';
      this.errorMessageVisible = true;
  
      // Hide the error message after a certain duration (e.g., 3000 milliseconds)
      setTimeout(() => {
        this.errorMessageVisible = false;
      }, 3000);
  
      return;
    }
    if (this.selectedFiles.length > 0) {
      // Iterate through the selectedFiles array and upload each file
      for (const file of this.selectedFiles) {
        this.uploadFile(file);
      }
    }
  }
  uploadFile(file: File) {
    // Check if loggedInId is defined
    if (this.loggedInId !== undefined) {
      this.file_folder = "file";
      
      // Use the non-null assertion operator (!) to tell TypeScript that loggedInId is not undefined
      this.fileUploadService.uploadFileToDatabase(file, this.loggedInId!, this.folderName).subscribe(
        (response: any) => {
          console.log('Response:', response);
  
          if (response.status === 'success') {
            this.message = 'File(s) successfully uploaded';
  
            // After successful upload, fetch the updated list of files in the folder
            this.folderService.getFilesInFolder(this.loggedInId!, this.folderName).subscribe(
              (updatedFiles) => {
                // Update the folderFiles array with the new files
                this.folders = updatedFiles
      .map((folder: Folder) => ({
        filename: folder.filename,
        fileType: folder.fileType,
        createdTime: folder.createdTime,
        // Replace with the actual timestamp format

        isNew: false, // Assuming all fetched folders are not new
      }));
      
      this.dataSource.data = [...this.folders];
                // Trigger change detection to update the view
                this.cdr.detectChanges();
              },
              (error) => {
                console.error('Error fetching files in folder after upload:', error);
              }
            );
          } else {
            this.message = 'File2 upload to the database failed';
          }
        },
        (error) => {
          this.message = 'File2 upload to the database failed ';
        }
      );
    } else {
      console.error('Error: loggedInId is undefined');
      // Handle the case where loggedInId is undefined
    }
  }
  // uploadFile(file: File) {
   
  //   // if (this.loggedInId !== undefined) {
  //   //   this.file_folder = "file",
  //   //   this.fileUploadService.uploadFileToDatabase(file, this.loggedInId,this.folderName).subscribe(
  //   //     (response: any) => {
  //   //       console.log('Response:', response);
  
  //   //       if (response.status === 'success') {
  //   //         this.message = 'File(s) successfully uploaded';
  //   //       } else {
  //   //         this.message = 'File upload to the database failed';
  //   //       }
  //   //     },
  //   //     (error) => {
  //   //       this.message = 'File upload to the database failed ';
  //   //     }
  //   //   );
  //   // } else {
  //   //   // Handle the case where this.loggedInId is undefined
  //   //   console.error('Error: loggedInId is undefined');
  //   //   // You might want to display an error message or take appropriate action
  //   // }
  
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
// openfolder() {
//   this.router.navigate(['/openfolder']);
// }
// Add this to the component class in open-folder.component.ts
getFileIcon(fileType: string): string {
  // Default to 'description' if the file type is not in the mapping
  return this.fileIcons[fileType] || this.fileIcons['default'];
}
addNewFolder(): void {
  console.log('inside complete');
  if (!this.isInEditMode) {
    console.log("inside if");
    // If not in edit mode, enter edit mode and add a new folder
    this.isInEditMode = true;
    this.newFolder = { filename: '', isNew: true ,fileType:'folder'}; // Mark the folder as new
    this.folders.unshift(this.newFolder);  
    //this.folders.push(this.newFolder);
    this.dataSource.data = [...this.folders];
  }
}


completeNewFolder(folder: Folder): void {
   console.log('inside complete');
  if (folder.filename.trim() === '') {
    
   this.folders = this.folders.filter((f) => f !== folder);

    this.dataSource.data = [...this.folders];
    return;
  }
  folder.createdTime = new Date().toLocaleString(); // Replace with the actual timestamp format

  folder.createdTime = new Date().toLocaleString(); // Replace with the actual timestamp format
//   console.log(folder.createdTime);
// console.log(folder.filename);
// console.log("parent:",this.folderName);

this.folderService.createFolder({
  folderName: folder.filename,
  employeeId: this.loggedInId,
 parentFolderName: this.folderName
}).subscribe(
  (response: any) => {
    console.log('Folder created successfully:', response);
    // Update the folder with the received data, e.g., createdTime
    folder.createdTime = response.createdTime;
    folder.fileType = 'folder';
    //this.cdr.detectChanges();
    // Add the new folder at the top of the list
   
  },
  (error) => {
    console.error('Error creating folder:', error);
    // Handle the error appropriately
  }
);

  // Mark the folder as not new and exit edit mode
  this.isInEditMode = false;
  folder.isNew = false;
  //this.dataSource.data = [...this.folders];
}
setClickableStatus(folder: Folder): void {
  folder.isClickable = true; // Set to true if the folder should be clickable
}
searchFiles(): void {
  const filteredFolders = this.folders.filter((folder) =>
    folder.filename && folder.filename.toLowerCase().includes(this.searchQuery.toLowerCase())
  );

  this.dataSource.data = [...filteredFolders];
}

downloadFile(folder: Folder) {
  console.log(folder);
  console.log(folder.filename);
  const downloadUrl = `http://localhost:8080/file/download/${folder.id}/${folder.versionId}/${folder.filename}`;
  
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = folder.filename; // Set the desired filename
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}
deleteRow(folder: Folder)
{
  const deleteUrl = `http://localhost:8080/file/delete/${folder.id}/${folder.versionId}`;

  if (folder.id !== undefined) {
    // Send a request to delete the file on the server
    this.http.delete(deleteUrl).subscribe(
      (response) => {
        console.log(response);

        // If the deletion on the server is successful, remove the folder from the MatTable
        // const index = this.folders.findIndex((f) => f.id === folder.id && f.versionId === folder.versionId);
        // if (index !== -1) {
        //   this.folders.splice(index, 1);
        //   this.dataSource.data = [...this.folders]; // Update the MatTable data
        //   this.cdr.detectChanges();
        // }
      },
      (error) => {
        const index = this.folders.findIndex((f) => f.id === folder.id && f.versionId === folder.versionId);
        if (index !== -1) {
          this.folders.splice(index, 1);
          this.dataSource.data = [...this.folders]; // Update the MatTable data
          this.cdr.detectChanges();
        }
        console.error('Error deleting file:', error);
      }
    );
  } else {
    console.error('Folder id is undefined');
  }
}
openfolder(folderName: string):void {
  //const folderName='default';
  console.log(folderName);
  this.router.navigate(['/openfolder',folderName]);}
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  
openFile( filename: string) {
  //event.stopPropagation();

  this.http.get(`http://localhost:8080/file/content/${filename}`, { responseType: 'arraybuffer' })
    .subscribe(
      (data: ArrayBuffer) => {
        try {
          const fileType = this.getFileType(data);
          //const fileExtension = filename.split('.').pop()?.toLowerCase();
          switch (fileType) {
            case 'pdf':
              this.openPdfFile(data,filename);
              break;
            case 'image/png':
              this.openImageFile(data);
              break;
              case 'image/jpeg':
              this.openImageFile(data);
              break;
              case 'text/csv':
              console.log('Detected file type:', fileType);
              this.openCsvFile(data, filename);
              break;
              case 'text':
              this.openTxtFile(data , filename);
               break;
               case'application/vnd.openxmlformats-officedocument.presentationml.presentation':
               this.openPptFile(data,filename);
               break;
               case'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
               this.openDocxFile(data,filename);
               break;
            default:
             console.log('Unsupported file type:', fileType);
              //Show a user-friendly message
             alert('Unsupported file type. Unable to open the file.');
             break;
             
          }
        } catch (error) {
          console.error('Error processing file content:', error);
          alert('An error occurred while processing the file content.');
        }
      },
      (error) => {
        console.error('Error fetching file content:', error);
        // Show a user-friendly error message
        alert('An error occurred while fetching the file content.');
      }
    );
}

private getFileType(data: ArrayBuffer): string {
  const view = new DataView(data);

  // Check for common file signatures
  if (view.getUint8(0) === 0x25 && view.getUint8(1) === 0x50 && view.getUint8(2) === 0x44 && view.getUint8(3) === 0x46) {
    return 'pdf';
  }

  if (view.getUint16(0, false) === 0xFFD8) {
    return 'image/jpeg';
  }

  // PNG file signature: 89 50 4E 47 0D 0A 1A 0A
  if (view.getUint32(0, false) === 0x89504E47 && view.getUint32(4, false) === 0x0D0A1A0A) {
    return 'image/png';
  }

 
  // PPTX file signature: 50 4B 03 04 (ZIP format)
  if (this.isPptxFile(view)) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }

  // DOCX file signature: 50 4B 03 04 (ZIP format)
  if (this.isDocxFile(view)) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
 if(this.isCsvFile(view)) {
  return 'text/csv';
 }
  // If no known file type is detected
  return 'unknown';
}


private isPptxFile(view: DataView): boolean {
  const pptxSignature = [0x50, 0x4B, 0x03, 0x04]; // PPTX file signature: 50 4B 03 04 (ZIP format)

  for (let i = 0; i < pptxSignature.length; i++) {
    if (view.getUint8(i) !== pptxSignature[i]) {
      return false;
    }
  }

  return true;
}

private isDocxFile(view: DataView): boolean {
  const docxSignature = [0x50, 0x4B, 0x03, 0x04]; // DOCX file signature: 50 4B 03 04 (ZIP format)

  for (let i = 0; i < docxSignature.length; i++) {
    if (view.getUint8(i) !== docxSignature[i]) {
      return false;
    }
  }

  return true;
}
private isCsvFile(view: DataView): boolean {
  const utf8Decoder = new TextDecoder('utf-8');
  const text = utf8Decoder.decode(view);

  // Split the content into lines
  const lines = text.split(/\r?\n/);

  // Check if the content resembles a CSV file
  // For example, you might check if the file has a header and comma-separated values
  if (lines.length > 1) {
    const header = lines[0].split(',');
    const sampleRow = lines[1].split(',');

    // Add more specific checks based on your CSV file characteristics
    // For example, check if the header and sample row have expected lengths

    return true; // Change this based on your actual logic
  }

  return false;
}

private openPdfFile(data: ArrayBuffer, filename: string) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  // Open a new window with the PDF file
  const newWindow = window.open(url, '_blank');

  if (newWindow) {
    // Release the URL when the window is closed
    newWindow.addEventListener('beforeunload', () => {
      URL.revokeObjectURL(url);
    });
  } else {
    console.error('Failed to open PDF. Please check your popup settings or try a different browser.');
  }
}

private openImageFile(data: ArrayBuffer) {
  const blob = new Blob([data], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

private openDocxFile(data: ArrayBuffer, filename: string) {
const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
// Save the DOCX file using FileSaver.js
saveAs(blob, filename);
}
private openPptFile(data: ArrayBuffer, filename: string) {
const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
saveAs(blob, filename);
}

private openCsvFile(data: ArrayBuffer, filename: string) {
const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

// Save the CSV file using FileSaver.js
saveAs(blob, filename);
}

private openTxtFile(data: ArrayBuffer, filename: string) {
const blob = new Blob([data], { type: 'text/plain;charset=utf-8;' });

// Save the TXT file using FileSaver.js
saveAs(blob, filename);
}
}

