import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IContactCategory, ContactCategory } from '../contact-category.model';
import { ContactCategoryService } from '../service/contact-category.service';

@Injectable({ providedIn: 'root' })
export class ContactCategoryRoutingResolveService implements Resolve<IContactCategory> {
  constructor(protected service: ContactCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContactCategory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((contactCategory: HttpResponse<ContactCategory>) => {
          if (contactCategory.body) {
            return of(contactCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ContactCategory());
  }
}
