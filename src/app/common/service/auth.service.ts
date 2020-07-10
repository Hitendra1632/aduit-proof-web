import { Injectable } from '@angular/core';
import { ApiEndPointService } from './api-end-point.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginForm } from 'src/app/authentication/login-form.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,

  ) { }

  // Authenticate User Login
  public authenticateUserLogin(userCredentials:LoginForm){
    const httpHeaders = new HttpHeaders()
      .set('Content-Type','application/json');
    
    const httpOptions = {
      headers: httpHeaders
    };

    return this.http.post(this.apiEndPointService.userLogin(),userCredentials,httpOptions)
      .pipe(tap ((response)  => { }));
  }

   // Authenticate User Login
   public registerUser(userData, signImg, documentFile): Observable<any>{
    const formData:FormData = new FormData();
    
    const httpHeaders = new HttpHeaders()
      .set('Content-Type','application/json');
    
    const httpOptions = {
      headers: httpHeaders
    };
    formData.append('sigImage', signImg);
    formData.append('kycDocuments', documentFile);

    Object.keys(userData).forEach(key=>{
      if(key !== 'confirmPassword' && key !== 'acceptTerms'){
        const val = userData[key];
        formData.append(key,  userData[key]);
      }
    });

    return this.http.post(this.apiEndPointService.registerUser(),formData,httpOptions)
      .pipe(tap ((response)  => { }));
  }

}
