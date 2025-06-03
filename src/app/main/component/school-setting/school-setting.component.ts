import { Component, EventEmitter, Output, Signal } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AccountService } from 'src/app/core/services/account.service';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { School } from 'src/app/shared/domain/school';
import { firstValueFrom } from 'rxjs';
import { SchoolConfiguration } from 'src/app/shared/domain/school-configuration';

interface Configuration {
  type: string;
  value: boolean;
}

@Component({
  selector: 'fb-school-setting',
  templateUrl: './school-setting.component.html',
  styleUrl: './school-setting.component.scss',
  standalone: false
})
export class SchoolSettingComponent {
  displayedColumns: string[] = ['option', 'value'];
  @Output() backButtonClick = new EventEmitter();
  school?: School;
  configurationDatasource: Configuration[] = [];

  constructor(
    private deviceSize: DeviceSizeService,
    private schoolService: SchoolService,
    private accountService: AccountService
  ) {
    this.school = this.accountService.currentSelectedSchool;
    this.configurationDatasource = [
      {
        type: 'validateFlights',
        value: this.school?.configuration?.validateFlights || false
      }
    ];
  }

  get isMobile(): Signal<boolean> {
    return this.deviceSize.isMobile;
  }

  backButton() {
    this.backButtonClick.emit();
  }

  async change(event: MatSlideToggleChange, configuration: Configuration) {
    if (!this.school?.configuration) {
      this.school!.configuration = new SchoolConfiguration();
    }
    if (configuration.type === "validateFlights") {
      this.school!.configuration.validateFlights = event.checked;
    }
    this.updateConfiguration();
  }

  async updateConfiguration() {
    if (this.school?.id) {
      await firstValueFrom(this.schoolService.updateSchoolConfiguration(this.school?.id, this.school!.configuration!));
    }
  }
}
