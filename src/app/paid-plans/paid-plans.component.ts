import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../common/service/user.service';
import { PaymentService } from '../common/service/payment.service';

@Component({
  selector: 'app-paid-plans',
  templateUrl: './paid-plans.component.html',
  styleUrls: ['./paid-plans.component.scss']
})
export class PaidPlansComponent implements OnInit {

  public planSet = {};
  public isPlanSetLoading = false;
  public paymentGatewaySet = {};
  public userPaymentData = {};
  public userSelectedPlan = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.getUserHistoryDetails();
    this.getAvailablePlans();
    this.getAvailablePaymentGateways();
  }

  //Fetch the plans avaiable
  public getAvailablePlans() {
    this.isPlanSetLoading = true;
    this.paymentService.getPlanList().subscribe(plans => {
      this.planSet = plans;
      this.isPlanSetLoading = false;
    }, error => {
      this.isPlanSetLoading = false;
    })
  }

  //Fetch the avaiable payment Gateways
  public getAvailablePaymentGateways() {
    this.paymentService.getGatewayList().subscribe(payGateway => {
      // this.paymentGatewaySet = payGateway;
    }, error => {

    });
  }

  // User Payment History
  public getUserHistoryDetails() {
    this.paymentService.getUserPaymentHistoryList().subscribe(userHistory => {
      console.log(userHistory);
      // this.userPaymentData = userHistory;
    }, error => {

    })
  }

  // Selected Plan 
  public selectedPlan(e, planItem) {
    this.userSelectedPlan = planItem;
  }

  // Highlight user selected Plan 
  highlightSelectedPlan(pItem, area) {
    if (area === 'border') {
      // 'Card'border style
      if (this.userSelectedPlan) {
        return this.userSelectedPlan['planID'] === pItem.planID ? 'border-green-500' : 'border-blue-500';
      } else {
        return 'border-blue-500';
      }
    } else {
      // 'Choose' button style
      if (this.userSelectedPlan) {
        return this.userSelectedPlan['planID'] === pItem.planID ? 'bg-green-500' : 'bg-blue-500';
      } else {
        return 'bg-blue-500';
      }
    }
  }
}
