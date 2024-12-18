import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {User} from "../../../shared/models/user.model";
import {AuthService} from "../../../shared/services/auth.service";
import {MafinPopupComponent} from "../mafin-popup/mafin-popup.component";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {CategoryService} from "../../../shared/services/category.service";
import {Category} from "../../../shared/models/category.model";
import {HttpClientModule} from "@angular/common/http";
import {UsersService} from "../../../shared/services/users.service";
import {CategoryEventService} from "../../../shared/services/categoryevent.service";
import {CategoryComponent} from "../../app-page/categories-list/category/category.component";
import {NgIf} from "@angular/common";
import {Transaction} from "../../../shared/models/transaction.model";
import {TransactionService} from "../../../shared/services/transaction.service";
import {TransactionEventService} from "../../../shared/services/transactionevent.service";

@Component({
  selector: 'app-mafin-sidebar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    MafinPopupComponent,
    SharedModule,
    HttpClientModule,
    CategoryComponent,
    NgIf
  ],
  providers: [UsersService, AuthService],
  templateUrl: './mafin-sidebar.component.html',
  styleUrl: './mafin-sidebar.component.scss'
})
export class MafinSidebarComponent {
  user: User;

  protected categories: Category[] = [];

  protected categoryForm: FormGroup;
  protected transactionForm: FormGroup;

  public sidebarShow: boolean = false;
  public isCreateCategoryPopupOpen: boolean = false;
  public isCreateTransactionPopupOpen: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private categoryService: CategoryService,
              private categoryEventService: CategoryEventService,
              private transactionService: TransactionService,
              private transactionEventService: TransactionEventService
  ) {
    this.user = JSON.parse(<string>window.localStorage.getItem('user'));

    // Forms
    this.categoryForm = this.fb.group({
      categoryName: [null, Validators.required],
      categoryColor: [null, Validators.required],
    })

    this.transactionForm = this.fb.group({
      money: [null, [Validators.required, this.positiveMoneyValidatorSync()]],
      category: [null, Validators.required],
      description: [''],
      date: [this.getTodayDate(), Validators.required],
      type: ['expense', Validators.required],
    });
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }

  closeCategoryPopup() {
    this.isCreateCategoryPopupOpen = false;
  }

  openCategoryPopup() {
    this.isCreateCategoryPopupOpen = true;
  }

  closeTransactionPopup() {
    this.isCreateTransactionPopupOpen = false;
  }

  openTransactionPopup() {
    this.updateCategoriesList();
    this.isCreateTransactionPopupOpen = true;
  }

  createCategory() {
    let name: string = this.categoryForm.value.categoryName;
    let color: string = this.categoryForm.value.categoryColor;
    let username: string | undefined = this.user.email;

    let category: Category = new Category(name, color, username);
    this.categoryService.createCategory(category).subscribe({
      next: category => {
        this.categoryEventService.notifyCategoryCreated(category);
      }
    });
    this.closeCategoryPopup()
  }

  updateCategoriesList() {
    this.categoryService.findCategoriesByOwner(this.user.email).subscribe({
      next: result => {
        this.categories = result;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  positiveMoneyValidatorSync(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value > 0 ? null : {min: true};
    };
  }

  createTransaction() {
    let money: number = this.transactionForm.value.money;
    let type: string = this.transactionForm.value.type;
    let description: string = this.transactionForm.value.description;
    let owner: string = this.user.email;
    let categoryId: number = this.transactionForm.value.category;
    let date: string = this.transactionForm.value.date;
    let transaction: Transaction = new Transaction(money, type, description, owner, date, categoryId);

    this.transactionService.createTransaction(transaction).subscribe({
      next: result => {
        this.closeTransactionPopup();
      },
      error: err => {
        console.log(err);
      }
    })

    this.transactionEventService.notifyTransactionCreated(transaction);
  }

  protected readonly Object = Object;
}
