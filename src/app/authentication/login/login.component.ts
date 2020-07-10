import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../login-form.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/common/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public signInForm = new LoginForm('abc@example.com', '1111');
  public loginStatus =  {
    message : null,
    status : null
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {

  }


  // Login Action
  onLogin(form: NgForm) {
    if (!form.submitted || !form.valid) {
      return;
    }

    this.authService.authenticateUserLogin(this.signInForm)
      .subscribe(response => {
        this.loginStatus= {
          message : null,
          status : null,
         }
        console.log('Login Successfull', response);
        console.log(this.loginStatus);
        setTimeout(() => {
          this.router.navigate(['/dashboard/']); 
        },2000);
      },
       error => {
         this.loginStatus= {
          message : error.message,
          status : error.status,
         }
        console.log('Login Error', error.message);
      });
  }

  // Reset Action
  newLoginForm() {
    this.loginStatus= {
      message : null,
      status : null,
    };
    this.signInForm = new LoginForm('abc@example.com', '1111');
  }
}
