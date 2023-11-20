import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent, GridOptions, ModuleRegistry } from 'ag-grid-community';
//import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import { AgRendererComponent } from 'ag-grid-angular';
import { DownloadbuttonComponent } from '../downloadbutton/downloadbutton.component';

//ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface FileMetadata {
  filename: string;
  timestamp: string;
  size: number | null;
  keyId: { id: number; version_id: number }[];
}
@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss']
})
export class FilelistComponent implements OnInit {
  private gridApi!: GridApi;
  private gridOptions: GridOptions; // Define gridOptions

  rowData: FileMetadata[] = [];
  columnDefs: any[];
  params: any;
  selectedFiles: FileMetadata[] = [];
  

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        // Add a custom checkbox for individual row selection
    
        checkboxSelectionFilteredOnly: true,
      },
      { headerName: 'File Name', field: 'filename',sortable:true,filter:true,unSortIcon:true  },
      { headerName: 'Timestamp', field: 'timestamp',sortable:true,filter:true,unSortIcon:true  },
      { headerName: 'Size (bytes)', field: 'size',sortable:true,filter:true,unSortIcon:true  },
      // Nested field not needed if version_id is a direct property
      { headerName: 'Version', field: 'keyId.version_id',sortable:true,filter:true,unSortIcon:true },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        cellRenderer: DownloadbuttonComponent,
        cellRendererParams: { onDownloadClick: this.onDownloadClick.bind(this) } // Pass the download function to the renderer
      },
      
    ];
    
    // Initialize gridOptions
    this.gridOptions = {
      defaultColDef: { sortable: true, filter: true },
      onGridReady: (params) => this.onGridReady(params),
    };
  }

  ngOnInit() {
    this.fetchFileList();
  }
 
  
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  fetchFileList() {
    this.http.get<FileMetadata[]>('http://localhost:8080/file/getall').subscribe(
      (data) => {
        this.rowData = data;
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  onCheckboxChange(file: FileMetadata, event: any) {
    if (event.target.checked) {
      // Add the file to the selectedFiles list
      this.selectedFiles.push(file);
    } else {
      // Remove the file from the selectedFiles list
      this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
    }
    console.log('Selected Files:', this.selectedFiles);
  }
  
  downloadSelectedFiles() {
    console.log('Download Selected Files Clicked');
    for (const file of this.selectedFiles) {
      this.onDownloadClick(file.filename);
    }
  }
  
  onDownloadClick(filename: string) {
    const downloadUrl = `http://localhost:8080/file/download/${filename}`;
  
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }
  
  
  
}

