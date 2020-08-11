import { Injectable } from '@angular/core';
import { ApiEndPointService } from './api-end-point.service';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDetails } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserDetailsSubject: BehaviorSubject<UserDetails>;
  public currentUserDetails: Observable<UserDetails>;

  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,
  ) {
    this.currentUserDetailsSubject = new BehaviorSubject<UserDetails>(JSON.parse(localStorage.getItem('currentUserDetails')));
    this.currentUserDetails = this.currentUserDetailsSubject.asObservable();
  }

  // this works fine... not active now
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  public get currentUserValue(): UserDetails {
    return this.currentUserDetailsSubject.value;
  }

  public getUserDetails() {

    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };

    return this.http.get<UserDetails>(this.apiEndPointService.getUserDetails(), httpOptions)
      .pipe(map((user) => {
        localStorage.setItem('currentUserDetails', JSON.stringify(user.body));
        this.currentUserDetailsSubject.next(user.body);
        return user.body;
      }));
    // catchError(this.handleError));
  }

}
