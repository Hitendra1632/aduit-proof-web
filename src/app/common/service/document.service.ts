import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndPointService } from './api-end-point.service';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,
  ) { }

  public getDocumentList() {

    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
    };

    return this.http.get(this.apiEndPointService.getDocumentList(), httpOptions)
      .pipe(map((user) => {
        return user.body;
      }));
  }
}
