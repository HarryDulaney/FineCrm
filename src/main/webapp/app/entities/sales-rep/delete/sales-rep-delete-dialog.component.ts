import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesRep } from '../sales-rep.model';
import { SalesRepService } from '../service/sales-rep.service';

@Component({
  templateUrl: './sales-rep-delete-dialog.component.html',
})
export class SalesRepDeleteDialogComponent {
  salesRep?: ISalesRep;

  constructor(protected salesRepService: SalesRepService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salesRepService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
