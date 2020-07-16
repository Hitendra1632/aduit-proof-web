import { Injectable } from '@angular/core';
import { ApiEndPointService } from './api-end-point.service';
import { tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,
  ) { }

  public getUserDetails() {

    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };

    return this.http.get(this.apiEndPointService.getUserDetails(), httpOptions)
      .pipe(map((user) => {
        localStorage.setItem('currentUserDetails', JSON.stringify(user.body));
        return user.body;
      }));
  }

}
