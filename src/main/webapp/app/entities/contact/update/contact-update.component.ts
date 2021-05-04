import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContact, Contact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { IContactCategory } from 'app/entities/contact-category/contact-category.model';
import { ContactCategoryService } from 'app/entities/contact-category/service/contact-category.service';
import { IPersona } from 'app/entities/persona/persona.model';
import { PersonaService } from 'app/entities/persona/service/persona.service';
import { ISalesRep } from 'app/entities/sales-rep/sales-rep.model';
import { SalesRepService } from 'app/entities/sales-rep/service/sales-rep.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-contact-update',
  templateUrl: './contact-update.component.html',
})
export class ContactUpdateComponent implements OnInit {
  isSaving = false;

  contactCategoriesCollection: IContactCategory[] = [];
  personasCollection: IPersona[] = [];
  salesRepsSharedCollection: ISalesRep[] = [];
  companiesSharedCollection: ICompany[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required]],
    phoneNumber: [],
    linkedInProfile: [],
    mailingAddress: [],
    connectDate: [],
    jobTitle: [],
    language: [],
    vip: [],
    affiliate: [],
    zipCode: [],
    contactCategory: [],
    persona: [],
    salesRep: [],
    company: [],
  });

  constructor(
    protected contactService: ContactService,
    protected contactCategoryService: ContactCategoryService,
    protected personaService: PersonaService,
    protected salesRepService: SalesRepService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contact }) => {
      this.updateForm(contact);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  trackContactCategoryById(index: number, item: IContactCategory): number {
    return item.id!;
  }

  trackPersonaById(index: number, item: IPersona): number {
    return item.id!;
  }

  trackSalesRepById(index: number, item: ISalesRep): number {
    return item.id!;
  }

  trackCompanyById(index: number, item: ICompany): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
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

  protected updateForm(contact: IContact): void {
    this.editForm.patchValue({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      linkedInProfile: contact.linkedInProfile,
      mailingAddress: contact.mailingAddress,
      connectDate: contact.connectDate,
      jobTitle: contact.jobTitle,
      language: contact.language,
      vip: contact.vip,
      affiliate: contact.affiliate,
      zipCode: contact.zipCode,
      contactCategory: contact.contactCategory,
      persona: contact.persona,
      salesRep: contact.salesRep,
      company: contact.company,
    });

    this.contactCategoriesCollection = this.contactCategoryService.addContactCategoryToCollectionIfMissing(
      this.contactCategoriesCollection,
      contact.contactCategory
    );
    this.personasCollection = this.personaService.addPersonaToCollectionIfMissing(this.personasCollection, contact.persona);
    this.salesRepsSharedCollection = this.salesRepService.addSalesRepToCollectionIfMissing(
      this.salesRepsSharedCollection,
      contact.salesRep
    );
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing(this.companiesSharedCollection, contact.company);
  }

  protected loadRelationshipsOptions(): void {
    this.contactCategoryService
      .query({ filter: 'contact-is-null' })
      .pipe(map((res: HttpResponse<IContactCategory[]>) => res.body ?? []))
      .pipe(
        map((contactCategories: IContactCategory[]) =>
          this.contactCategoryService.addContactCategoryToCollectionIfMissing(
            contactCategories,
            this.editForm.get('contactCategory')!.value
          )
        )
      )
      .subscribe((contactCategories: IContactCategory[]) => (this.contactCategoriesCollection = contactCategories));

    this.personaService
      .query({ filter: 'contact-is-null' })
      .pipe(map((res: HttpResponse<IPersona[]>) => res.body ?? []))
      .pipe(
        map((personas: IPersona[]) => this.personaService.addPersonaToCollectionIfMissing(personas, this.editForm.get('persona')!.value))
      )
      .subscribe((personas: IPersona[]) => (this.personasCollection = personas));

    this.salesRepService
      .query()
      .pipe(map((res: HttpResponse<ISalesRep[]>) => res.body ?? []))
      .pipe(
        map((salesReps: ISalesRep[]) =>
          this.salesRepService.addSalesRepToCollectionIfMissing(salesReps, this.editForm.get('salesRep')!.value)
        )
      )
      .subscribe((salesReps: ISalesRep[]) => (this.salesRepsSharedCollection = salesReps));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing(companies, this.editForm.get('company')!.value))
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }

  protected createFromForm(): IContact {
    return {
      ...new Contact(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      linkedInProfile: this.editForm.get(['linkedInProfile'])!.value,
      mailingAddress: this.editForm.get(['mailingAddress'])!.value,
      connectDate: this.editForm.get(['connectDate'])!.value,
      jobTitle: this.editForm.get(['jobTitle'])!.value,
      language: this.editForm.get(['language'])!.value,
      vip: this.editForm.get(['vip'])!.value,
      affiliate: this.editForm.get(['affiliate'])!.value,
      zipCode: this.editForm.get(['zipCode'])!.value,
      contactCategory: this.editForm.get(['contactCategory'])!.value,
      persona: this.editForm.get(['persona'])!.value,
      salesRep: this.editForm.get(['salesRep'])!.value,
      company: this.editForm.get(['company'])!.value,
    };
  }
}
