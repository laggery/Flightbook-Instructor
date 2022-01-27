import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/shared/domain/student';
import { Enrollment } from 'src/app/shared/domain/enrollment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getStudentsBySchoolId(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.baseUrl}/schools/${id}/students`);
  }

  postStudentsEnrollment(id: number, email: string) {
    return this.http.post<Enrollment>(`${environment.baseUrl}/schools/${id}/students/enrollment`, {email: email});
  }
}
