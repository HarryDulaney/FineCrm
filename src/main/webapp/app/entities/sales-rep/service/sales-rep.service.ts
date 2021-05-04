import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalesRep, getSalesRepIdentifier } from '../sales-rep.model';

export type EntityResponseType = HttpResponse<ISalesRep>;
export type EntityArrayResponseType = HttpResponse<ISalesRep[]>;

@Injectable({ providedIn: 'root' })
export class SalesRepService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sales-reps');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(salesRep: ISalesRep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesRep);
    return this.http
      .post<ISalesRep>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(salesRep: ISalesRep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesRep);
    return this.http
      .put<ISalesRep>(`${this.resourceUrl}/${getSalesRepIdentifier(salesRep) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(salesRep: ISalesRep): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(salesRep);
    return this.http
      .patch<ISalesRep>(`${this.resourceUrl}/${getSalesRepIdentifier(salesRep) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISalesRep>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISalesRep[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSalesRepToCollectionIfMissing(salesRepCollection: ISalesRep[], ...salesRepsToCheck: (ISalesRep | null | undefined)[]): ISalesRep[] {
    const salesReps: ISalesRep[] = salesRepsToCheck.filter(isPresent);
    if (salesReps.length > 0) {
      const salesRepCollectionIdentifiers = salesRepCollection.map(salesRepItem => getSalesRepIdentifier(salesRepItem)!);
      const salesRepsToAdd = salesReps.filter(salesRepItem => {
        const salesRepIdentifier = getSalesRepIdentifier(salesRepItem);
        if (salesRepIdentifier == null || salesRepCollectionIdentifiers.includes(salesRepIdentifier)) {
          return false;
        }
        salesRepCollectionIdentifiers.push(salesRepIdentifier);
        return true;
      });
      return [...salesRepsToAdd, ...salesRepCollection];
    }
    return salesRepCollection;
  }

  protected convertDateFromClient(salesRep: ISalesRep): ISalesRep {
    return Object.assign({}, salesRep, {
      startDate: salesRep.startDate?.isValid() ? salesRep.startDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((salesRep: ISalesRep) => {
        salesRep.startDate = salesRep.startDate ? dayjs(salesRep.startDate) : undefined;
      });
    }
    return res;
  }
}
