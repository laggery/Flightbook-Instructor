import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/core/services/student.service';
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
  @ViewChild('table', {read: ElementRef}) table: ElementRef | undefined;

  constructor(private studentService: StudentService) { 
    this.flights = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes['student'].currentValue);
    if (changes['student'].currentValue) {
      this.studentService.getFlightsByStudentId(changes['student'].currentValue.user.id).subscribe((flights: Flight[]) => {
        this.flights = flights;
      });
    }
  }

}
