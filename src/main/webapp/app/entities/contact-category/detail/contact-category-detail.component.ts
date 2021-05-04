import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContactCategory } from '../contact-category.model';

@Component({
  selector: 'jhi-contact-category-detail',
  templateUrl: './contact-category-detail.component.html',
})
export class ContactCategoryDetailComponent implements OnInit {
  contactCategory: IContactCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contactCategory }) => {
      this.contactCategory = contactCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
