import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersona } from '../persona.model';
import { PersonaService } from '../service/persona.service';
import { PersonaDeleteDialogComponent } from '../delete/persona-delete-dialog.component';

@Component({
  selector: 'jhi-persona',
  templateUrl: './persona.component.html',
})
export class PersonaComponent implements OnInit {
  personas?: IPersona[];
  isLoading = false;

  constructor(protected personaService: PersonaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.personaService.query().subscribe(
      (res: HttpResponse<IPersona[]>) => {
        this.isLoading = false;
        this.personas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPersona): number {
    return item.id!;
  }

  delete(persona: IPersona): void {
    const modalRef = this.modalService.open(PersonaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.persona = persona;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
