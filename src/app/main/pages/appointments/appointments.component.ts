import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { StudentListPDFService } from 'src/app/core/services/student-list-pdf.service';
import { Appointment } from 'src/app/shared/domain/appointment';
import { AppointmentFilter } from 'src/app/shared/domain/appointment-filter';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { School } from 'src/app/shared/domain/school';
import { State } from 'src/app/shared/domain/state';
import { Student } from 'src/app/shared/domain/student';
import { User } from 'src/app/shared/domain/user';
import { AppointmentFormDialogComponent } from '../../component/appointment-form-dialog/appointment-form-dialog.component';
import { SubscriptionsComponent } from '../../component/subscriptions/subscriptions.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<void>();
  school: School | undefined;
  appointments: MatTableDataSource<Appointment> = new MatTableDataSource();
  teamMembers: User[] = [];
  students: Student[] = [];
  displayedColumns: string[] = ['edit', 'subscription', 'list', 'scheduling', 'meetingPoint', 'instructor', 'takeOffCoordinator', 'countSubscription', 'countWaitinglist', 'state'];
  pagerEntity = new PagerEntity<Appointment[]>;
  states = State;
  currentAppointmentFilter: AppointmentFilter;
  @ViewChild('paginator') paginator: MatPaginator | undefined;

  constructor(
    private schoolService: SchoolService,
    private accountService: AccountService,
    private studentListPDFService: StudentListPDFService,
    private dialog: MatDialog) {
      this.currentAppointmentFilter = this.schoolService.filter;
    }

  ngOnInit(): void {
    this.accountService.currentSelectedSchool$.pipe(takeUntil(this.unsubscribe$)).subscribe((school: School) => {
      this.school = school;
      if (school?.id) {
        this.loadAppointments(school.id);

        this.schoolService.getTeamMembers(school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((users: User[]) => {
          this.teamMembers = users;
        })

        this.schoolService.getStudentsBySchoolId(school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((students: Student[]) => {
          this.students = students.sort(((obj1, obj2) => (obj1.user?.firstname && obj2.user?.firstname && obj1.user?.firstname > obj2.user?.firstname ? 1 : -1)));
        })
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadAppointments(schoolId: number, offset: number | undefined = undefined, limit = this.schoolService.limit) {
    if (!offset && this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.schoolService.getAppointmentsBySchoolId({limit, offset}, schoolId).pipe(takeUntil(this.unsubscribe$)).subscribe((pagerEntity: PagerEntity<Appointment[]>) => {
      this.pagerEntity = pagerEntity;
      if (pagerEntity.entity) {
        this.appointments.data = pagerEntity.entity;
      }
    })
  }

  editAppointment(appointment: Appointment) {
    this.handleAppointmentDialog(appointment, "update");
  }

  addAppointment() {
    const appointment = new Appointment();
    appointment.state = State.ANNOUNCED;
    this.handleAppointmentDialog(appointment, "add");
  }

  handleAppointmentDialog(appointment: Appointment, type: string) {
    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: "700px",
      data: {
        teamMembers: this.teamMembers,
        students: this.students,
        appointment: appointment
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response?.event === "save" && this.school?.id && type == "add"){
        const schoolId = this.school.id;
        this.schoolService.postAppointment(schoolId, response.appointment).pipe(takeUntil(this.unsubscribe$)).subscribe((appointment: Appointment) => {
          this.loadAppointments(schoolId);
        })
      } else if (response?.event === "save" && this.school?.id && type == "update") {
        const schoolId = this.school.id;
        this.schoolService.putAppointment(schoolId, response.appointment).pipe(takeUntil(this.unsubscribe$)).subscribe((appointment: Appointment) => {
          this.loadAppointments(schoolId);
        })
      }
    });
  }

  subscriptionDetail(appointment: Appointment) {
    const dialogRef = this.dialog.open(SubscriptionsComponent, {
      width: "700px",
      data: {
        appointment: appointment
      }
    });
  }

  async printStudentList(appointment: Appointment) {
    if (!this.school?.id || !appointment.id) {
      return;
    }

    let students = await firstValueFrom(this.schoolService.getSubscriptionStudentDetail(this.school.id, appointment.id));
    if (appointment.maxPeople) {
      students.splice(appointment.maxPeople)
    }
    this.studentListPDFService.generatePdf(students, this.school); 
  }

  handlePage(event: any) {
    let offset = event.pageIndex * event.pageSize;
    if (this.school?.id) {
      this.loadAppointments(this.school.id, offset, event.pageSize);
    }
  }

  changeState(state: State) {
    if (this.currentAppointmentFilter.state == state) {
      this.currentAppointmentFilter.state = undefined;
    } else {
      this.currentAppointmentFilter.state = state;
    }
    this.schoolService.filter = this.currentAppointmentFilter;
    if (this.school?.id) {
      this.loadAppointments(this.school.id);
    }
  }
}
