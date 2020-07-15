import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../login-form.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/common/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '../../common/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  public signInForm = new LoginForm('sachin10@yahoooo.com', '12345678');
  public loginStatus = {
    message: null,
    hasError: false,
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Login Action
  onLogin(form: NgForm) {
    this.loginStatus = {
      message: null,
      hasError: false,
    };

    if (!form.submitted || !form.valid) {
      this.loginStatus = {
        message: 'Invalid Action',
        hasError: true,
      };
      return;
    }
    // https://itnext.io/angular-8-how-to-use-cookies-14ab3f2e93fc
    this.authService.authenticateUserLogin(this.signInForm)
      .subscribe((response: HttpResponse<any>) => {
        this.loginStatus = {
          message: 'Login Successfull.',
          hasError: false,
        };
        console.log(response.headers,'>>> ', response.headers.get('X-Token'));
        console.log('>>> ', response.headers.keys());

        console.log(document.cookie);
        // this.userService.getUserDetails({}).subscribe(userResult => {
        //   console.log(userResult);
        // })
       this.router.navigate(['/plans/']);
      },
        error => {
          this.loginStatus = {
            message: (error.error.error) ? error.error.error : 'Something went wrong.',
            hasError: true,
          }
        });
  }

  // Reset Action
  newLoginForm() {
    this.loginStatus = {
      message: null,
      hasError: false,
    };
    this.signInForm = new LoginForm('sachin10@yahoooo.com', '12345678');
  }
}
