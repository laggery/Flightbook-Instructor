import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { Flight } from 'src/app/shared/domain/flight';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit, OnChanges {
  @Input()
  student: Student | undefined;

  flights: Flight[];
  displayedColumns: string[] = ['nb', 'date', 'start', 'landing', 'glider', 'time', 'km', 'description'];

  controlSheet: any;
  @ViewChild('table', {read: ElementRef}) table: ElementRef | undefined;

  constructor(private studentService: StudentService) { 
    this.flights = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['student'].currentValue) {
      this.studentService.getFlightsByStudentId(changes['student'].currentValue.user.id).subscribe((flights: Flight[]) => {
        this.flights = flights;
      });

      this.studentService.getControlSheetByStudentId(changes['student'].currentValue.user.id).subscribe((controlSheet: ControlSheet) => {
        this.controlSheet = controlSheet;
      });
    }
  }

  saveControlSheet(controlSheet: any) {
    if (!this.student?.user?.id) {
      return;
    }
    this.studentService.postControlSheetByStudentId(this.student?.user?.id, controlSheet).subscribe((controlSheet: ControlSheet) => {
      this.controlSheet = controlSheet;
    });
  }

}
