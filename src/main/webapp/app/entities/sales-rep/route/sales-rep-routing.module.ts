import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalesRepComponent } from '../list/sales-rep.component';
import { SalesRepDetailComponent } from '../detail/sales-rep-detail.component';
import { SalesRepUpdateComponent } from '../update/sales-rep-update.component';
import { SalesRepRoutingResolveService } from './sales-rep-routing-resolve.service';

const salesRepRoute: Routes = [
  {
    path: '',
    component: SalesRepComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalesRepDetailComponent,
    resolve: {
      salesRep: SalesRepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalesRepUpdateComponent,
    resolve: {
      salesRep: SalesRepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalesRepUpdateComponent,
    resolve: {
      salesRep: SalesRepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salesRepRoute)],
  exports: [RouterModule],
})
export class SalesRepRoutingModule {}
