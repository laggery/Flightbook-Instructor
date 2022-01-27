import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.setHeaders(req));
    }

    private setHeaders(request: HttpRequest<any>): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        });
    }
}
