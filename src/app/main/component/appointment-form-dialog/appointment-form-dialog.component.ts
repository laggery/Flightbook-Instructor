import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Appointment } from 'src/app/shared/domain/appointment';
import { AppointmentType } from 'src/app/shared/domain/appointment-type-dto';
import { State } from 'src/app/shared/domain/state';
import { Student } from 'src/app/shared/domain/student';
import { Subscription } from 'src/app/shared/domain/subscription';
import { User } from 'src/app/shared/domain/user';
import { AppointmentsComponent } from '../../pages/appointments/appointments.component';

@Component({
  selector: 'app-appointment-form-dialog',
  templateUrl: './appointment-form-dialog.component.html',
  styleUrls: ['./appointment-form-dialog.component.scss']
})
export class AppointmentFormDialogComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: UntypedFormGroup;
  states = Object.keys(State);
  private appointment: Appointment;
  students: Student[];
  appointmentTypes: AppointmentType[];
  selectedStudents = new Set<string>();

  @ViewChildren('subscriptionFormList') subscriptionFormList?: QueryList<ElementRef>
  @ViewChildren("selectStudent") selectStudent?: QueryList<MatSelect>;
  @ViewChild('picker') picker: any;

  public showSpinners = true;
  public showSeconds = false;
  public touchUi = true;
  public enableMeridian = true;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public defaultTime = [8, 0, 0] 

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AppointmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef
  ) {
    this.appointment = data.appointment;
    this.students = data.students;
    this.appointmentTypes = data.appointmentTypes;

    const subscriptionFbArray = this.fb.array([]);
    this.appointment.subscriptions.forEach((subscription: Subscription) => {
      subscriptionFbArray.push(this.fb.group({
        user: [subscription.user?.email, Validators.required]
      }));
    })

    this.form = this.fb.group({
      state: [this.appointment.state, Validators.required],
      type: [this.appointment.type, Validators.nullValidator],
      date: [this.appointment.scheduling, Validators.required],
      meetingPoint: [this.appointment.meetingPoint, Validators.required],
      maxPeople: [this.appointment.maxPeople, Validators.nullValidator],
      instructor: [this.appointment.instructor?.email, Validators.required],
      takeOffCoordinator: [this.appointment.takeOffCoordinator?.email, Validators.nullValidator],
      description: [this.appointment.description, Validators.nullValidator],
      subscriptions: subscriptionFbArray
    });
  }
  ngAfterViewInit(): void {
    this.selected();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
  }

  isSelected(email: string | undefined) {
    if (!email) {
      return;
    }
    return this.selectedStudents.has(email);
  }

  selected() {
    this.selectedStudents?.clear();
    this.selectStudent?.forEach(ls => {
      const selectedVal = ls.value;
      if (selectedVal && selectedVal !== "undefined") this.selectedStudents?.add(selectedVal);
    });
  }

  onCancel(): void {
    this.dialogRef.close({ event: "cancel" });
  }

  onSave(): void {
    if (!this.appointment.instructor) {
      this.appointment.instructor = new User();
    }

    if (!this.appointment.takeOffCoordinator) {
      this.appointment.takeOffCoordinator = new User();
    }

    if (!this.appointment.type) {
      this.appointment.type = new AppointmentType();
    }

    if (this.form.valid) {
      this.appointment.state = this.form.get("state")?.value;
      this.appointment.type.id = this.form.get("type")?.value;
      this.appointment.scheduling = this.form.get("date")?.value;
      this.appointment.instructor.email = this.form.get("instructor")?.value;
      this.appointment.takeOffCoordinator.email = this.form.get("takeOffCoordinator")?.value;
      this.appointment.maxPeople = this.form.get("maxPeople")?.value;
      this.appointment.meetingPoint = this.form.get("meetingPoint")?.value;
      this.appointment.description = this.form.get("description")?.value;

      const subscriptionList = this.form.get("subscriptions")?.value;

      this.appointment.subscriptions = [];
      subscriptionList.forEach((subscriptionUser: any) => {
        const subscription = new Subscription();
        subscription.user = this.findUserByEmail(subscriptionUser.user);
        this.appointment.subscriptions.push(subscription);
      })

      this.dialogRef.close({
        event: "save",
        appointment: this.appointment
      });
    }
  }

  findUserByEmail(email: string) {
    return this.students.find((student: Student) => {
      return student.user?.email == email;
    })?.user
  }

  get subscriptions(): FormArray {
    return this.form.get("subscriptions") as FormArray
  }

  addSubscription() {
    this.selected();
    const subscriptionForm = this.fb.group({
      user: ['', Validators.required]
    });

    this.subscriptions.push(subscriptionForm);

    setTimeout(() => {
      this.subscriptionFormList?.last.nativeElement.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  removeSubscription(index: number, email: string) {
    this.selectedStudents.delete(email);
    this.subscriptions.removeAt(index);
  }

}
