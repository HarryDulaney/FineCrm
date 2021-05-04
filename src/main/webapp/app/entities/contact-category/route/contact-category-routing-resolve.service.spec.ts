jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IContactCategory, ContactCategory } from '../contact-category.model';
import { ContactCategoryService } from '../service/contact-category.service';

import { ContactCategoryRoutingResolveService } from './contact-category-routing-resolve.service';

describe('Service Tests', () => {
  describe('ContactCategory routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ContactCategoryRoutingResolveService;
    let service: ContactCategoryService;
    let resultContactCategory: IContactCategory | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ContactCategoryRoutingResolveService);
      service = TestBed.inject(ContactCategoryService);
      resultContactCategory = undefined;
    });

    describe('resolve', () => {
      it('should return IContactCategory returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactCategory = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContactCategory).toEqual({ id: 123 });
      });

      it('should return new IContactCategory if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactCategory = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultContactCategory).toEqual(new ContactCategory());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContactCategory = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContactCategory).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
