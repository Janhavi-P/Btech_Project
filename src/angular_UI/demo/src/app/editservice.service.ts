import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditserviceService {
  private baseUrl ='http://localhost:8080/api/employees/get';

  constructor(private httpClient:HttpClient) { 
   
}
getUserProfileById(empId:number)
{
  const url=`${this.baseUrl}/${empId}`;
  return this.httpClient.get(url);
}
}
