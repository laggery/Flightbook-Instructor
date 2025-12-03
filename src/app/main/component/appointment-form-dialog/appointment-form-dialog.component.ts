import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Appointment } from 'src/app/shared/domain/appointment';
import { AppointmentType } from 'src/app/shared/domain/appointment-type-dto';
import { State } from 'src/app/shared/domain/state';
import { Student } from 'src/app/shared/domain/student';
import { Subscription } from 'src/app/shared/domain/subscription';
import { User } from 'src/app/shared/domain/user';
import { AppointmentsComponent } from '../../pages/appointments/appointments.component';
import { GuestSubscription } from 'src/app/shared/domain/guest-subscription';
import moment from 'moment';

@Component({
  selector: 'app-appointment-form-dialog',
  templateUrl: './appointment-form-dialog.component.html',
  styleUrls: ['./appointment-form-dialog.component.scss'],
  standalone: false
})
export class AppointmentFormDialogComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: UntypedFormGroup;
  states = Object.keys(State);
  private appointment: Appointment;
  students: Student[];
  appointmentTypes: AppointmentType[];
  selectedStudents = new Set<string>();

  @ViewChildren('subscriptionFormList') subscriptionFormList?: QueryList<ElementRef>
  @ViewChildren('guestSubscriptionFormList') guestSubscriptionFormList?: QueryList<ElementRef>
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
    });

    const guestSubscriptionFbArray = this.fb.array([]);
    this.appointment.guestSubscriptions.forEach((guestSubscription: GuestSubscription) => {
      guestSubscriptionFbArray.push(this.fb.group({
        id: [guestSubscription.id, Validators.required],
        firstname: [guestSubscription.firstname, Validators.required],
        lastname: [guestSubscription.lastname, Validators.required]
      }));
    });

    this.form = this.fb.group({
      state: [this.appointment.state, Validators.required],
      type: [this.appointment.type?.id, Validators.nullValidator],
      date: [this.appointment.scheduling, Validators.required],
      deadline: [this.appointment.deadline, Validators.nullValidator],
      meetingPoint: [this.appointment.meetingPoint, Validators.nullValidator],
      maxPeople: [this.appointment.maxPeople, Validators.nullValidator],
      instructor: [this.appointment.instructor?.email, Validators.nullValidator],
      takeOffCoordinator: [this.appointment.takeOffCoordinator?.email, Validators.nullValidator],
      takeOffCoordinatorText: [this.appointment.takeOffCoordinatorText, Validators.nullValidator],
      description: [this.appointment.description, Validators.nullValidator],
      subscriptions: subscriptionFbArray,
      guestSubscriptions: guestSubscriptionFbArray
    });
  }
  ngAfterViewInit(): void {
    this.selected();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {
    // Listen for date changes to update deadline
    this.form.get('date')?.valueChanges.subscribe((newDate) => {
      this.updateDeadlineFromDate(newDate);
    });
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
      this.appointment.deadline = this.form.get("deadline")?.value;
      this.appointment.instructor.email = this.form.get("instructor")?.value;
      this.appointment.takeOffCoordinator.email = this.form.get("takeOffCoordinator")?.value;
      this.appointment.takeOffCoordinatorText = this.form.get("takeOffCoordinatorText")?.value;
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

      const guestSubscriptionList = this.form.get("guestSubscriptions")?.value;
      this.appointment.guestSubscriptions = [];
      guestSubscriptionList.forEach((guestSubscriptionUser: any) => {
        const guestSubscription = new GuestSubscription();
        guestSubscription.id = guestSubscriptionUser.id;
        guestSubscription.firstname = guestSubscriptionUser.firstname;
        guestSubscription.lastname = guestSubscriptionUser.lastname;
        this.appointment.guestSubscriptions.push(guestSubscription);
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

  get guestSubscriptions(): FormArray {
    return this.form.get("guestSubscriptions") as FormArray
  }

  addGuestSubscription() {
    const guestSubscriptionForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });

    this.guestSubscriptions.push(guestSubscriptionForm);

    setTimeout(() => {
      this.guestSubscriptionFormList?.last.nativeElement.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  removeGuestSubscription(index: number) {
    this.guestSubscriptions.removeAt(index);
  }

  changeType(event: MatSelectChange) {
    if (!event.value) {
      return;
    }

    const type = this.appointmentTypes.find((appointmentType: AppointmentType) => appointmentType.id == event.value);
    this.form.get("meetingPoint")?.setValue(type?.meetingPoint);
    this.form.get("maxPeople")?.setValue(type?.maxPeople);
    this.form.get("instructor")?.setValue(type?.instructor?.email);
    const date = moment(this.form.get("date")?.value);
    if (type?.time) {
      const time = moment(type.time, 'HH:mm');
      date.utc().set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second')
      });
      this.form.get("date")?.setValue(date.toDate());
    }
  }

  updateDeadlineFromDate(dateValue: Date | null) {
    if (!dateValue) {
      return;
    }
    const type = this.appointmentTypes.find((appointmentType: AppointmentType) => appointmentType.id == this.form.get("type")?.value);
    if (type?.deadlineOffsetHours) {
      const schedulingDate = moment(dateValue);
      const deadline = schedulingDate.subtract(type.deadlineOffsetHours, 'hours');
      this.form.get("deadline")?.setValue(deadline.toDate());
    } else {
      this.form.get("deadline")?.setValue(dateValue);
    }
  }
}
