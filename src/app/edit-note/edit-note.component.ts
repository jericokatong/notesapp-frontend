import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { selectAccessToken } from '../global.selector';
import { concatMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor } from '@angular/common';

export interface DetailNote {
  id: string;
  title: string;
  body: string;
  tags: Array<string>;
}

@Component({
  selector: 'app-edit-note',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './edit-note.component.html',
  styleUrl: './edit-note.component.css',
})
export class EditNoteComponent {
  detailNote!: DetailNote;
  noteForm!: FormGroup;
  accessToken!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ global: GlobalState }>,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    const noteId = route.snapshot.params['id'];

    console.log('ini note id: ', noteId);

    store
      .select(selectAccessToken)
      .pipe(
        tap((accessToken: any) => {
          console.log('ini response access token: ', accessToken);
          this.accessToken = accessToken;
        }),
        // ambil akses token
        concatMap((accessToken: any) => {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          });
          return http.get(`${environment.apiUrl}/notes/${noteId}`, {
            headers,
          });
        }),
        // simpan detail note pada data member
        tap((detailNote: any) => {
          console.log('ini response note detail: ', detailNote);
          this.detailNote = detailNote.data.note;
          this.noteForm = this.fb.group({
            title: [this.detailNote.title || '', Validators.required],
            body: [this.detailNote.body || '', Validators.required],
            tags: this.fb.array(
              this.detailNote.tags.map((tag: string) => this.fb.control(tag))
            ),
          });
        })
      )
      .subscribe();
  }

  get tags() {
    return this.noteForm.get('tags') as FormArray;
  }

  addTag() {
    this.tags.push(this.fb.control(''));
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  onSubmit() {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    this.http
      .put(
        `${environment.apiUrl}/notes/${this.detailNote.id}`,
        this.noteForm.value,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          console.log('ini response berhasil edit note component: ', response);
          this.router.navigate(['']);
        },
        error: (response: any) => {
          console.log('ini error edit note component: ', response);
        },
      });
  }
}
