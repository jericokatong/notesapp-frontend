import { Component, Input } from '@angular/core';

interface Note {
  id: string;
  title: string;
  body: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.css',
})
export class NoteComponent {
  @Input() note!: Note;
}
