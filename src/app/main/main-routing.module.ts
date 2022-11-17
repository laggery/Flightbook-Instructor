import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './pages/students/students.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: MainComponent,
    loadChildren: () => import('./pages/students/students.module').then(m => m.StudentsModule)
  },
  {
    path: 'appointments',
    component: MainComponent,
    loadChildren: () => import('./pages/appointments/appointments.module').then(m => m.AppointmentsModule)
  },
  {
    path: 'team',
    component: MainComponent,
    loadChildren: () => import('./pages/team/team.module').then(m => m.TeamModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
