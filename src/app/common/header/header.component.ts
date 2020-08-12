import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  public navigateToDefaultScreen() {
    if (localStorage.getItem('currentUserDetails') || localStorage.getItem('currentUser')) {
      // User is already logged in .. send to dashboard
      this.router.navigate(['/dashboard/']);
    } else {
      // User is not logged in .. send to WElcome Screen
      this.router.navigate(['welcome']);
    }
  }

  logOut() {
    if (localStorage.getItem('currentUserDetails') || localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserDetails');
      this.router.navigate(['authentication']);
    }
  }

  welcomeScreen() {
    this.router.navigate(['welcome']);
  }
}
