import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContactCategoryComponent } from '../list/contact-category.component';
import { ContactCategoryDetailComponent } from '../detail/contact-category-detail.component';
import { ContactCategoryUpdateComponent } from '../update/contact-category-update.component';
import { ContactCategoryRoutingResolveService } from './contact-category-routing-resolve.service';

const contactCategoryRoute: Routes = [
  {
    path: '',
    component: ContactCategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContactCategoryDetailComponent,
    resolve: {
      contactCategory: ContactCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContactCategoryUpdateComponent,
    resolve: {
      contactCategory: ContactCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContactCategoryUpdateComponent,
    resolve: {
      contactCategory: ContactCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contactCategoryRoute)],
  exports: [RouterModule],
})
export class ContactCategoryRoutingModule {}
