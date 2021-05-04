import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalesRep } from '../sales-rep.model';

@Component({
  selector: 'jhi-sales-rep-detail',
  templateUrl: './sales-rep-detail.component.html',
})
export class SalesRepDetailComponent implements OnInit {
  salesRep: ISalesRep | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesRep }) => {
      this.salesRep = salesRep;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
