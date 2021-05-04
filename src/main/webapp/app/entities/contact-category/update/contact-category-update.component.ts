import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IContactCategory, ContactCategory } from '../contact-category.model';
import { ContactCategoryService } from '../service/contact-category.service';

@Component({
  selector: 'jhi-contact-category-update',
  templateUrl: './contact-category-update.component.html',
})
export class ContactCategoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    categoryName: [null, [Validators.required]],
  });

  constructor(
    protected contactCategoryService: ContactCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contactCategory }) => {
      this.updateForm(contactCategory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contactCategory = this.createFromForm();
    if (contactCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.contactCategoryService.update(contactCategory));
    } else {
      this.subscribeToSaveResponse(this.contactCategoryService.create(contactCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContactCategory>>): void {
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

  protected updateForm(contactCategory: IContactCategory): void {
    this.editForm.patchValue({
      id: contactCategory.id,
      categoryName: contactCategory.categoryName,
    });
  }

  protected createFromForm(): IContactCategory {
    return {
      ...new ContactCategory(),
      id: this.editForm.get(['id'])!.value,
      categoryName: this.editForm.get(['categoryName'])!.value,
    };
  }
}
