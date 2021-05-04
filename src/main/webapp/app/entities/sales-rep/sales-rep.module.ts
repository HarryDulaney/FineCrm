import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SalesRepComponent } from './list/sales-rep.component';
import { SalesRepDetailComponent } from './detail/sales-rep-detail.component';
import { SalesRepUpdateComponent } from './update/sales-rep-update.component';
import { SalesRepDeleteDialogComponent } from './delete/sales-rep-delete-dialog.component';
import { SalesRepRoutingModule } from './route/sales-rep-routing.module';

@NgModule({
  imports: [SharedModule, SalesRepRoutingModule],
  declarations: [SalesRepComponent, SalesRepDetailComponent, SalesRepUpdateComponent, SalesRepDeleteDialogComponent],
  entryComponents: [SalesRepDeleteDialogComponent],
})
export class SalesRepModule {}
