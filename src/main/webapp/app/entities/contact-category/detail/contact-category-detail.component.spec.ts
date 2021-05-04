import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ContactCategoryDetailComponent } from './contact-category-detail.component';

describe('Component Tests', () => {
  describe('ContactCategory Management Detail Component', () => {
    let comp: ContactCategoryDetailComponent;
    let fixture: ComponentFixture<ContactCategoryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ContactCategoryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ contactCategory: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ContactCategoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ContactCategoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load contactCategory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.contactCategory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
