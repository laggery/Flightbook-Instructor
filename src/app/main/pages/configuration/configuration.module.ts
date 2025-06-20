import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeamComponent } from '../../component/team/team.component';
import { AppointmentTypeComponent } from '../../component/appointment-type/appointment-type.component';
import { AppointmentTypeDialogComponent } from '../../component/appointment-type-dialog/appointment-type-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolSettingComponent } from '../../component/school-setting/school-setting.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    TeamComponent,
    AppointmentTypeComponent,
    AppointmentTypeDialogComponent,
    SchoolSettingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedModule,
    FormsModule,
    ConfigurationRoutingModule
  ]
})
export class ConfigurationModule { }
