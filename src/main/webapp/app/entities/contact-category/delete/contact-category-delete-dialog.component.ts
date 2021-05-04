import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContactCategory } from '../contact-category.model';
import { ContactCategoryService } from '../service/contact-category.service';

@Component({
  templateUrl: './contact-category-delete-dialog.component.html',
})
export class ContactCategoryDeleteDialogComponent {
  contactCategory?: IContactCategory;

  constructor(protected contactCategoryService: ContactCategoryService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contactCategoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
