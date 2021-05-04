jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPersona, Persona } from '../persona.model';
import { PersonaService } from '../service/persona.service';

import { PersonaRoutingResolveService } from './persona-routing-resolve.service';

describe('Service Tests', () => {
  describe('Persona routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PersonaRoutingResolveService;
    let service: PersonaService;
    let resultPersona: IPersona | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PersonaRoutingResolveService);
      service = TestBed.inject(PersonaService);
      resultPersona = undefined;
    });

    describe('resolve', () => {
      it('should return IPersona returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersona = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPersona).toEqual({ id: 123 });
      });

      it('should return new IPersona if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersona = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPersona).toEqual(new Persona());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersona = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPersona).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
