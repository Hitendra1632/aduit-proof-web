import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = request;
        let requestMethod: string = request.method;
        requestMethod = requestMethod.toLowerCase();

        if (requestMethod && (requestMethod === 'post' || requestMethod === 'delete' || requestMethod === 'put' )) {
            const headerName = 'XSRF-TOKEN';
            let token = this.tokenExtractor.getToken() as string;
            if (token !== null && !request.headers.has(headerName)) {
                request = request.clone({ headers: request.headers.set(headerName, token) });
            }
         }

        // let token = this.tokenExtractor.getToken() as string;
        // console.log('Interceptor Token >>> ', token)
        // if (token !== null) {
        //     requestToForward = request.clone({ setHeaders: { "X-XSRF-TOKEN": token } });
        // }
        return next.handle(request);
    }
}
