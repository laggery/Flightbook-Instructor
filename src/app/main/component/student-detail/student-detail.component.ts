import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { PdfExportService } from 'src/app/core/services/pdf-export.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { Flight } from 'src/app/shared/domain/flight';
import { School } from 'src/app/shared/domain/school';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  student: Student | undefined;

  @Input()
  school: School | undefined;

  @Output() backButtonClick = new EventEmitter();

  @Output() removeUserButtonClick = new EventEmitter();

  flights: Flight[];
  displayedColumns: string[] = ['nb', 'date', 'start', 'landing', 'glider', 'time', 'km', 'description'];
  isMobile = false;

  controlSheet: any;
  @ViewChild('table', { read: ElementRef }) table: ElementRef | undefined;

  unsubscribe$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private deviceSize: DeviceSizeService,
    private translate: TranslateService,
    private pdfExportService: PdfExportService,
    private snackBar: MatSnackBar
  ) {
    this.flights = [];
  }

  ngOnInit(): void {
    this.deviceSize.isMobile.pipe(takeUntil(this.unsubscribe$)).subscribe((val: boolean) => {
      this.isMobile = val;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && changes['student'].currentValue) {
      this.studentService.getFlightsByStudentId(changes['student'].currentValue.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe((flights: Flight[]) => {
        this.flights = flights;
      });

      this.studentService.getControlSheetByStudentId(changes['student'].currentValue.user.id).pipe(takeUntil(this.unsubscribe$)).subscribe((controlSheet: ControlSheet) => {
        this.controlSheet = controlSheet;
      });
    }
  }

  saveControlSheet(controlSheet: any) {
    if (!this.student?.user?.id) {
      return;
    }
    this.studentService.postControlSheetByStudentId(this.student?.user?.id, controlSheet).pipe(takeUntil(this.unsubscribe$)).subscribe((controlSheet: ControlSheet) => {
      this.controlSheet = controlSheet;
    });
  }

  backButton() {
    this.backButtonClick.emit();
  }

  async removeStudent() {
    const confirmationMessage = this.translate.instant('student.removeStudentMessage').replace("$REPLACE_NAME", `${this.student?.user?.firstname} ${this.student?.user?.lastname}`);
    if (!confirm(confirmationMessage)) {
      return;
    }

    if (!this.student?.user?.id || !this.school?.id) {
      return;
    }

    await firstValueFrom(this.studentService.removeStudent(this.student?.user?.id, this.school.id));

    this.removeUserButtonClick.emit("deleted");
  }

  async printFlightbook() {
    if (!this.student?.user) {
      return;
    }

    if (this.flights.length == 0) {
      this.snackBar.open(this.translate.instant('message.noFlight'), this.translate.instant('buttons.done'), {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.pdfExportService.generatePdf(this.flights, this.student?.user);
  }

}
