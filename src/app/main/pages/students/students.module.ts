import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentDetailComponent } from '../../component/student-detail/student-detail.component';
import { MaterialModule } from 'src/app/material/material.module';
import { EmailDialogComponent } from '../../component/email-dialog/email-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StudentsComponent,
    StudentDetailComponent,
    EmailDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    StudentsRoutingModule,
    FormsModule
  ]
})
export class StudentsModule { }
