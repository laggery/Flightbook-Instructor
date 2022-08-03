import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { Appointment } from 'src/app/shared/domain/appointment';
import { School } from 'src/app/shared/domain/school';
import { State } from 'src/app/shared/domain/state';
import { User } from 'src/app/shared/domain/user';
import { AppointmentFormDialogComponent } from '../../component/appointment-form-dialog/appointment-form-dialog.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<void>();
  school: School | undefined;
  appointments: Appointment[] = [];
  teamMembers: User[] = [];
  displayedColumns: string[] = ['action', 'scheduling', 'meetingPoint', 'instructor', 'takeOffCoordinator', 'maxPeople', 'state'];

  constructor(
    private schoolService: SchoolService,
    private accountService: AccountService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.accountService.currentSelectedSchool$.pipe(takeUntil(this.unsubscribe$)).subscribe((school: School) => {
      this.school = school;
      if (school?.id) {
        this.schoolService.getAppointmentsBySchoolId(school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((appointments: Appointment[]) => {
          this.appointments = appointments;
        })

        this.schoolService.getTeamMembers(school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((users: User[]) => {
          this.teamMembers = users;
        })
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  showDetail(appointment: Appointment) {
    console.log(appointment);
  }

  addAppointment() {
    const appointment = new Appointment();
    appointment.state = State.ANNOUNCED;
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: "500px",
      data: {
        teamMembers: this.teamMembers,
        appointment: appointment
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response?.event === "save" && this.school?.id){
        this.schoolService.postAppointment(this.school.id, response.appointment).pipe(takeUntil(this.unsubscribe$)).subscribe((appointment: Appointment) => {})
        this.schoolService.getAppointmentsBySchoolId(this.school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((appointments: Appointment[]) => {
          this.appointments = appointments;
        })
        // Save appoointment
        console.log(response.appointment);
      }
    });
  }


}
