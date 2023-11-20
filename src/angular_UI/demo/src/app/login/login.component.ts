import { Component } from '@angular/core';
import { Employee } from '../employee';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateAccService } from '../create-acc.service';
import { Router } from '@angular/router';
// import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
employee:Employee=new Employee();
accountCreated:boolean = false;
accountAlreadyExists: boolean = false; // Add this line
otherError = false;
constructor(private createAccountService:CreateAccService,private snackBar: MatSnackBar,private router: Router){}
ngOninit():void{}


// employeeRegister()
// {
//   console.log(this.employee);
//   this.createAccountService.createAccount(this.employee).subscribe(data=>{
//     this.accountCreated = true;
//     alert("Account created succesfully!");

//   },error=>alert("Account not created succesfully!"));
// }
employeeRegister() {
  this.createAccountService.createAccount(this.employee).subscribe(
    (data: any) => {
      this.accountCreated = true;
      this.accountAlreadyExists = false;
      this.otherError = false;
      this.openSnackBar('Account created successfully!', 'Close');
      this.router.navigate(['/login']);
      },(error) => {
        if (error.status === 409) {
          this.accountCreated = false;
          this.accountAlreadyExists = true;
          this.otherError = false;
          this.openSnackBar('Account already exists!', 'Close');
        } else {
          this.accountCreated = false;
          this.accountAlreadyExists = false;
          this.otherError = true;
          this.openSnackBar('Error in creating account! Try again later.', 'Close');
        }}
  );
}
onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  this.employee.profilePicture = file;
}
openSnackBar(message: string, action: string): void {
  this.snackBar.open(message, action, {
    duration: 3000,
  });
}
// openDialog(): void {
//   const dialogRef = this.dialog.open(DialogComponent);
//   dialogRef.afterClosed().subscribe(result => {
//      You can handle any action after the dialog is closed
//   });
// }


}
