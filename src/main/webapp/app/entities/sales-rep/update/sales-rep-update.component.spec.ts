jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SalesRepService } from '../service/sales-rep.service';
import { ISalesRep, SalesRep } from '../sales-rep.model';

import { SalesRepUpdateComponent } from './sales-rep-update.component';

describe('Component Tests', () => {
  describe('SalesRep Management Update Component', () => {
    let comp: SalesRepUpdateComponent;
    let fixture: ComponentFixture<SalesRepUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let salesRepService: SalesRepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SalesRepUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SalesRepUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SalesRepUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      salesRepService = TestBed.inject(SalesRepService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const salesRep: ISalesRep = { id: 456 };

        activatedRoute.data = of({ salesRep });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(salesRep));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesRep = { id: 123 };
        spyOn(salesRepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesRep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salesRep }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(salesRepService.update).toHaveBeenCalledWith(salesRep);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesRep = new SalesRep();
        spyOn(salesRepService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesRep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salesRep }));
        saveSubject.complete();

        // THEN
        expect(salesRepService.create).toHaveBeenCalledWith(salesRep);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesRep = { id: 123 };
        spyOn(salesRepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesRep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(salesRepService.update).toHaveBeenCalledWith(salesRep);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
