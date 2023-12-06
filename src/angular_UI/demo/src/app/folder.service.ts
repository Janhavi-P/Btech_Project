import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FolderService {
private baseUrl='http://localhost:8080/api/folder';
  constructor(private httpClient:HttpClient) { }


  getFoldersByEmployeeId(employeeId:number):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/employeefolders/${employeeId}`);
  }
  createFolder(folderData: any): Observable<any> {
    // Adjust the API endpoint and HTTP method as needed
    console.log(folderData);
    return this.httpClient.post<any>(`${this.baseUrl}/createfolder`, {
      folderName: folderData.folderName,
      employeeId: folderData.employeeId,
      parentFolderName: folderData.parentFolderName || null // Use null if parentFolderName is not provided
      
    });
  }
  getFilesInFolder(employeeId:number,folderName:string):Observable<any>
  {
    return this.httpClient.get(`${this.baseUrl}/files/${employeeId}/${folderName}`)
  }
}
