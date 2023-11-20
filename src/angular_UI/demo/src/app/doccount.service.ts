import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoccountService {
  private apiUrl = 'http://localhost:8080/file/count-by-type'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  getCountByType() {
    return this.http.get(this.apiUrl);
  }
}