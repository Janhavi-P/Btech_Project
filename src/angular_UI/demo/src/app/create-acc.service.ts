import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from './employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateAccService {
baseUrl = 'http://localhost:8080/api/employees/add';
  constructor(private httpClient: HttpClient) {
    
   }

  createAccount(employee:Employee):Observable<Object> {
  {
    console.log(employee.emailId);
    return this.httpClient.post(`${this.baseUrl}`,employee);
  }
}
}