import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from 'src/app/core/services/student.service';
import { Note } from 'src/app/shared/domain/note';
import { PagerEntity } from 'src/app/shared/domain/pagerEntity';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-student-note',
  templateUrl: './student-note.component.html',
  styleUrls: ['./student-note.component.scss']
})
export class StudentNoteComponent implements OnDestroy, OnChanges {
  @Input()
  student: Student | undefined;

  @Input()
  type: string | undefined;

  @ViewChild('paginator') paginator: MatPaginator | undefined;

  displayAddNote = false;
  form: UntypedFormGroup;
  notes: Note[] = [];
  notesPagerEntity = new PagerEntity<Note[]>;
  mode: string = 'new';

  unsubscribe$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private studentService: StudentService
  ) {
    this.form = this.updateFormGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['student'] && changes['student'].currentValue) {
      if (this.type == 'actif') {
        this.loadStudentNotes(this.student?.id!);
      } else {
        this.loadArchivedStudentNotes(this.student?.id!);
      }
      
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadStudentNotes(studentId: number, offset: number | undefined = undefined, limit = 5) {
    if (!offset && this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.studentService.getNotesByStudentId({ limit, offset }, studentId).pipe(takeUntil(this.unsubscribe$)).subscribe((pagerEntity: PagerEntity<Note[]>) => {
      this.notesPagerEntity = pagerEntity;
      if (pagerEntity.entity) {
        this.notes = pagerEntity.entity;
      }
    });
  }

  loadArchivedStudentNotes(studentId: number, offset: number | undefined = undefined, limit = 5) {
    if (!offset && this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.studentService.getNotesByArchivedStudentId({ limit, offset }, studentId).pipe(takeUntil(this.unsubscribe$)).subscribe((pagerEntity: PagerEntity<Note[]>) => {
      this.notesPagerEntity = pagerEntity;
      if (pagerEntity.entity) {
        this.notes = pagerEntity.entity;
      }
    });
  }

  addNote() {
    this.mode = 'new';
    this.updateFormGroup();
    this.displayAddNote = true;
  }

  cancelAddNote() {
    this.displayAddNote = false;
  }

  handleNotePage(event: any) {
    let offset = event.pageIndex * event.pageSize;
    if (this.type == 'actif') {
      this.loadStudentNotes(this.student?.id!);
    } else {
      this.loadArchivedStudentNotes(this.student?.id!);
    }
  }

  saveNote() {
    if (this.form.valid) {
      if (this.mode == 'new') {
        const note = new Note();
        note.date = this.form.get('date')?.value;
        note.title = this.form.get('title')?.value;
        note.text = this.form.get('text')?.value;
        this.studentService.postNotesByStudentId(this.student?.id!, note).pipe(takeUntil(this.unsubscribe$)).subscribe((note: Note) => {
          this.loadStudentNotes(this.student?.id!);
        });
      } else {
          const note = this.notes.find((note: Note) => note.id == this.form.get('id')?.value);
          if (note){
            note.date = this.form.get('date')?.value;
            note.title = this.form.get('title')?.value;
            note.text = this.form.get('text')?.value;
            this.studentService.putNotesByStudentId(this.student?.id!, note).pipe(takeUntil(this.unsubscribe$)).subscribe((note: Note) => {
              this.loadStudentNotes(this.student?.id!);
            });
          }
      }
      this.displayAddNote = false;
    }
  }

  editNote(note: Note) {
    this.mode = 'edit';
    this.updateFormGroup(note);
    this.displayAddNote = true;
  }

  private updateFormGroup(note?: Note) {
    if (!note) {
      note = new Note();
      note.date = new Date();
    }
    
    this.form = this.fb.group({
      id: [note.id, Validators.nullValidator],
      date: [note.date, Validators.required],
      title: [note.title, Validators.nullValidator],
      text: [note.text, Validators.required],
    });
    return this.form;
  }

  removeNote(note: Note) {
    this.studentService.removeNoteByStudentId(note?.id!, this.student?.id!).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.loadStudentNotes(this.student?.id!);
    });
  }
}
