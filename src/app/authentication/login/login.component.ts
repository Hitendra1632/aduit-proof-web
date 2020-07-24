import { Component, OnInit } from '@angular/core';
import { LoginForm } from '../login-form.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../common/service/auth.service';
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
  public signInForm = new LoginForm('test@example.com', '12345678');
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
    const bypassAPI = true;
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

    if (bypassAPI) {
      this.userService.getUserDetails().subscribe(userResult => {
        if (localStorage.getItem('currentUserDetails')) {
          const userData = JSON.parse(localStorage.getItem('currentUserDetails'));
          if (userData.paymentStatus) {
            // If Payment is Done... send user to dashboard
            this.router.navigate(['/dashboard/']);
          } else {
            // Send user to selecting Plan
            this.router.navigate(['/plans/']);
          }
        }
      });
    } else {
      // https://itnext.io/angular-8-how-to-use-cookies-14ab3f2e93fc
      this.authService.authenticateUserLogin(this.signInForm)
        .subscribe((response: HttpResponse<any>) => {
          this.loginStatus = {
            message: 'Login Successfull.',
            hasError: false,
          };
          this.userService.getUserDetails().subscribe(userResult => {
            console.log(userResult);
          });
          this.router.navigate(['/plans/']);
        },
          error => {
            this.loginStatus = {
              message: (error.error.error) ? error.error.error : 'Something went wrong.',
              hasError: true,
            }
          });
    }

  }
  // Reset Action
  newLoginForm() {
    this.loginStatus = {
      message: null,
      hasError: false,
    };
    this.signInForm = new LoginForm('test@example.com', '12345678');
  }
}
