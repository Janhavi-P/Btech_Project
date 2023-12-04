import { Component } from '@angular/core';
import { Employee } from '../employee';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateAccService } from '../create-acc.service';
import { Router } from '@angular/router';
import { FolderService } from '../folder.service';
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
constructor(private createAccountService:CreateAccService,private snackBar: MatSnackBar,private router: Router,private createFolderService:FolderService){}
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
      console.log("data",data);
      this.accountCreated = true;
      this.accountAlreadyExists = false;
      this.otherError = false;
      this.openSnackBar('Account created successfully!', 'Close');

      const folderData = { folderName: 'default', employeeId: data.employeeid };
      this.createFolderService.createFolder(folderData).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error creating default folder:', error);
          // Handle error in creating default folder
        }
      );
    },
      (error) => {
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
