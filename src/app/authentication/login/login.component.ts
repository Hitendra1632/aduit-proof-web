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
  public signInForm = new LoginForm('', '');
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

  getUserDetails(token){
    debugger;
    this.userService.getUserDetails(token).subscribe(userResult => {
      if (userResult.paymentStatus) {
        // If Payment is Done... send user to dashboard
        this.router.navigate(['/dashboard/']);
      } else {
        // Send user to selecting Plan
        this.router.navigate(['/plans/']);
      }
    });
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // Login Action
  onLogin(form: NgForm) {
    const bypassAPI = false;
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

    this.authService.authenticateUserLogin(this.signInForm)
      .subscribe((response: HttpResponse<any>) => {
          this.loginStatus = {
            message: 'Login Successful.',
            hasError: false,
          };
          const token  = this.getCookie('XSRF-TOKEN');
          this.getUserDetails(token);
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
    this.signInForm = new LoginForm('', '');
  }

  public navigateToHomeScreen() {
    this.router.navigate(['welcome']);
  }
}
