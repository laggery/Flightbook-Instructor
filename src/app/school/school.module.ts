import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SchoolComponent } from './school.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    SchoolComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    MatTabsModule
  ]
})
export class SchoolModule { }
