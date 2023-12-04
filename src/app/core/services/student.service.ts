import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';
import { Flight } from 'src/app/shared/domain/flight';
import { Note } from 'src/app/shared/domain/note';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getFlightsByStudentId({ limit = undefined, offset = undefined}: { limit?: number, offset?: number} = {}, id: number): Observable<PagerEntity<Flight[]>> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<PagerEntity<Flight[]>>(`${environment.baseUrl}/instructor/students/${id}/flights`, { params });
  }

  putFlightByStudentId(studentId: number, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${environment.baseUrl}/instructor/students/${studentId}/flights/${flight.id}`, flight);
  }

  getNotesByStudentId({ limit = undefined, offset = undefined}: { limit?: number, offset?: number} = {}, studentId: number): Observable<PagerEntity<Note[]>> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<PagerEntity<Note[]>>(`${environment.baseUrl}/instructor/students/${studentId}/notes`, { params });
  }

  postNotesByStudentId(studentId: number, note: Note): Observable<Note> {
    return this.http.post<Note>(`${environment.baseUrl}/instructor/students/${studentId}/notes`, note);
  }

  putNotesByStudentId(studentId: number, note: Note): Observable<Note> {
    return this.http.post<Note>(`${environment.baseUrl}/instructor/students/${studentId}/notes/${note.id}`, note);
  }

  removeNoteByStudentId(id: number, studentId: number) {
    return this.http.delete(`${environment.baseUrl}/instructor/students/${studentId}/notes/${id}`);
  }

  getControlSheetByStudentId(id: number): Observable<ControlSheet> {
    return this.http.get<ControlSheet>(`${environment.baseUrl}/instructor/students/${id}/control-sheet`);
  }

  getControlSheetByArchivedStudentId(id: number): Observable<ControlSheet> {
    return this.http.get<ControlSheet>(`${environment.baseUrl}/instructor/students/archived/${id}/control-sheet`);
  }

  postControlSheetByStudentId(id: number, controlSheet: ControlSheet): Observable<ControlSheet> {
    return this.http.post<ControlSheet>(`${environment.baseUrl}/instructor/students/${id}/control-sheet`, controlSheet);
  }

  archiveStudent(id: number) {
    return this.http.delete(`${environment.baseUrl}/instructor/students/${id}`);
  }

  private createFilterParams(limit: Number | undefined, offset: Number | undefined): HttpParams {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return params;
  }
}
