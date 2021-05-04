import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ContactCategoryComponent } from './list/contact-category.component';
import { ContactCategoryDetailComponent } from './detail/contact-category-detail.component';
import { ContactCategoryUpdateComponent } from './update/contact-category-update.component';
import { ContactCategoryDeleteDialogComponent } from './delete/contact-category-delete-dialog.component';
import { ContactCategoryRoutingModule } from './route/contact-category-routing.module';

@NgModule({
  imports: [SharedModule, ContactCategoryRoutingModule],
  declarations: [
    ContactCategoryComponent,
    ContactCategoryDetailComponent,
    ContactCategoryUpdateComponent,
    ContactCategoryDeleteDialogComponent,
  ],
  entryComponents: [ContactCategoryDeleteDialogComponent],
})
export class ContactCategoryModule {}
