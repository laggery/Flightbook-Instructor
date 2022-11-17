import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TeamComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    TeamRoutingModule,
    SharedModule
  ]
})
export class TeamModule { }
