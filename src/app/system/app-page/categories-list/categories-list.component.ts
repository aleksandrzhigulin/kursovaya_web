import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../../shared/models/category.model";
import {MafinPopupComponent} from "../../shared/mafin-popup/mafin-popup.component";
import {TransactionComponent} from "../transaction-list/transaction/transaction.component";
import {CategoryComponent} from "./category/category.component";
import {CategoryService} from "../../../shared/services/category.service";
import {User} from "../../../shared/models/user.model";
import {Subscription} from "rxjs";
import {CategoryEventService} from "../../../shared/services/categoryevent.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TransactionEventService} from "../../../shared/services/transactionevent.service";
import {Transaction} from "../../../shared/models/transaction.model";

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    MafinPopupComponent,
    TransactionComponent,
    CategoryComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  private categoriesSubscription: Subscription | null = null;
  protected isPopupOpen: boolean = false;
  protected categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private categoryEventService: CategoryEventService,
    private transactionEventService: TransactionEventService,
    private fb: FormBuilder) {

    let user: User = JSON.parse(<string>window.localStorage.getItem('user'));
    categoryService.findCategoriesByOwner(user.email).subscribe({
      next: result => {
        this.categories = result;
      },
      error: err => {
        console.log(err);
      }
    });

    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      categoryColor: [null, Validators.required],
      cat: []
    })
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  onEditCategory(category: Category) {
    this.categoryForm.setValue({
      categoryName: category.name,
      categoryColor: category.color,
      cat: category
    })
    this.isPopupOpen = true;
  }

  updateCategory() {
    let category: Category = this.categoryForm.value.cat;
    category.name = this.categoryForm.value.categoryName;
    category.color = this.categoryForm.value.categoryColor;

    this.categoryService.updateCategory(category).subscribe({
      next: result => {
        this.isPopupOpen = false;
        console.log("UPDATED")
        this.categoryEventService.notifyCategoriesUpdated(category);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onDeleteCategory(category: Category) {
    if (category.id === null || category.id === undefined) {
      return;
    }
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== category.id);
      this.categoryEventService.notifyCategoriesUpdated(category);
      this.transactionEventService.notifyTransactionUpdated(null);
      this.categoryEventService.notifyCategoryDeleted(category);
    });
  }

  protected readonly event = event;

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.categoriesSubscription = this.categoryEventService.categoryCreated$.subscribe((newCategory) => {
      if (newCategory) {
        this.categories.push(newCategory);
      }
    })
  }
}
