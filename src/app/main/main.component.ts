import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../core/services/account.service';
import { School } from '../shared/domain/school';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  unsubscribe$ = new Subject<void>();
  schools: School[] | undefined;
  selectedSchool: School | undefined;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
   }

  ngOnInit(): void {
    this.accountService.getSchoolsByUserId().pipe(takeUntil(this.unsubscribe$)).subscribe((schools: School[]) => {
      this.schools = schools;
      this.selectedSchool = schools[0];
      this.accountService.setCurrentSchool(this.selectedSchool);
    })
  }

  logout() {
    this.accountService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
      // TODO error handling
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.router.navigate(['login']);
    });
  }

  switchSchool(school: School) {
    this.selectedSchool = school;
    this.accountService.setCurrentSchool(this.selectedSchool);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
