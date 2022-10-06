import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/domain/student';
import { Enrollment } from 'src/app/shared/domain/enrollment';
import { environment } from 'src/environments/environment';
import { Appointment } from 'src/app/shared/domain/appointment';
import { Subscription } from 'src/app/shared/domain/subscription';
import { User } from 'src/app/shared/domain/user';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { AppointmentFilter } from 'src/app/shared/domain/appointment-filter';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  filter: AppointmentFilter;
  limit = 10;

  constructor(private http: HttpClient) {
    this.filter = new AppointmentFilter();
  }

  getStudentsBySchoolId(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/instructor/schools/${id}/students`);
  }

  getTeamMembers(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/instructor/schools/${id}/team-members`);
  }

  postStudentsEnrollment(id: number, email: string) {
    return this.http.post<Enrollment>(`${environment.baseUrl}/instructor/schools/${id}/students/enrollment`, { email: email });
  }

  getAppointmentsBySchoolId({ limit = undefined, offset = undefined}: { limit?: number, offset?: number} = {}, id: number): Observable<PagerEntity<Appointment[]>> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<PagerEntity<Appointment[]>>(`${environment.baseUrl}/instructor/schools/${id}/appointments`, { params });
  }

  postAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.baseUrl}/instructor/schools/${id}/appointments`, appointment);
  }

  putAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${environment.baseUrl}/instructor/schools/${id}/appointments/${appointment.id}`, appointment);
  }

  getAppointmentSubscriptions(id: number, appointmentId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${environment.baseUrl}/instructor/schools/${id}/appointments/${appointmentId}/subscriptions`);
  }

  getSubscriptionStudentDetail(id: number, appointmentId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/instructor/schools/${id}/appointments/${appointmentId}/students`);
  }

  private createFilterParams(limit: Number | undefined, offset: Number | undefined): HttpParams {
    let params = new HttpParams();
    if (this.filter.from && this.filter.from !== null) {
      params = params.append('from', moment(this.filter.from).format('YYYY-MM-DD'));
    }
    if (this.filter.to && this.filter.to !== null) {
      params = params.append('to', moment(this.filter.to).format('YYYY-MM-DD'));
    }
    if (this.filter.state) {
      params = params.append('state', this.filter.state);
    }

    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return params;
  }
}
