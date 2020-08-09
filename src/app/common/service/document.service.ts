import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndPointService } from './api-end-point.service';
import { tap, map } from 'rxjs/operators';
import { DocumentDetails } from '../models/document.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  public documentDetailsObj = {};
  constructor(
    private apiEndPointService: ApiEndPointService,
    private http: HttpClient,
  ) { }

  public setDocumentDetails(docObj) {
    this.documentDetailsObj = docObj;
  }

  public getDocumentDetails() {
    return this.documentDetailsObj;
  }

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


  public getPartialDocument(parameters) {
    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response',
      params: parameters
    };

    return this.http.get<any>(this.apiEndPointService.getPartialDocSign(), httpOptions)
      .pipe(map((document) => {
        return document.body;
      }));
  }

  // Initiate Doc Signing process
  public startDocumentSigning(documentDetails) {
    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response'
    };

    return this.http.post<any>(this.apiEndPointService.postInitialDocSigning(), documentDetails, httpOptions)
      .pipe(map((response) => {
        return response.body;
      }));
  }

  // Initiate Doc Signing process
  public submitSignedDocument(documentDetails): Observable<DocumentDetails> {
    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response'
    };

    return this.http.post<DocumentDetails>(this.apiEndPointService.postFinalDocSignature(), documentDetails, httpOptions)
      .pipe(map((response) => {
        return response.body;
      }));
  }

  // Validate Doc  process
  public validateSignedDocument(documentDetails): Observable<any> {
    const httpHeaders = new HttpHeaders();

    const httpOptions = {
      headers: httpHeaders,
      withCredentials: true,
      observe: 'response' as 'response'
    };

    return this.http.post<any>(this.apiEndPointService.postFullDocSigning(), documentDetails, httpOptions)
      .pipe(map((response) => {
        return response.body;
      }));
  }
}
