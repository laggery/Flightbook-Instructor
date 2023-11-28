import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { StudentListPDFService } from 'src/app/core/services/student-list-pdf.service';
import { Appointment } from 'src/app/shared/domain/appointment';
import { AppointmentFilter } from 'src/app/shared/domain/appointment-filter';
import { AppointmentType } from 'src/app/shared/domain/appointment-type-dto';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { School } from 'src/app/shared/domain/school';
import { State } from 'src/app/shared/domain/state';
import { Student } from 'src/app/shared/domain/student';
import { TeamMember } from 'src/app/shared/domain/team-member';
import { AppointmentFormDialogComponent } from '../../component/appointment-form-dialog/appointment-form-dialog.component';
import { SubscriptionsComponent } from '../../component/subscriptions/subscriptions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<void>();
  school: School | undefined;
  appointments: Appointment[];
  appointmentTypes: AppointmentType[] = [];
  teamMembers: TeamMember[] = [];
  students: Student[] = [];
  displayedColumns: string[] = ['edit', 'subscription', 'list', 'scheduling', 'meetingPoint', 'instructor', 'takeOffCoordinator', 'countSubscription', 'countWaitinglist', 'state'];
  pagerEntity = new PagerEntity<Appointment[]>;
  states = State;
  currentAppointmentFilter: AppointmentFilter;
  @ViewChild('paginator') paginator: MatPaginator | undefined;

  datePipe: DatePipe;

  constructor(
    private schoolService: SchoolService,
    private accountService: AccountService,
    private studentListPDFService: StudentListPDFService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.currentAppointmentFilter = this.schoolService.filter;
    this.appointments = [];
    this.datePipe = new DatePipe('en-US');
  }

  ngOnInit(): void {
    this.school = this.accountService.currentSelectedSchool;
    if (this.school) {
      this.initialLoad();
    }
    this.accountService.changeSelectedSchool$.pipe(takeUntil(this.unsubscribe$)).subscribe((school: School) => {
      this.school = school;
      this.appointmentTypes = [];
      this.initialLoad();
    });

  }

  initialLoad() {
    if (this.school?.id) {
      this.loadAppointments(this.school.id);

      this.schoolService.getTeamMembers(this.school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((teamMembers: TeamMember[]) => {
        this.teamMembers = teamMembers;
      })

      this.schoolService.getStudentsBySchoolId(this.school.id, false).pipe(takeUntil(this.unsubscribe$)).subscribe((students: Student[]) => {
        this.students = students.sort(((obj1, obj2) => (obj1.user?.firstname && obj2.user?.firstname && obj1.user?.firstname > obj2.user?.firstname ? 1 : -1)));
      })

      this.schoolService.getAppointmentTypesBySchoolId(this.school.id, {archived: false}).pipe(takeUntil(this.unsubscribe$)).subscribe((appointmentTypes: AppointmentType[]) => {
        this.appointmentTypes = appointmentTypes;
        if (this.displayedColumns.length == 11) {
          this.displayedColumns.splice(-1);
        }
        if (appointmentTypes.length > 0) {
          this.displayedColumns.push('type');
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadAppointments(schoolId: number, offset: number | undefined = undefined, limit = this.schoolService.limit) {
    if (!offset && this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.schoolService.getAppointmentsBySchoolId({ limit, offset }, schoolId).pipe(takeUntil(this.unsubscribe$)).subscribe((pagerEntity: PagerEntity<Appointment[]>) => {
      this.pagerEntity = pagerEntity;
      if (pagerEntity.entity) {
        this.appointments = pagerEntity.entity;
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
        appointment: appointment,
        appointmentTypes: this.appointmentTypes
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response?.event === "save" && this.school?.id && type == "add") {
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
    try {
      const pdf = await this.studentListPDFService.generatePdf(students, this.school, appointment);
      pdf.open();
    } catch(error: any) {}
      const pdf = await this.studentListPDFService.generatePdf(students, this.school, appointment);
      pdf.download(`${this.datePipe.transform(appointment.scheduling, 'yyyy.MM.dd')}-registrations.pdf`);
      this.snackBar.open(this.translate.instant('message.pdfDownloaded'), this.translate.instant('buttons.done'), {
        horizontalPosition: 'center',
        verticalPosition: 'top',
    });
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
