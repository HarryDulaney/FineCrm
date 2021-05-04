import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalesRepDetailComponent } from './sales-rep-detail.component';

describe('Component Tests', () => {
  describe('SalesRep Management Detail Component', () => {
    let comp: SalesRepDetailComponent;
    let fixture: ComponentFixture<SalesRepDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SalesRepDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ salesRep: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SalesRepDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SalesRepDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load salesRep on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.salesRep).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
