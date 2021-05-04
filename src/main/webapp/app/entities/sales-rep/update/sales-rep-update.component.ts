import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISalesRep, SalesRep } from '../sales-rep.model';
import { SalesRepService } from '../service/sales-rep.service';

@Component({
  selector: 'jhi-sales-rep-update',
  templateUrl: './sales-rep-update.component.html',
})
export class SalesRepUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required]],
    generatedRevenue: [],
    commissionOwed: [],
    startDate: [],
    region: [],
  });

  constructor(protected salesRepService: SalesRepService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesRep }) => {
      this.updateForm(salesRep);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salesRep = this.createFromForm();
    if (salesRep.id !== undefined) {
      this.subscribeToSaveResponse(this.salesRepService.update(salesRep));
    } else {
      this.subscribeToSaveResponse(this.salesRepService.create(salesRep));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalesRep>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(salesRep: ISalesRep): void {
    this.editForm.patchValue({
      id: salesRep.id,
      firstName: salesRep.firstName,
      lastName: salesRep.lastName,
      email: salesRep.email,
      generatedRevenue: salesRep.generatedRevenue,
      commissionOwed: salesRep.commissionOwed,
      startDate: salesRep.startDate,
      region: salesRep.region,
    });
  }

  protected createFromForm(): ISalesRep {
    return {
      ...new SalesRep(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      generatedRevenue: this.editForm.get(['generatedRevenue'])!.value,
      commissionOwed: this.editForm.get(['commissionOwed'])!.value,
      startDate: this.editForm.get(['startDate'])!.value,
      region: this.editForm.get(['region'])!.value,
    };
  }
}
