import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../login-form.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/common/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '../../common/service/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  public signInForm = new LoginForm('shubham@gmail.com', 'pass');
  public loginStatus = {
    message: null,
    hasError: false,
  };
  private cookieTokenValue: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Login Action
  onLogin(form: NgForm) {
    if (!form.submitted || !form.valid) {
      return;
    }
    // https://itnext.io/angular-8-how-to-use-cookies-14ab3f2e93fc
    this.authService.authenticateUserLogin(this.signInForm)
      .subscribe((response: HttpResponse<any>) => {
        this.loginStatus = {
          message: 'Login Successfull.',
          hasError: false,
        }
        // this.userService.getUserDetails({}).subscribe(userResult => {
        //   console.log(userResult);
        // })
        this.router.navigate(['/dashboard/']);
      },
        error => {
          this.loginStatus = {
            message: error.error.error,
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
    this.signInForm = new LoginForm('shubham@gmail.com', 'pass');
  }
}
