import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from 'src/app/shared/domain/appointment';
import { State } from 'src/app/shared/domain/state';
import { AppointmentsComponent } from '../../pages/appointments/appointments.component';

@Component({
  selector: 'app-appointment-form-dialog',
  templateUrl: './appointment-form-dialog.component.html',
  styleUrls: ['./appointment-form-dialog.component.scss']
})
export class AppointmentFormDialogComponent implements OnInit {

  form: UntypedFormGroup;
  states = Object.keys(State);
  private appointment: Appointment;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AppointmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointment = data.appointment;
    this.form = this.fb.group({
      state: [this.appointment.state, Validators.required],
      date: [this.appointment.scheduling, Validators.required],
      meetingPoint: [this.appointment.meetingPoint, Validators.required],
      maxPeople: [this.appointment.maxPeople, Validators.nullValidator],
      instructor: [this.appointment.instructor, Validators.required],
      takeOffCoordinator: [this.appointment.takeOffCoordinator, Validators.nullValidator],
      description: [this.appointment.description, Validators.nullValidator]
      
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close({event: "cancel"});
  }

  onSave(): void {
    if (this.form.valid) {
      this.appointment.state = this.form.get("state")?.value;
      this.appointment.scheduling = this.form.get("date")?.value;
      this.appointment.instructor = this.form.get("instructor")?.value;
      this.appointment.takeOffCoordinator = this.form.get("takeOffCoordinator")?.value;
      this.appointment.maxPeople = this.form.get("maxPeople")?.value;
      this.appointment.meetingPoint = this.form.get("meetingPoint")?.value;
      this.appointment.meetingPoint = this.form.get("description")?.value;
      this.dialogRef.close({
        event: "save",
        appointment: this.appointment
      });
    }
  }

}
