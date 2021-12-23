import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    private excludeUrl: Array<Array<string>>;

    constructor(
        private router: Router,
        private accoutService: AccountService
    ) {
        this.excludeUrl = [
            ['assets/i18n', 'GET'],
            ['auth/login', 'POST'],
            ['users', 'POST'],
            ['auth/refresh', 'GET'],
            ['auth/reset-password', 'GET']
        ];
    }

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
