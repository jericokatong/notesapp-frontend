import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { GlobalState } from '../global.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { selectAccessToken } from '../global.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.css',
})
export class CreateNoteComponent {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ global: GlobalState }>,
    private http: HttpClient,
    private router: Router
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: this.fb.array([this.fb.control('')]),
    });
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

  async onSubmit() {
    try {
      console.log(this.noteForm.value);

      const accessToken: string | null = await firstValueFrom(
        this.store.select(selectAccessToken)
      );

      console.log('ini akses token: ', accessToken);

      const headers: HttpHeaders = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      const response = await lastValueFrom(
        this.http.post('http://localhost:3000/notes', this.noteForm.value, {
          headers,
        })
      );

      console.log('ini response create note: ', response);

      this.router.navigate(['']);
    } catch (error) {
      console.log('ini error: ', error);
    }
  }
}
