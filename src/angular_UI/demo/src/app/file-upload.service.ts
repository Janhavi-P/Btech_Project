import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface FileMetadata {
  filename: string;
  timestamp: string;
  size: number | null;
  keyId: { id: number; version_id: any };
}
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'http://localhost:8080/file/upload';
  private baseurl = 'http://localhost:8080/file/';
  constructor(private httpClient: HttpClient) {}

  uploadFileToDatabase(file: File,employeeId: number,folderName: string) {
    const formData: FormData = new FormData();
    formData.append('file', file);
   formData.append('employeeid',employeeId.toString());
   formData.append('folderName', folderName);
  //  formData.append('file_folder',file_folder);
     console.log(file); 
    return this.httpClient.post(this.uploadUrl, formData);
  }

  
  getQuickaccess(employeeId: number | undefined): Observable<FileMetadata[]> {
    const url = `${this.baseurl}quickaccess/${employeeId}`;
    return this.httpClient.get<FileMetadata[]>(url);
  }
  getCountDocTypeEmp(employeeId: number): Observable<any> {
    const url = `${this.baseurl}file-count-by-type/${employeeId}`;
    return this.httpClient.get(url);

    
}
deleteFile(id: number, versionId: number): Observable<any> {
  const deleteUrl = `${this.baseurl}/delete/${id}/${versionId}`;
  return this.httpClient.delete(deleteUrl);
}
getFileDataByDate(employeeId: number): Observable<any> {
  const url = `${this.baseurl}file-count-by-date/${employeeId}`;
  return this.httpClient.get(url);
}
getMemory():Observable<any> {
  const url = `${this.baseurl}total-memory-used`;
  return this.httpClient.get(url);
}
}
