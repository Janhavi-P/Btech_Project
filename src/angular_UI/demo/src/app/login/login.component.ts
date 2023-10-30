import { Component } from '@angular/core';
import { Employee } from '../employee';
import { CreateAccService } from '../create-acc.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
employee:Employee=new Employee();

constructor(private createAccountService:CreateAccService)
{

}

ngOninit():void{

}

employeeRegister()
{
  console.log(this.employee);
  this.createAccountService.createAccount(this.employee).subscribe(data=>{
    alert("Account created succesfully!");

  },error=>alert("Account not created succesfully!"));
}
}
