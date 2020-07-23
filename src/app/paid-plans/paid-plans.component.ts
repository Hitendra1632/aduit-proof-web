import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../common/service/user.service';
import { PaymentService } from '../common/service/payment.service';
declare let pay0k: any;

@Component({
  selector: 'app-paid-plans',
  templateUrl: './paid-plans.component.html',
  styleUrls: ['./paid-plans.component.scss']
})
export class PaidPlansComponent implements OnInit {

  public planSet = {};
  public isPlanSetLoading = false;

  public paymentGatewaySet = {};
  public isGatewaysLoading = false;
  public userSelectedPaymentGateway = null;
  public userSelectedPlan = null;
  public isPaymentSubmitted = false;

  public userPaymentData = {};
  public clientID = null;
  public orderID = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private paymentService: PaymentService,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.getUserHistoryDetails();
    this.getAvailablePlans();
    this.getAvailablePaymentGateways();
    pay0k.config('https://order.pay0k.ml');

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
    this.isGatewaysLoading = true;
    this.paymentService.getGatewayList().subscribe(payGateway => {
      this.paymentGatewaySet = payGateway;
      // Select first bydefault
      this.userSelectedPaymentGateway = payGateway[0].paymentGatewayID;
      this.isGatewaysLoading = false;
    }, error => {
      this.isGatewaysLoading = false;
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

  // Selected Gateway
  public selectedGateway(pg) {
    this.userSelectedPaymentGateway = pg.paymentGatewayID;
  }

  public getPaymentParams() {
    return {
      paymentGatewayID: this.userSelectedPaymentGateway,
      planID: this.userSelectedPlan.planID
    }
  }

  //Proceed for Payment
  public planPayment() {
    this.isPaymentSubmitted = true;
    this.paymentService.purchasePlan(this.getPaymentParams()).subscribe(response => {
      if (response.status === 'success') {
        this.clientID = response.message.clientID;
        this.orderID = response.message.orderID;
      }
      this.openPay0kModal();
      this.isPaymentSubmitted = false;
      // this.router.navigate(['/dashboard/']);
    }, error => {
      this.isPaymentSubmitted = false;
    })
  }

  openPay0kModal() {
    let pay0kPromise = pay0k.showPopup(this.clientID, this.orderID);
    console.log(pay0kPromise);
    pay0kPromise.then((data) => {
      console.log("Promise resolved with: " + JSON.stringify(data));
      this.paymentService.finalPayCallback({ orderID: this.orderID }).subscribe(response => {
        console.log(response);
        if(response.status === ' success'){
          this.router.navigate(['/dashboard/']);
        } else {
          console.log(response.message);
        }
      }, error => {
        console.log(error);
      })
    }, (error) => {
      console.log("Promise rejected with " + error);
    });
  }
}
