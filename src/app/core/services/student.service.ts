import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from 'src/app/shared/domain/flight';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getFlightsByStudentId(id: number): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${environment.baseUrl}/students/${id}/flights`);
  }
}
