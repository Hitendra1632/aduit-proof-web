import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiEndPointService {

  constructor() { }

  /*************************** Authentication - Authorization  ************************* */

  // User Login
  userLogin() {
    return environment.apiBaseURL + '/v1/auth/local/login';
  }

  // User Logout
  userLogout() {
    return environment.apiBaseURL + '/user/logout';
  }

  // User Registration
  registerUser() {
    return environment.apiBaseURL + '/v1/signup';
  }

  /***************************  Authentication - Authorization  ************************* */


  /***************************  User Information  **************************/

  // Fetch User Details
  getUserDetails() {
    return environment.apiBaseURL + '/v1/user';
  }

  // Update User Record
  updateUserData() {
    return environment.apiBaseURL + '/user';
  }

  // Get User Balance
  getUserBalance() {
    return environment.apiBaseURL + '/v1/userBalance';
  }

  /***************************  User Information  **************************/


  /***************************  Documents   ***************************/

  // Get Document List
  getDocumentList() {
    return environment.apiBaseURL + '/v1/documents';
  }

  // POST Initialise Doc Sign 
  postInitialDocSigning() {
    return environment.apiBaseURL + '/v1/document/signInit';
  }

  // Get Partial Doc Sign 
  getPartialDocSign() {
    return environment.apiBaseURL + '/v1/document/validation';
  }

  // POST Full Doc Sign 
  postFullDocSigning() {
    return environment.apiBaseURL + '/v1/document/validation';
  }

  // POST Final Doc Sign 
  postFinalDocSignature() {
    return environment.apiBaseURL + '/v1/document/signFinalize';
  }

  /**************************  Documents   ************************* */


  /*************************** Plans n Payments   **************************/

  // Get User Payment history
  getUserPaymentDetails() {
    return environment.apiBaseURL + '/v1/payments';
  }

  // Get Plans
  getPlansList() {
    return environment.apiBaseURL + '/v1/plans';
  }

  // Get PAyment Gateway
  getPaymentGateWayList() {
    return environment.apiBaseURL + '/v1/paymentGateway';
  }

  // Gateway Callback link
  postGateWayCallback() {
    return environment.apiBaseURL + '/v1/pay0k/callback';
  }

  // Gateway Status
  postGateWayStatus() {
    return environment.apiBaseURL + '/v1/pay0k/statusUpdate';
  }

  // Buy Plan 
  postBuyPlan() {
    return environment.apiBaseURL + '/v1/plan/buy';
  }

  /***************************  Plans n Payments   **************************/

}
