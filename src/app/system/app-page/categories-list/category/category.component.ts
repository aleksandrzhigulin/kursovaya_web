import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {Category} from "../../../../shared/models/category.model";

@Component({
  selector: 'app-category',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  @Input() category: Category;
  @Output() edit = new EventEmitter<Category>();
  @Output() deleting = new EventEmitter<Category>();

  public constructor() {
    this.category = new Category('', '', '', 0);
  }

  editCategory() {
    this.edit.emit(this.category);
  }

  deleteCategory() {
    this.deleting.emit(this.category);
  }
}
