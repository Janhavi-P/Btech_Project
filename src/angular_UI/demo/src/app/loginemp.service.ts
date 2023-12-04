import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, pipe} from 'rxjs';

import { Employee } from './employee';
@Injectable({
  providedIn: 'root'
})
export class LoginempService {
  private loggedInUser:string='';
  private userRole: string | undefined;

  private loggedInId: number | undefined;
  private profilePictureData: Uint8Array | Blob | null = null; 
  baseUrl = 'http://localhost:8080/api';  
  getUsersUrl='http://localhost:8080/api/getusers';
  constructor(private httpClient:HttpClient ) { }

  setLoggedInUser(username:string)
  {
    this.loggedInUser=username;
  }
  getLoggedInUser()
  {
    return this.loggedInUser;
  }
  // setLoggedInId(userid:number)
  // {
  //   this.loggedInId=userid;
  // }
  getLoggedInId()
  {console.log("empid: " + this.loggedInId);
    return this.loggedInId;
  }

  getProfilePictureData(): Uint8Array | Blob | null {
    console.log("from service",this.profilePictureData);
    return this.profilePictureData;
  }
  getLoggedInUserRole() {
    return this.userRole;
  }

  login(username: string, password: string):Observable<any> {
  {
    const credentials = { username, password };
    const url = `${this.baseUrl}/login`; 
    return this.httpClient.post(url, credentials).pipe(
      map((response: any) => {
        if (response.message === 'Login Successful') {
          this.loggedInUser = response.Name;
          this.profilePictureData = response.ProfilePic; // Store the profile picture data
          this.loggedInId=response.EmployeeId;
          this.userRole = response.role;
         console.log('role:',this.userRole);
        }
        return response;
      })
    );
  }
} 
getAllEmployees():Observable<any[]>
  {
    const url = `${this.baseUrl}/employees/getusers`; 
    return this.httpClient.get<any[]>(url);
  }
}
