import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from '../../core/services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  form: FormGroup;
  loginInvalid = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async onSubmit(): Promise<void> {
    console.log("onSubmit");
    this.loginInvalid = false;
    if (this.form.valid) {
      console.log("valid");
      const loginData = {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      };

      this.accountService.login(loginData).pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: async resp => {
          localStorage.setItem('access_token', resp.access_token);
          localStorage.setItem('refresh_token', resp.refresh_token);
          this.router.navigate(['']);
        },
        error: async (error: any) => {
          if (error.status === 401) {
            this.loginInvalid = true;
          }
        }
      })
    }
  }
}
