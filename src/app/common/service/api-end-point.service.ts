import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiEndPointService {

  constructor() { }

  
  // User Login
  userLogin(){
    return environment.apiBaseURL + '/v1/auth/local/login'
  }

   // User Logout
   userLogout(){
    return environment.apiBaseURL + '/user/logout'
  }

  // User Registration
  registerUser(){
    return environment.apiBaseURL + '/v1/signup'
  }

  // Fetch User Details
  getUserDetails(){
    return environment.apiBaseURL + '/v1/user'
  }

  // Update User Record
  updateUserData(){
    return environment.apiBaseURL + '/user'
  }

  // Get User Balance
  getUserBalance(){
    return environment.apiBaseURL + '/v1/userBalance'
  }

}
