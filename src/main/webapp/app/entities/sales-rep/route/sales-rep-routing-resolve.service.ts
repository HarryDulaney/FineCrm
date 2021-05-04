import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISalesRep, SalesRep } from '../sales-rep.model';
import { SalesRepService } from '../service/sales-rep.service';

@Injectable({ providedIn: 'root' })
export class SalesRepRoutingResolveService implements Resolve<ISalesRep> {
  constructor(protected service: SalesRepService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISalesRep> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((salesRep: HttpResponse<SalesRep>) => {
          if (salesRep.body) {
            return of(salesRep.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SalesRep());
  }
}
