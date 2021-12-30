import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StudentsRoutingModule } from './students-routing.module';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    StudentsComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    MatTabsModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule
  ]
})
export class StudentsModule { }
