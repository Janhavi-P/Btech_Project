import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'http://localhost:8080/file/upload';

  constructor(private httpClient: HttpClient) {}

  uploadFileToDatabase(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.post(this.uploadUrl, formData);
  }
}
