import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  public navigateToLoginScreen() {
    this.router.navigate(['authentication']);
  }

}
