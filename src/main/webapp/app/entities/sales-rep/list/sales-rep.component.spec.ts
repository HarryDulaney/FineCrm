import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SalesRepService } from '../service/sales-rep.service';

import { SalesRepComponent } from './sales-rep.component';

describe('Component Tests', () => {
  describe('SalesRep Management Component', () => {
    let comp: SalesRepComponent;
    let fixture: ComponentFixture<SalesRepComponent>;
    let service: SalesRepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SalesRepComponent],
      })
        .overrideTemplate(SalesRepComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SalesRepComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SalesRepService);

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
      expect(comp.salesReps?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
