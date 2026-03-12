import { Component, EventEmitter, Input, OnChanges, Output, Signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TandemPilot } from 'src/app/shared/domain/tandem-pilot';
import { School } from 'src/app/shared/domain/school';
import { Flight } from 'src/app/shared/domain/flight';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { SchoolService } from 'src/app/core/services/school.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PassengerConfirmation } from 'src/app/shared/domain/passenger-confirmation';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TandemSchoolPaymentState } from 'src/app/shared/domain/tandem-school-payment-state';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentFormDialogComponent } from '../payment-form-dialog/payment-form-dialog.component';

@Component({
  selector: 'fb-tandem-pilot-detail',
  templateUrl: './tandem-pilot-detail.component.html',
  styleUrls: ['./tandem-pilot-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    TranslateModule
  ]
})
export class TandemPilotDetailComponent implements OnChanges {
  @Input()
  tandemPilot: TandemPilot | undefined;

  @Input()
  school: School | undefined;

  @Output() backButtonClick = new EventEmitter();
  @Output() removeUserButtonClick = new EventEmitter();

  flights: Flight[] = [];
  flightsPagerEntity: PagerEntity<Flight[]> = new PagerEntity<Flight[]>();

  passengerConfirmations: PassengerConfirmation[] = [];
  passengerConfirmationsPagerEntity: PagerEntity<PassengerConfirmation[]> = new PagerEntity<PassengerConfirmation[]>();
  unsubscribe$ = new Subject<void>();

  @ViewChild('passengerConfirmationsPaginator') passengerConfirmationsPaginator: MatPaginator | undefined;
  @ViewChild('flightsPaginator') flightsPaginator: MatPaginator | undefined;

  displayedFlightColumns: string[] = ['date', 'start', 'landing', 'time', 'description', 'paymentState', 'paymentAmount', 'paymentButtons'];
  displayedPassengerColumns: string[] = ['date', 'name', 'place', 'phone', 'email', 'canUseData'];

  // Expose enum for template access
  TandemSchoolPaymentState = TandemSchoolPaymentState;

  get isMobile(): Signal<boolean> {
    return this.deviceSize.isMobile;
  }

  constructor(
    private deviceSize: DeviceSizeService,
    private schoolService: SchoolService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tandemPilot'] && changes['tandemPilot'].currentValue) {
      this.loadFlights();
      this.loadPassengerConfirmations(changes['tandemPilot'].currentValue.id);
    }
  }

  loadFlights(offset: number | undefined = undefined, limit = 5) {
    if (!this.tandemPilot?.id) return;

    if (!offset && this.flightsPaginator) {
      this.flightsPaginator.pageIndex = 0;
    }

    this.schoolService.getTandemPilotFlightsBySchoolIdAndTandemPilotId({ limit, offset }, this.school!.id!, this.tandemPilot.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pagerEntity) => {
        this.flightsPagerEntity = pagerEntity;
        this.flights = pagerEntity.entity || [];
      });
  }

  loadPassengerConfirmations(tandemPilotId: number, offset: number | undefined = undefined, limit = 5) {
    if (!offset && this.passengerConfirmationsPaginator) {
      this.passengerConfirmationsPaginator.pageIndex = 0;
    }

    this.schoolService.getPassengerConfirmationsBySchoolIdAndTandemPilotId({ limit, offset }, this.school!.id!, tandemPilotId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pagerEntity) => {
        this.passengerConfirmationsPagerEntity = pagerEntity;
        if (pagerEntity.entity) {
          this.passengerConfirmations = pagerEntity.entity;
        }
      });
  }

  handlePassengerConfirmationPage(event: any) {
    let offset = event.pageIndex * event.pageSize;
    if (this.tandemPilot?.id) {
      this.loadPassengerConfirmations(this.tandemPilot?.id, offset, event.pageSize);
    }
  }

  handleFlightsPage(event: any) {
    let offset = event.pageIndex * event.pageSize;
    if (this.tandemPilot?.id) {
      this.loadFlights(offset, event.pageSize);
    }
  }

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

    await firstValueFrom(this.schoolService.archiveTandemPilot(this.school?.id!, this.tandemPilot!));

    this.removeUserButtonClick.emit("deleted");
  }

  managePaymentModal(flight: Flight, paymentState: TandemSchoolPaymentState) {
    const dialogRef = this.dialog.open(PaymentFormDialogComponent, {
      width: '500px',
      data: { 
        paymentState
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.school?.id && this.tandemPilot?.id) {
        flight.tandemSchoolData = {
          paymentState: paymentState,
          paymentAmount: result.amount == undefined ? null : result.amount,
          paymentComment: result.comment == '' ? null : result.comment
        };

        this.schoolService.validateTandemPilotFlightSchoolIdAndStudentId(
          this.school.id,
          this.tandemPilot,
          flight
        ).pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => {
            this.loadFlights();
          });
      }
    });
  }
}
