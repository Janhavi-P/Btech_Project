import { Component,OnInit, ViewChild,ElementRef } from '@angular/core';
import { EditserviceService } from '../editservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateAccService } from '../create-acc.service';
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {
  @ViewChild('profilePicInput') profilePicInput: ElementRef | undefined;
  //employee:Employee=new Employee();
  employee: Employee = {
    name: '',
    emailId: '',
    role:'',
    position: '',
    department: '',
    contact_no: '',
    password: '',
    employeeid: undefined ,
    profilePicture: undefined,
    profilePictureName:'',
    // Initialize other fields with default or empty values
  };
  empdetails:any;
  constructor(private editprofService:EditserviceService,private route: ActivatedRoute,private snackBar: MatSnackBar,private router: Router,private editEmp:CreateAccService)
  {

  }
  ngOnInit(){
    const loggedInIdString = this.route.snapshot.paramMap.get('id');

    // Convert it to a number using type assertion (as you should ensure it's a valid number)
    const loggedInId = loggedInIdString as unknown as number;
  this.employee.employeeid=loggedInId;
    // Check if loggedInId is a valid number (not null)
    if (loggedInId !== null) {
      // Now you can use loggedInId as a number
      this.editprofService.getUserProfileById(loggedInId).subscribe((data) => {
        this.empdetails = data;
        console.log(this.empdetails);
      });
    } else {
      // Handle the case where loggedInId is null (or not a valid number)
    }
    this.editprofService.getUserProfileById(loggedInId).subscribe((data) => {
      this.empdetails = data;
    
      // Set the values of the employee object based on the received data
      this.employee.name = this.empdetails.name;
      this.employee.emailId = this.empdetails.emailId;
     // this.employee.password = this.empdetails.password;
      this.employee.position = this.empdetails.position;
      this.employee.department = this.empdetails.department;
      this.employee.role = this.empdetails.role;
      this.employee.contact_no = this.empdetails.contact_no;
      this.employee.profilePicture = this.empdetails.profilePicture;
    
      this.employee.profilePictureName = this.empdetails.profilePictureName; // Filename or identifier
      console.log(this.empdetails.profilePicture.name);
      

      // Set other fields in the same way
      if (this.employee.profilePicture && this.employee.profilePicture.name && this.profilePicInput) {
        const file = new File([this.employee.profilePicture], this.employee.profilePicture.name);
        console.log(this.employee.profilePicture.name);
        const fileList = new DataTransfer();
        fileList.items.add(file);
      
        this.profilePicInput.nativeElement.files = fileList.files;
      }
      console.log(this.empdetails);
    });
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.employee.profilePicture = file;
  }
editProfile()
{
  console.log("inside fucnt");
  console.log(this.employee.employeeid);
  if (this.employee.employeeid !== undefined) {
    console.log("inside if");
    this.editEmp.editProfile(this.employee.employeeid, this.employee).subscribe(
      (editedProfile) => {
        // Handle the success case, e.g., show a success message
        console.log("edit successful");
      },
      (error) => {
        console.log("edit failed");
        // Handle the error case, e.g., show an error message
      }
    );
  } else {
    console.log("edit failed");
    // Handle the case where employeeid is undefined
  }
}
goBack()
{
  this.router.navigate(['/goback']);
}
}
