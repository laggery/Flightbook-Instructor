import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.router.navigate(['login']);
            }

            if (err.status >= 500 || err.status === 0) {
                this.snackBar.open('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder senden Sie eine E-Mail an: yannick.lagger@flightbook.ch', 'Ok', {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
            return throwError(() => err);
        }));
    }
}
