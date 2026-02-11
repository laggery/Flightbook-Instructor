import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TandemPilot } from 'src/app/shared/domain/tandem-pilot';
import { School } from 'src/app/shared/domain/school';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { StudentService } from 'src/app/core/services/student.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'fb-tandem-pilot-detail',
  templateUrl: './tandem-pilot-detail.component.html',
  styleUrls: ['./tandem-pilot-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ]
})
export class TandemPilotDetailComponent {
  @Input()
  tandemPilot: TandemPilot | undefined;

  @Input()
  school: School | undefined;

  @Output() backButtonClick = new EventEmitter();
  @Output() removeUserButtonClick = new EventEmitter();

  get isMobile(): Signal<boolean> {
    return this.deviceSize.isMobile;
  }

  constructor(
    private deviceSize: DeviceSizeService,
    private studentService: StudentService,
    private translate: TranslateService
  ) {}

  backButton() {
    this.backButtonClick.emit();
  }

  async archiveTandemPilot() {
    const confirmationMessage = this.translate.instant('tandemPilot.archiveTandemPilotMessage').replace("$REPLACE_NAME", `${this.tandemPilot?.user?.firstname} ${this.tandemPilot?.user?.lastname}`);
    if (!confirm(confirmationMessage)) {
      return;
    }

    if (!this.tandemPilot?.id) {
      return;
    }

    await firstValueFrom(this.studentService.archiveStudent(this.tandemPilot?.id));

    this.removeUserButtonClick.emit("deleted");
  }
}
