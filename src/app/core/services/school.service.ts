import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from 'src/app/shared/domain/flight';
import { Student } from 'src/app/shared/domain/student';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getStudentsBySchoolId(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/schools/${id}/students`);
  }
}
