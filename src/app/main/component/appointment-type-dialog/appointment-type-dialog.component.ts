import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentType } from 'src/app/shared/domain/appointment-type-dto';

@Component({
  selector: 'app-appointment-type-dialog',
  templateUrl: './appointment-type-dialog.component.html',
  styleUrls: ['./appointment-type-dialog.component.scss']
})
export class AppointmentTypeDialogComponent implements OnInit {

  form: UntypedFormGroup;
  title: string;
  appointmentType: AppointmentType;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AppointmentTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.title = data.title;
      this.appointmentType = data.type;
      this.form = this.fb.group({
        name: [this.appointmentType.name, Validators.required]
      });
    }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close({ event: "cancel" });
  }

  onSave() {
    if (this.form.valid) {
      this.appointmentType.name = this.form.get('name')?.value
      this.dialogRef.close({
        event: "save",
        value: this.appointmentType
      });
    }
  }

}
