import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISalesRep, SalesRep } from '../sales-rep.model';

import { SalesRepService } from './sales-rep.service';

describe('Service Tests', () => {
  describe('SalesRep Service', () => {
    let service: SalesRepService;
    let httpMock: HttpTestingController;
    let elemDefault: ISalesRep;
    let expectedResult: ISalesRep | ISalesRep[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SalesRepService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        email: 'AAAAAAA',
        generatedRevenue: 0,
        commissionOwed: 0,
        startDate: currentDate,
        region: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a SalesRep', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.create(new SalesRep()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SalesRep', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            generatedRevenue: 1,
            commissionOwed: 1,
            startDate: currentDate.format(DATE_FORMAT),
            region: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SalesRep', () => {
        const patchObject = Object.assign(
          {
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            region: 'BBBBBB',
          },
          new SalesRep()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SalesRep', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            generatedRevenue: 1,
            commissionOwed: 1,
            startDate: currentDate.format(DATE_FORMAT),
            region: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a SalesRep', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSalesRepToCollectionIfMissing', () => {
        it('should add a SalesRep to an empty array', () => {
          const salesRep: ISalesRep = { id: 123 };
          expectedResult = service.addSalesRepToCollectionIfMissing([], salesRep);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salesRep);
        });

        it('should not add a SalesRep to an array that contains it', () => {
          const salesRep: ISalesRep = { id: 123 };
          const salesRepCollection: ISalesRep[] = [
            {
              ...salesRep,
            },
            { id: 456 },
          ];
          expectedResult = service.addSalesRepToCollectionIfMissing(salesRepCollection, salesRep);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SalesRep to an array that doesn't contain it", () => {
          const salesRep: ISalesRep = { id: 123 };
          const salesRepCollection: ISalesRep[] = [{ id: 456 }];
          expectedResult = service.addSalesRepToCollectionIfMissing(salesRepCollection, salesRep);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salesRep);
        });

        it('should add only unique SalesRep to an array', () => {
          const salesRepArray: ISalesRep[] = [{ id: 123 }, { id: 456 }, { id: 14604 }];
          const salesRepCollection: ISalesRep[] = [{ id: 123 }];
          expectedResult = service.addSalesRepToCollectionIfMissing(salesRepCollection, ...salesRepArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const salesRep: ISalesRep = { id: 123 };
          const salesRep2: ISalesRep = { id: 456 };
          expectedResult = service.addSalesRepToCollectionIfMissing([], salesRep, salesRep2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salesRep);
          expect(expectedResult).toContain(salesRep2);
        });

        it('should accept null and undefined values', () => {
          const salesRep: ISalesRep = { id: 123 };
          expectedResult = service.addSalesRepToCollectionIfMissing([], null, salesRep, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salesRep);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
