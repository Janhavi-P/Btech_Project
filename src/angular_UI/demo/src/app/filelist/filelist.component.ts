import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { ModuleRegistry } from '@ag-grid-community/core';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import { AgRendererComponent } from 'ag-grid-angular';
import { DownloadbuttonComponent } from '../downloadbutton/downloadbutton.component';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface FileMetadata {
  filename: string;
  timestamp: string;
  size: number | null;
  //keyId: { id: number; version_id: any }[];
  keyId: { id: number; version_id: any };
 // Version_id?: number;
}

@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.scss']
})
export class FilelistComponent implements OnInit {
  [x: string]: any;
  private gridApi!: GridApi;
  private gridOptions: GridOptions; // Define gridOptions

  rowData: FileMetadata[] = [];
  columnDefs: any[];
  params: any;
  selectedFiles: FileMetadata[] = [];
  gridColumnApi: any;
  

  constructor(private http: HttpClient, private router: Router) {
    this.columnDefs = [
      // {
      //   headerCheckboxSelection: true,
      //   checkboxSelection: true,
        
        
      // },
      { headerName: 'File Name', field: 'filename',sortable:true,filter:true,unSortIcon:true  },
      { headerName: 'Timestamp', field: 'timestamp',sortable:true,filter:true,unSortIcon:true  },
      { headerName: 'Size (bytes)', field: 'size',sortable:true,filter:true,unSortIcon:true  },
      // Nested field not needed if version_id is a direct property
      { headerName: 'Version', field: 'keyId.version_id',sortable:true,filter:true,unSortIcon:true },
      {
        headerName: 'Actions',
        sortable: false,
        filter: false,
        checkboxSelection: true,
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
  console.log('Component initialized');
  this.fetchFileList();
}

  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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

  onRowSelected(event: any) {
    console.log('onRowSelected function called');
    console.log(event.data.filename);
    if (event.node.selected) {
      this.selectedFiles.push(event.data);
    } else {
      const index = this.selectedFiles.findIndex((row) => row.filename === event.data.filename);
      
      if (index !== -1) {
        this.selectedFiles.splice(index, 1);
      }
    }
    console.log('Selected Files:', this.selectedFiles);
  }
  
  
  downloadSelectedFiles() {
    console.log(this.selectedFiles);
    if (this.selectedFiles.length === 0) {
      console.log('No files selected for download.');
      return;
    }
  
    const zip = new JSZip();
    const promises: any[] = [];
  
    this.selectedFiles.forEach((file, index) => {
      const downloadUrl = `http://localhost:8080/file/download/${file.filename}`;
      
      promises.push(
        fetch(downloadUrl)
          .then((response) => response.blob())
          .then((blob) => {
            // Access the Version_id from the keyId object
            const versionId = file.keyId?.version_id || null;
  
            // Debugging statement
            console.log('file.filename:', file.filename);
            console.log('file.keyId:', file.keyId);
            console.log('versionId:', versionId);
  
            // Check if versionId is null or undefined
            const versionSuffix = versionId != null ? `_v${versionId}` : '';
  
            // Debugging statement
            console.log('versionSuffix:', versionSuffix);
  
            // Use the versionId in the unique filename
            const fileExtension = file.filename.split('.').pop();
            const uniqueFilename = `${file.filename}${versionSuffix}.${fileExtension}`;
            zip.file(uniqueFilename, blob);
          })
          .catch((error) => {
            console.error(`Failed to fetch or add file: ${file.filename}`);
          })
      );
    });
  
    Promise.all(promises).then(() => {
      // Generate the ZIP file and trigger the download
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const zipFileName = 'selected-files.zip';
        this.triggerFileDownload(zipFileName, blob);
      });
    });
  }
  
  triggerFileDownload(filename: string, blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
  
  showPieChart() {
    // Use Angular Router or a modal library to display the pie chart component
    this.router.navigate(['/pie-chart']); // Example using Angular Router
  }
  
}
