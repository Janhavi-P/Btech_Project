import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from './employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateAccService {
baseUrl = 'http://localhost:8080/api/employees/add';
private baseUrl2='http://localhost:8080/api/employees/';
  constructor(private httpClient: HttpClient) {
    
   }

    createAccount(employee: Employee): Observable<Employee> {
    const formData = new FormData();
  
    // Append each field with the correct name
    if (employee.name) {
      formData.append('name', employee.name);
    }
    if (employee.role) {
      formData.append('role', employee.role);
    }
    if (employee.department) {
      formData.append('department', employee.department);
    }
    if (employee.emailId) {
      formData.append('emailId', employee.emailId);
    }
    if (employee.password) {
      formData.append('password', employee.password);
    }
    if (employee.employeeid) {
      formData.append('employeeid', employee.employeeid.toString());
    }
    if (employee.position) {
      formData.append('position', employee.position);
    }
    if (employee.contact_no) {
      formData.append('contact_no', employee.contact_no);
    }
    if (employee.profilePicture) {
      formData.append('profile', employee.profilePicture, employee.profilePicture.name);
    }
    
    console.log(formData);
    return this.httpClient.post<Employee>(this.baseUrl, formData);
  }

  editProfile(employeeId:number,editedProfile:Employee):Observable<Employee>{
    const url = `http://localhost:8080/api/employees/editProfile/${employeeId}`;
    return this.httpClient.put<Employee>(url, editedProfile);
  }
}