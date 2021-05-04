import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContactCategory, getContactCategoryIdentifier } from '../contact-category.model';

export type EntityResponseType = HttpResponse<IContactCategory>;
export type EntityArrayResponseType = HttpResponse<IContactCategory[]>;

@Injectable({ providedIn: 'root' })
export class ContactCategoryService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/contact-categories');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(contactCategory: IContactCategory): Observable<EntityResponseType> {
    return this.http.post<IContactCategory>(this.resourceUrl, contactCategory, { observe: 'response' });
  }

  update(contactCategory: IContactCategory): Observable<EntityResponseType> {
    return this.http.put<IContactCategory>(
      `${this.resourceUrl}/${getContactCategoryIdentifier(contactCategory) as number}`,
      contactCategory,
      { observe: 'response' }
    );
  }

  partialUpdate(contactCategory: IContactCategory): Observable<EntityResponseType> {
    return this.http.patch<IContactCategory>(
      `${this.resourceUrl}/${getContactCategoryIdentifier(contactCategory) as number}`,
      contactCategory,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContactCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContactCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContactCategoryToCollectionIfMissing(
    contactCategoryCollection: IContactCategory[],
    ...contactCategoriesToCheck: (IContactCategory | null | undefined)[]
  ): IContactCategory[] {
    const contactCategories: IContactCategory[] = contactCategoriesToCheck.filter(isPresent);
    if (contactCategories.length > 0) {
      const contactCategoryCollectionIdentifiers = contactCategoryCollection.map(
        contactCategoryItem => getContactCategoryIdentifier(contactCategoryItem)!
      );
      const contactCategoriesToAdd = contactCategories.filter(contactCategoryItem => {
        const contactCategoryIdentifier = getContactCategoryIdentifier(contactCategoryItem);
        if (contactCategoryIdentifier == null || contactCategoryCollectionIdentifiers.includes(contactCategoryIdentifier)) {
          return false;
        }
        contactCategoryCollectionIdentifiers.push(contactCategoryIdentifier);
        return true;
      });
      return [...contactCategoriesToAdd, ...contactCategoryCollection];
    }
    return contactCategoryCollection;
  }
}
