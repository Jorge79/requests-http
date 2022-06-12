import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, empty, Observable, Subject } from 'rxjs';

import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import { AlertModalService } from 'src/app/shared/alert-modal/alert-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true,
})
export class CursosListaComponent implements OnInit {
  // cursos: Curso[] = [];
  // bsModalRef!: BsModalRef;
  cursos$!: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  cursoSelecionado: Curso;

  deleteModalRef!: BsModalRef;
  @ViewChild('deleteModal') deleteModal;

  constructor(
    private service: CursosService,
    private alertService: AlertModalService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    // this.service.list().subscribe((dados) => (this.cursos = dados));
    this.onRefresh();
  }

  onRefresh() {
    this.cursos$ = this.service.list().pipe(
      catchError((error) => {
        console.error(error);
        // this.error$.next(true);
        this.handleError();
        return empty();
      })
    );
  }

  handleError() {
    this.alertService.showAlertDanger(
      'Erro ao carregar cursos, tente novamente mais tarde'
    );
    // this.bsModalRef = this.modalService.show(AlertModalComponent);
    // this.bsModalRef.content.type = 'danger';
    // this.bsModalRef.content.message =
    //   'Erro ao carregar cursos, tente novamente mais tarde';
  }

  onEdit(id: number | null) {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(curso) {
    this.cursoSelecionado = curso;
    this.deleteModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-sm',
    });
  }

  onConfirmDelete() {
    this.service.remove(this.cursoSelecionado.id).subscribe(
      (success) => this.onRefresh(),
      (error) =>
        this.alertService.showAlertDanger(
          'Erro ao carregar cursos, tente novamente mais tarde'
        )
    );
  }

  onDeclineDelete() {
    this.deleteModalRef.hide();
  }
}
