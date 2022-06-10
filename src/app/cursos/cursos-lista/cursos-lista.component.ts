import { Component, OnInit } from '@angular/core';
import { CursosService } from '../cursos.service';
import { Curso } from '../curso';
import { catchError, empty, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  // cursos: Curso[] = [];

  cursos$!: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  constructor(private service: CursosService) {}

  ngOnInit() {
    // this.service.list().subscribe((dados) => (this.cursos = dados));
  }

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        this.error$.next(true);
        return empty();
      })
    );
  }
}
