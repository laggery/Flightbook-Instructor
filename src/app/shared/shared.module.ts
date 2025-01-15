import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips'
import { HoursFormatPipe } from './pipes/hours-format/hours-format.pipe';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS, NgxMatDatetimepicker, NgxMatDatepickerInput, NgxMatDatepickerApply, NgxMatDatepickerActions } from '@ngxmc/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@ngxmc/moment-adapter';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginationIntlService } from '../core/services/mat-pagination-intl.service';
import { NgxColorsModule } from 'ngx-colors';

export const MOMENT_DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

const CUSTOM_MOMENT_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: MOMENT_DATETIME_FORMAT,
  },
  display: {
    dateInput: MOMENT_DATETIME_FORMAT,
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1; // Monday is the first day of the week
  }
  override format(date: Date, displayFormat: Object): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return this._to2digit(day) + '.' + this._to2digit(month) + '.' + year;
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}

@NgModule({
  declarations: [
    HoursFormatPipe
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSlideToggleModule,

    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    NgxColorsModule
  ],
  exports: [
    HoursFormatPipe,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatSidenavModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSlideToggleModule,

    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    NgxMatMomentModule,
    NgxColorsModule
  ],
  providers: [
    // values
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MOMENT_FORMATS},
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, MAT_DATE_FORMATS]},
    {provide: MatPaginatorIntl, useClass: MatPaginationIntlService}
  ],
})
export class SharedModule { }
