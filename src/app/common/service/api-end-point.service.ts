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
    return environment.apiBaseURL + '/auth/local/login';
  }

  // User Logout
  userLogout() {
    return environment.apiBaseURL + '/user/logout';
  }

  // User Registration
  registerUser() {
    return environment.apiBaseURL + '/signup';
  }

  /***************************  Authentication - Authorization  ************************* */


  /***************************  User Information  **************************/

  // Fetch User Details
  getUserDetails() {
    return environment.apiBaseURL + '/user';
  }

  // Update User Record
  updateUserData() {
    return environment.apiBaseURL + '/user';
  }

  // Get User Balance
  getUserBalance() {
    return environment.apiBaseURL + '/userBalance';
  }

  /***************************  User Information  **************************/


  /***************************  Documents   ***************************/

  // Get Document List
  getDocumentList() {
    return environment.apiBaseURL + '/documents';
  }

  // POST Initialise Doc Sign
  postInitialDocSigning() {
    return environment.apiBaseURL + '/document/signInit';
  }

  // Get Partial Doc Sign
  getPartialDocSign() {
    return environment.apiBaseURL + '/document/validation';
  }

  // POST Full Doc Sign
  postFullDocSigning() {
    return environment.apiBaseURL + '/document/validation';
  }

  // POST Final Doc Sign
  postFinalDocSignature() {
    return environment.apiBaseURL + '/document/signFinalize';
  }

  /**************************  Documents   ************************* */


  /*************************** Plans n Payments   **************************/

  // Get User Payment history
  getUserPaymentDetails() {
    return environment.apiBaseURL + '/payments';
  }

  // Get Plans
  getPlansList() {
    return environment.apiBaseURL + '/plans';
  }

  // Get PAyment Gateway
  getPaymentGateWayList() {
    return environment.apiBaseURL + '/paymentGateway';
  }

  // Gateway Callback link
  postGateWayCallback() {
    return environment.apiBaseURL + '/pay0k/callback';
  }

  // Gateway Status
  postGateWayStatus() {
    return environment.apiBaseURL + '/pay0k/statusUpdate';
  }

  // Buy Plan
  postBuyPlan() {
    return environment.apiBaseURL + '/plan/buy';
  }

  /***************************  Plans n Payments   **************************/

}
