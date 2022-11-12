import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { Flight } from 'src/app/shared/domain/flight';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getFlightsByStudentId(id: number): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${environment.baseUrl}/instructor/students/${id}/flights`);
  }

  getControlSheetByStudentId(id: number): Observable<ControlSheet> {
    return this.http.get<ControlSheet>(`${environment.baseUrl}/instructor/students/${id}/control-sheet`);
  }

  postControlSheetByStudentId(id: number, controlSheet: ControlSheet): Observable<ControlSheet> {
    return this.http.post<ControlSheet>(`${environment.baseUrl}/instructor/students/${id}/control-sheet`, controlSheet);
  }

  removeStudent(id: number, schoolId: number) {
    return this.http.delete(`${environment.baseUrl}/instructor/schools/${schoolId}/students/${id}`);
  }
}
