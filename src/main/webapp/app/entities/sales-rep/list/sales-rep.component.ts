import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesRep } from '../sales-rep.model';
import { SalesRepService } from '../service/sales-rep.service';
import { SalesRepDeleteDialogComponent } from '../delete/sales-rep-delete-dialog.component';

@Component({
  selector: 'jhi-sales-rep',
  templateUrl: './sales-rep.component.html',
})
export class SalesRepComponent implements OnInit {
  salesReps?: ISalesRep[];
  isLoading = false;

  constructor(protected salesRepService: SalesRepService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.salesRepService.query().subscribe(
      (res: HttpResponse<ISalesRep[]>) => {
        this.isLoading = false;
        this.salesReps = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISalesRep): number {
    return item.id!;
  }

  delete(salesRep: ISalesRep): void {
    const modalRef = this.modalService.open(SalesRepDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.salesRep = salesRep;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
