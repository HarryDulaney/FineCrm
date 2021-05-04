import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contact',
        data: { pageTitle: 'fineCrmApp.contact.home.title' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'persona',
        data: { pageTitle: 'fineCrmApp.persona.home.title' },
        loadChildren: () => import('./persona/persona.module').then(m => m.PersonaModule),
      },
      {
        path: 'contact-category',
        data: { pageTitle: 'fineCrmApp.contactCategory.home.title' },
        loadChildren: () => import('./contact-category/contact-category.module').then(m => m.ContactCategoryModule),
      },
      {
        path: 'sales-rep',
        data: { pageTitle: 'fineCrmApp.salesRep.home.title' },
        loadChildren: () => import('./sales-rep/sales-rep.module').then(m => m.SalesRepModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'fineCrmApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
