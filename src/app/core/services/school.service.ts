import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/domain/student';
import { Enrollment } from 'src/app/shared/domain/enrollment';
import { environment } from 'src/environments/environment';
import { Appointment } from 'src/app/shared/domain/appointment';
import { Subscription } from 'src/app/shared/domain/subscription';
import { User } from 'src/app/shared/domain/user';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getStudentsBySchoolId(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/schools/${id}/students`);
  }

  getTeamMembers(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/schools/${id}/team-members`);
  }

  postStudentsEnrollment(id: number, email: string) {
    return this.http.post<Enrollment>(`${environment.baseUrl}/schools/${id}/students/enrollment`, { email: email });
  }

  getAppointmentsBySchoolId(id: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${environment.baseUrl}/schools/${id}/appointments`);
  }

  postAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.baseUrl}/schools/${id}/appointments`, appointment);
  }

  putAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${environment.baseUrl}/schools/${id}/appointments/${appointment.id}`, appointment);
  }

  getAppointmentSubscriptions(id: number, appointmentId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${environment.baseUrl}/schools/${id}/appointments/${appointmentId}/subscriptions`);
  }
}
