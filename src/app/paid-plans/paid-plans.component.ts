import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../common/service/user.service';

@Component({
  selector: 'app-paid-plans',
  templateUrl: './paid-plans.component.html',
  styleUrls: ['./paid-plans.component.scss']
})
export class PaidPlansComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    //this.getUserDetails();
  }

  public getUserDetails(){
    this.userService.getUserDetails({}).subscribe(userResult => {
          console.log(userResult);
        })
  }
}
