import { Injectable } from '@angular/core';
import { ApiEndPointService } from './api-end-point.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { LoginForm } from 'src/app/authentication/login-form.model';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,

  ) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Authenticate User Login
  public authenticateUserLogin(userCredentials: LoginForm) {
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response'
    };

    return this.http.post<any>(this.apiEndPointService.userLogin(), userCredentials, httpOptions)
      .pipe(map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return user;
      }));
    // catchError(this.handleError));
  }

  // Authenticate User Login
  public registerUser(userData, signImg, documentFile): Observable<any> {
    const formData: FormData = new FormData();

    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders
    };
    formData.append('sigImage', signImg);

    for (var i = 0; i < documentFile.length; i++) {
      formData.append('kycDocuments', documentFile[i]);
    }

    Object.keys(userData).forEach(key => {
      if (key !== 'confirmPassword' && key !== 'acceptTerms') {
        const val = userData[key];
        formData.append(key, userData[key]);
      }
    });

    return this.http.post(this.apiEndPointService.registerUser(), formData, httpOptions)
      .pipe(tap((response) => { }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
