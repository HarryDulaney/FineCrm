jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISalesRep, SalesRep } from '../sales-rep.model';
import { SalesRepService } from '../service/sales-rep.service';

import { SalesRepRoutingResolveService } from './sales-rep-routing-resolve.service';

describe('Service Tests', () => {
  describe('SalesRep routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SalesRepRoutingResolveService;
    let service: SalesRepService;
    let resultSalesRep: ISalesRep | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SalesRepRoutingResolveService);
      service = TestBed.inject(SalesRepService);
      resultSalesRep = undefined;
    });

    describe('resolve', () => {
      it('should return ISalesRep returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesRep = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalesRep).toEqual({ id: 123 });
      });

      it('should return new ISalesRep if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesRep = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSalesRep).toEqual(new SalesRep());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesRep = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalesRep).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
