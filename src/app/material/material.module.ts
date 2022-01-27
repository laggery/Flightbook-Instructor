import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatListModule,
    MatCheckboxModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatStepperModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
