jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ContactCategoryService } from '../service/contact-category.service';

import { ContactCategoryDeleteDialogComponent } from './contact-category-delete-dialog.component';

describe('Component Tests', () => {
  describe('ContactCategory Management Delete Component', () => {
    let comp: ContactCategoryDeleteDialogComponent;
    let fixture: ComponentFixture<ContactCategoryDeleteDialogComponent>;
    let service: ContactCategoryService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactCategoryDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ContactCategoryDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ContactCategoryDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ContactCategoryService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
