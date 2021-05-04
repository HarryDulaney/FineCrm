import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContactCategoryService } from '../service/contact-category.service';

import { ContactCategoryComponent } from './contact-category.component';

describe('Component Tests', () => {
  describe('ContactCategory Management Component', () => {
    let comp: ContactCategoryComponent;
    let fixture: ComponentFixture<ContactCategoryComponent>;
    let service: ContactCategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContactCategoryComponent],
      })
        .overrideTemplate(ContactCategoryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContactCategoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ContactCategoryService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.contactCategories?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
