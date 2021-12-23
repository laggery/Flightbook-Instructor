import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Flightbook Instructor App';
  login: boolean = true;
  unsubscribe$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router) {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          if (event.url === '/login') {
            this.login = true;
          } else {
            this.login = false;
          }
        }
      });
    }

  logout() {
    this.accountService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
      // TODO error handling
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
