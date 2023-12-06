// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-quickaccess',
//   templateUrl: './quickaccess.component.html',
//   styleUrls: ['./quickaccess.component.scss']
// })
// export class QuickaccessComponent {

// }
import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { NavigationExtras, Router } from '@angular/router';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { saveAs } from 'file-saver';
import { LoginempService } from '../loginemp.service';
import { FileUploadService } from '../file-upload.service';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface FileMetadata {
  filename: string;
  timestamp: string;
  size: number | null;
  keyId: { id: number; version_id: any };
}

@Component({
   selector: 'app-quickaccess',
  templateUrl: './quickaccess.component.html',
  styleUrls: ['./quickaccess.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '200px' })),
      state('out', style({ width: '50px' })),
      transition('in => out, out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class QuickaccessComponent implements OnInit {
  @Output() sideNavToggled = new EventEmitter<boolean>();
 
  menuState: string = 'out';
  showText: boolean = false; // Flag to control text visibility
  menuItems: any[] | undefined; // Define your menu items here
  loggedInUser:string='';
  private loggedInId: number | undefined;
  //selectedFiles: File[] = []; // Use an array to store multiple files
  message: string | null = null;
  profilePictureData: Uint8Array | Blob | null | undefined;
  profilePictureUrl: SafeUrl | undefined;
  private gridApi!: GridApi;
  private gridOptions: GridOptions;
  rowData: FileMetadata[] = [];
  paginationPageSize: number = 12;
  columnDefs: any[];
  params: any;
  selectedFiles: FileMetadata[] = [];
  gridColumnApi: any;
  filename: string | undefined ;
  constructor(private http: HttpClient, private router: Router, private renderer: Renderer2, private el: ElementRef,private dialog: MatDialog,private loginempService: LoginempService , private quickaccess:FileUploadService) {
  
    this.columnDefs = [
      {headerName:'Sr no.',valueGetter: 'node.rowIndex + 1', width: 140,sortable: true, filter: true, unSortIcon: true },
      { headerName: 'File Name', field: 'filename',  width: 340,sortable: true, filter: true, unSortIcon: true, cellRenderer: this.fileLinkRenderer.bind(this) },
      { headerName: 'Timestamp', field: 'timestamp', width: 340,sortable: true, filter: true, unSortIcon: true },
      { headerName: 'Size (bytes)', field: 'size', sortable: true, filter: true, unSortIcon: true },
      { headerName: 'Version', field: 'keyId.version_id', width: 140,sortable: true, filter: true, unSortIcon: true },
    ];

    this.gridOptions = {
      defaultColDef: { sortable: true, filter: true },
      onGridReady: (params) => this.onGridReady(params),
    };
  }

  ngOnInit() {
    console.log('Component initialized');
    this.loggedInId = this.loginempService.getLoggedInId();
    this.fetchFileList();
  }
  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  fetchFileList() {
    this.quickaccess.getQuickaccess(this.loggedInId).subscribe(
      (data: FileMetadata[]) => {
        this.rowData = data;
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onFirstDataRendered(params: any) {
    // Auto-size the columns to fit their content
    params.api.sizeColumnsToFit();
  }

  // Custom cell renderer for the file name column
  fileLinkRenderer(params: any) {
    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'text-decoration', 'underline');
    this.renderer.setStyle(span, 'cursor', 'pointer');
    this.renderer.setProperty(span, 'innerHTML', params.value);

    // Dynamically attach the double-click event listener
    this.renderer.listen(span, 'dblclick', (event: Event) => {
      this.openFile(event, params.data.filename);
    });

    return span;
  }

  openFile(event: any, filename: string) {
    event.stopPropagation();
  
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

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    console.log('Menu State:', this.menuState);
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
}