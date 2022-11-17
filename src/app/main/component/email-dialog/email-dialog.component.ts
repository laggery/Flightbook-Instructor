import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'fb-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit {

  form: UntypedFormGroup;
  title: string

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.title = data.title;
      this.form = this.fb.group({
        email: ['', Validators.email]
      });
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close({ event: "cancel" });
  }

  onSend(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        event: "send",
        value: this.form.get('email')?.value
      });
    }
  }

}
