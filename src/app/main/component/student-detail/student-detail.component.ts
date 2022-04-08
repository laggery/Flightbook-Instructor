import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { StudentService } from 'src/app/core/services/student.service';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { Flight } from 'src/app/shared/domain/flight';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  student: Student | undefined;

  @Output() backButtonClick = new EventEmitter();

  flights: Flight[];
  displayedColumns: string[] = ['nb', 'date', 'start', 'landing', 'glider', 'time', 'km', 'description'];
  isMobile = false;

  controlSheet: any;
  @ViewChild('table', {read: ElementRef}) table: ElementRef | undefined;

  unsubscribe$ = new Subject<void>();

  constructor(private studentService: StudentService, private deviceSize: DeviceSizeService) { 
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

  ngOnChanges(changes: SimpleChanges){
    if (changes['student'].currentValue) {
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

}
