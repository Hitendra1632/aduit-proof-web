import { Injectable } from '@angular/core';
import { ApiEndPointService } from './api-end-point.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,
  ) { }

  // Get Plans List
  public getPlanList() {
    const httpHeaders = new HttpHeaders();
    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };
    return this.http.get(this.apiEndPointService.getPlansList(), httpOptions)
      .pipe(map((plan) => {
        return plan.body;
      }));
  }

  // Get Payment Gateway List
  public getGatewayList() {
    const httpHeaders = new HttpHeaders();
    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };
    return this.http.get(this.apiEndPointService.getPaymentGateWayList(), httpOptions)
      .pipe(map((payment) => {
        return payment.body;
      }));
  }

  
  // Get User Payment History 
  public getUserPaymentHistoryList() {
    const httpHeaders = new HttpHeaders();
    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };
    return this.http.get(this.apiEndPointService.getUserPaymentDetails(), httpOptions)
      .pipe(map((payHistory) => {
        return payHistory.body;
      }));
  }
}
