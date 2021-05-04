jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContactCategoryService } from '../service/contact-category.service';
import { IContactCategory, ContactCategory } from '../contact-category.model';

import { ContactCategoryUpdateComponent } from './contact-category-update.component';

describe('Component Tests', () => {
  describe('ContactCategory Management Update Component', () => {
    let comp: ContactCategoryUpdateComponent;
    let fixture: ComponentFixture<ContactCategoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contactCategoryService: ContactCategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactCategoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContactCategoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactCategoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contactCategoryService = TestBed.inject(ContactCategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const contactCategory: IContactCategory = { id: 456 };

        activatedRoute.data = of({ contactCategory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(contactCategory));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contactCategory = { id: 123 };
        spyOn(contactCategoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contactCategory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contactCategoryService.update).toHaveBeenCalledWith(contactCategory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contactCategory = new ContactCategory();
        spyOn(contactCategoryService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contactCategory }));
        saveSubject.complete();

        // THEN
        expect(contactCategoryService.create).toHaveBeenCalledWith(contactCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contactCategory = { id: 123 };
        spyOn(contactCategoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contactCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contactCategoryService.update).toHaveBeenCalledWith(contactCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
