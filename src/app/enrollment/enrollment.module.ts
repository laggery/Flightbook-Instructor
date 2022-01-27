import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentComponent } from './enrollment.component';
import { EnrollmentRoutingModule } from './enrollment-routing.module';
import { MaterialModule } from '../material/material.module';
import { LoginModule } from '../account/login/login.module';
import { UserRegisterModule } from '../account/user-register/user-register.module';



@NgModule({
  declarations: [
    EnrollmentComponent
  ],
  imports: [
    CommonModule,
    EnrollmentRoutingModule,
    MaterialModule,
    LoginModule,
    UserRegisterModule
  ]
})
export class EnrollmentModule { }
