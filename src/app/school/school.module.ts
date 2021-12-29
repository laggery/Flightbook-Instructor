import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SchoolComponent } from './school.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { StudentsComponent } from './component/students/students.component';
import { StudentDetailComponent } from './component/student-detail/student-detail.component';


@NgModule({
  declarations: [
    SchoolComponent,
    StudentsComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    MatTabsModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule
  ]
})
export class SchoolModule { }
