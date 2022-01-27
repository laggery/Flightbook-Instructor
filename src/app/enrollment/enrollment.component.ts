import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from '../core/services/account.service';
import { EnrollmentService } from '../core/services/enrollment.service';
import { Enrollment } from '../shared/domain/enrollment';
import { EnrollmentType } from '../shared/domain/enrollmentType';

@Component({
  selector: 'fb-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  enrollment: Enrollment | undefined;
  loading = true;

  private token: string | null;

  constructor(
    private route: ActivatedRoute,
    private enrollmentService: EnrollmentService,
    private accountService: AccountService
  ) {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.enrollmentService.getEnrollmentByToken(this.token).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (resp: Enrollment) => {
          this.loading = false;
          this.enrollment = resp;
        }
      });
    }

  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loginEvent(loggedIn: boolean, stepper: MatStepper) {
    if (loggedIn) {
      stepper.next();
    }
  }

  validate(stepper: MatStepper) {
    if (this.token) {
      this.enrollmentService.acceptEnrollment(this.token).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: () => {
          stepper.next();
          this.accountService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe(resp => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          });
        }
      });
    }
  }
}
