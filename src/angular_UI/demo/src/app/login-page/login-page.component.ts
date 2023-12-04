import { Component } from '@angular/core';
import { Employee } from '../employee';
import { LoginComponent } from '../login/login.component';
import { LoginempService } from '../loginemp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';
import { LogindialogComponent } from '../logindialog/logindialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate('1s ease-in-out')
      ])
    ])
  ]
})

export class LoginPageComponent {
  emailId: string = '';
  password: string = '';
  bg_image:string='/src/angular_UI/demo/src/assets/login_bg.jpg';
  userRole: string | undefined;

  // employee:Employee=new Employee();
  constructor(private emplogin:LoginempService,private snackBar: MatSnackBar,private dialog: MatDialog,private route: ActivatedRoute,private router: Router){
    
  }
    employeeLogin()
  {
      console.log("username:"+this.emailId);
      console.log("Password:"+this.password);
      this.emplogin.login(this.emailId, this.password).subscribe(
        (data: any) => {
          if (data.message === 'Login Successful') {
            this.emplogin.setLoggedInUser(data.Name);
            //this.emplogin.setLoggedInId(data.Employee_Id);
           // console.log("id:",data.Employee_Id);
            console.log(data.Name);
            // Only show "Login Successful" if the server response indicates success
            if (data.role === 'Admin') {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/employee-dashboard']);
            }
            this.openSnackBar('Successfully logged in!!', 'Close');
          } else {
            this.openSnackBar('Login failed!!', 'Close');
          }
          
        },
        (error: any) => {
          console.log("Error:", error);
          this.openSnackBar('Login failed!!', 'Close');
        }
      );
  }
  
 
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
     // verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
 
  
}
