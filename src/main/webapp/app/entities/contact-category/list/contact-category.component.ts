import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContactCategory } from '../contact-category.model';
import { ContactCategoryService } from '../service/contact-category.service';
import { ContactCategoryDeleteDialogComponent } from '../delete/contact-category-delete-dialog.component';

@Component({
  selector: 'jhi-contact-category',
  templateUrl: './contact-category.component.html',
})
export class ContactCategoryComponent implements OnInit {
  contactCategories?: IContactCategory[];
  isLoading = false;

  constructor(protected contactCategoryService: ContactCategoryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contactCategoryService.query().subscribe(
      (res: HttpResponse<IContactCategory[]>) => {
        this.isLoading = false;
        this.contactCategories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IContactCategory): number {
    return item.id!;
  }

  delete(contactCategory: IContactCategory): void {
    const modalRef = this.modalService.open(ContactCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contactCategory = contactCategory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
