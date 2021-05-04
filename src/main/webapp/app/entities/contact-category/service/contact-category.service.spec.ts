import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IContactCategory, ContactCategory } from '../contact-category.model';

import { ContactCategoryService } from './contact-category.service';

describe('Service Tests', () => {
  describe('ContactCategory Service', () => {
    let service: ContactCategoryService;
    let httpMock: HttpTestingController;
    let elemDefault: IContactCategory;
    let expectedResult: IContactCategory | IContactCategory[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ContactCategoryService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        categoryName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ContactCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ContactCategory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ContactCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            categoryName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ContactCategory', () => {
        const patchObject = Object.assign({}, new ContactCategory());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ContactCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            categoryName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ContactCategory', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addContactCategoryToCollectionIfMissing', () => {
        it('should add a ContactCategory to an empty array', () => {
          const contactCategory: IContactCategory = { id: 123 };
          expectedResult = service.addContactCategoryToCollectionIfMissing([], contactCategory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(contactCategory);
        });

        it('should not add a ContactCategory to an array that contains it', () => {
          const contactCategory: IContactCategory = { id: 123 };
          const contactCategoryCollection: IContactCategory[] = [
            {
              ...contactCategory,
            },
            { id: 456 },
          ];
          expectedResult = service.addContactCategoryToCollectionIfMissing(contactCategoryCollection, contactCategory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ContactCategory to an array that doesn't contain it", () => {
          const contactCategory: IContactCategory = { id: 123 };
          const contactCategoryCollection: IContactCategory[] = [{ id: 456 }];
          expectedResult = service.addContactCategoryToCollectionIfMissing(contactCategoryCollection, contactCategory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(contactCategory);
        });

        it('should add only unique ContactCategory to an array', () => {
          const contactCategoryArray: IContactCategory[] = [{ id: 123 }, { id: 456 }, { id: 1300 }];
          const contactCategoryCollection: IContactCategory[] = [{ id: 123 }];
          expectedResult = service.addContactCategoryToCollectionIfMissing(contactCategoryCollection, ...contactCategoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const contactCategory: IContactCategory = { id: 123 };
          const contactCategory2: IContactCategory = { id: 456 };
          expectedResult = service.addContactCategoryToCollectionIfMissing([], contactCategory, contactCategory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(contactCategory);
          expect(expectedResult).toContain(contactCategory2);
        });

        it('should accept null and undefined values', () => {
          const contactCategory: IContactCategory = { id: 123 };
          expectedResult = service.addContactCategoryToCollectionIfMissing([], null, contactCategory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(contactCategory);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
