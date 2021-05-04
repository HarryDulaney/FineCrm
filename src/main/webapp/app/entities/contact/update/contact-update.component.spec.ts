jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContactService } from '../service/contact.service';
import { IContact, Contact } from '../contact.model';
import { IContactCategory } from 'app/entities/contact-category/contact-category.model';
import { ContactCategoryService } from 'app/entities/contact-category/service/contact-category.service';
import { IPersona } from 'app/entities/persona/persona.model';
import { PersonaService } from 'app/entities/persona/service/persona.service';
import { ISalesRep } from 'app/entities/sales-rep/sales-rep.model';
import { SalesRepService } from 'app/entities/sales-rep/service/sales-rep.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { ContactUpdateComponent } from './contact-update.component';

describe('Component Tests', () => {
  describe('Contact Management Update Component', () => {
    let comp: ContactUpdateComponent;
    let fixture: ComponentFixture<ContactUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contactService: ContactService;
    let contactCategoryService: ContactCategoryService;
    let personaService: PersonaService;
    let salesRepService: SalesRepService;
    let companyService: CompanyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContactUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contactService = TestBed.inject(ContactService);
      contactCategoryService = TestBed.inject(ContactCategoryService);
      personaService = TestBed.inject(PersonaService);
      salesRepService = TestBed.inject(SalesRepService);
      companyService = TestBed.inject(CompanyService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call contactCategory query and add missing value', () => {
        const contact: IContact = { id: 456 };
        const contactCategory: IContactCategory = { id: 64166 };
        contact.contactCategory = contactCategory;

        const contactCategoryCollection: IContactCategory[] = [{ id: 92030 }];
        spyOn(contactCategoryService, 'query').and.returnValue(of(new HttpResponse({ body: contactCategoryCollection })));
        const expectedCollection: IContactCategory[] = [contactCategory, ...contactCategoryCollection];
        spyOn(contactCategoryService, 'addContactCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(contactCategoryService.query).toHaveBeenCalled();
        expect(contactCategoryService.addContactCategoryToCollectionIfMissing).toHaveBeenCalledWith(
          contactCategoryCollection,
          contactCategory
        );
        expect(comp.contactCategoriesCollection).toEqual(expectedCollection);
      });

      it('Should call persona query and add missing value', () => {
        const contact: IContact = { id: 456 };
        const persona: IPersona = { id: 13205 };
        contact.persona = persona;

        const personaCollection: IPersona[] = [{ id: 62944 }];
        spyOn(personaService, 'query').and.returnValue(of(new HttpResponse({ body: personaCollection })));
        const expectedCollection: IPersona[] = [persona, ...personaCollection];
        spyOn(personaService, 'addPersonaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(personaService.query).toHaveBeenCalled();
        expect(personaService.addPersonaToCollectionIfMissing).toHaveBeenCalledWith(personaCollection, persona);
        expect(comp.personasCollection).toEqual(expectedCollection);
      });

      it('Should call SalesRep query and add missing value', () => {
        const contact: IContact = { id: 456 };
        const salesRep: ISalesRep = { id: 31661 };
        contact.salesRep = salesRep;

        const salesRepCollection: ISalesRep[] = [{ id: 78170 }];
        spyOn(salesRepService, 'query').and.returnValue(of(new HttpResponse({ body: salesRepCollection })));
        const additionalSalesReps = [salesRep];
        const expectedCollection: ISalesRep[] = [...additionalSalesReps, ...salesRepCollection];
        spyOn(salesRepService, 'addSalesRepToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(salesRepService.query).toHaveBeenCalled();
        expect(salesRepService.addSalesRepToCollectionIfMissing).toHaveBeenCalledWith(salesRepCollection, ...additionalSalesReps);
        expect(comp.salesRepsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Company query and add missing value', () => {
        const contact: IContact = { id: 456 };
        const company: ICompany = { id: 75618 };
        contact.company = company;

        const companyCollection: ICompany[] = [{ id: 69039 }];
        spyOn(companyService, 'query').and.returnValue(of(new HttpResponse({ body: companyCollection })));
        const additionalCompanies = [company];
        const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
        spyOn(companyService, 'addCompanyToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(companyService.query).toHaveBeenCalled();
        expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(companyCollection, ...additionalCompanies);
        expect(comp.companiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const contact: IContact = { id: 456 };
        const contactCategory: IContactCategory = { id: 90755 };
        contact.contactCategory = contactCategory;
        const persona: IPersona = { id: 54636 };
        contact.persona = persona;
        const salesRep: ISalesRep = { id: 63420 };
        contact.salesRep = salesRep;
        const company: ICompany = { id: 67705 };
        contact.company = company;

        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(contact));
        expect(comp.contactCategoriesCollection).toContain(contactCategory);
        expect(comp.personasCollection).toContain(persona);
        expect(comp.salesRepsSharedCollection).toContain(salesRep);
        expect(comp.companiesSharedCollection).toContain(company);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contact = { id: 123 };
        spyOn(contactService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contact }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contactService.update).toHaveBeenCalledWith(contact);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contact = new Contact();
        spyOn(contactService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contact }));
        saveSubject.complete();

        // THEN
        expect(contactService.create).toHaveBeenCalledWith(contact);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contact = { id: 123 };
        spyOn(contactService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contactService.update).toHaveBeenCalledWith(contact);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackContactCategoryById', () => {
        it('Should return tracked ContactCategory primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackContactCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPersonaById', () => {
        it('Should return tracked Persona primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSalesRepById', () => {
        it('Should return tracked SalesRep primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSalesRepById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCompanyById', () => {
        it('Should return tracked Company primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCompanyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
