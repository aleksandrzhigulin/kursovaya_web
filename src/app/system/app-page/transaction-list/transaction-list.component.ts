import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MafinPopupComponent} from "../../shared/mafin-popup/mafin-popup.component";
import {Transaction} from "../../../shared/models/transaction.model";
import {TransactionComponent} from "./transaction/transaction.component";
import {TransactionService} from "../../../shared/services/transaction.service";
import {User} from "../../../shared/models/user.model";
import {Subscription} from "rxjs";
import {TransactionEventService} from "../../../shared/services/transactionevent.service";

import {
  AbstractControl, Form,
  FormBuilder, FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn, Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CategoryService} from "../../../shared/services/category.service";
import {Category} from "../../../shared/models/category.model";
import {CategoryEventService} from "../../../shared/services/categoryevent.service";
import {FilterDateEventService} from "../../../shared/services/filterdateevent.service";

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    MafinPopupComponent,
    TransactionComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements OnInit{
  @Output() transactionUpdated = new EventEmitter();

  protected categoryNames: Map<number, string> = new Map();
  private transactionsSubscription: Subscription | null = null;
  private transactionsUpdateSubscription: Subscription | null = null;

  protected transactionForm: FormGroup;
  protected filterForm: FormGroup;
  protected showCustomFilter: boolean = false;

  protected isPopupOpen: boolean = false;
  transactions: Transaction[] = [];
  categories: Category[] = [];

  public constructor(
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private transactionEventService: TransactionEventService,
    private categoryEventService: CategoryEventService,
    private filterDateEventService: FilterDateEventService,
    private fb: FormBuilder
  ) {
    let user: User = JSON.parse(<string>window.localStorage.getItem('user'));
    transactionService.getTransactionsByOwner(user.email).subscribe({
      next: result => {
        console.log(user.email)
        console.log(result)
        this.transactions = result;
      }
    })

    this.transactionForm = this.fb.group({
      money: [null, [Validators.required, this.positiveMoneyValidatorSync()]],
      category: [null, Validators.required],
      description: [''],
      date: [this.getTodayDate(), Validators.required],
      type: ['expense', Validators.required],
      transaction: []
    });

    this.filterForm = this.fb.group({
      from: [null],
      to: [null],
      filterType: ['7days']
    })
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  ngOnInit(): void {
    this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.transactionsSubscription = this.transactionEventService.transactionCreated$.subscribe((newTransaction) => {
      if (newTransaction) {
        this.transactions.push(newTransaction);
      }
    })


    this.transactionsUpdateSubscription = this.transactionEventService.transactionsUpdated$.subscribe((newTransaction) => {
      for (let transaction of this.transactions) {
        if (newTransaction && transaction.id == newTransaction.id) {
          transaction = newTransaction;
          let id = newTransaction.categoryId;
          this.categoryService.getCategoryNameById(newTransaction.categoryId).subscribe({
            next: result => {
              this.categoryNames.set(id, result)
            }
          })
        }
      }
      this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })

    this.categoryEventService.categoryDeleted$.subscribe(() => {
      console.log("categoryDeleted$ trans-list")
      let user = JSON.parse(<string>window.localStorage.getItem('user'));
      this.transactionService.getTransactionsByOwner(user.email).subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
        for (let i = 0; i < transactions.length; i++) {
          let trans: Transaction = transactions[i];
          this.categoryService.getCategoryNameById(trans.categoryId).subscribe({
            next: result => {
              if (trans.id != null) {
                this.categoryNames.set(trans.categoryId, result)
                this.transactionEventService.notifyTransactionUpdated(trans);
              }
            }
          })
        }
      })
    })
  }


  openPopup() {
    this.updateCategoriesList();
    this.isPopupOpen = true;
  }

  updateCategoriesList() {
    let user = JSON.parse(<string>window.localStorage.getItem('user'));
    this.categoryService.findCategoriesByOwner(user.email).subscribe({
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

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onTransactionEdit(transaction: Transaction) {
    this.transactionForm.patchValue({
      money: transaction.amount,
      category: transaction.categoryId,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type,
      transaction: transaction
    })
    this.openPopup()
  }

  updateTransaction() {
    let amount = this.transactionForm.value.money;
    let category = this.transactionForm.value.category;
    let description = this.transactionForm.value.description;
    let date = this.transactionForm.value.date;
    let type = this.transactionForm.value.type;
    let trans: Transaction = this.transactionForm.value.transaction;
    trans.amount = amount;
    trans.categoryId = category;
    trans.description = description;
    trans.date = date;
    trans.type = type;

    this.transactionService.updateTransaction(trans).subscribe({
      next: result => {
        this.closePopup()

      },
      error: err => {
        console.log(err);
      }
    })

    this.transactionEventService.notifyTransactionUpdated(trans);
    this.transactionUpdated.emit();
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionService.deleteTransaction(transaction).subscribe({
      next: result => {
        this.transactions = this.transactions.filter(t => t.id !== transaction.id);
        this.transactionEventService.notifyTransactionUpdated(transaction);
      }
    })
  }

  repeatTransaction(transaction: Transaction) {
    let newTransaction: Transaction = new Transaction(transaction.amount, transaction.type, transaction.description,
      transaction.owner, transaction.date, transaction.categoryId);
    this.transactionService.createTransaction(newTransaction).subscribe({
      next: result => {
        this.transactionEventService.notifyTransactionCreated(result);
        this.transactionEventService.notifyTransactionUpdated(result);
      }
    })
  }


  // Filtration
  onFilterChange(): void {
    let user = JSON.parse(<string>window.localStorage.getItem('user'));
    this.transactionService.getTransactionsByOwner(user.email).subscribe({
      next: result => {
        this.transactions = result;

        const { from, to, filterType } = this.filterForm.value;

        // Фильтрация по дате от и до
        if (from || to) {
          this.transactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date).getTime();
            const fromDate = from ? new Date(from).setHours(0, 0, 0, 0) : null;
            const toDate = to ? new Date(to).setHours(23, 59, 59, 999) : null;

            this.filterDateEventService.notifyDatesUpdated({from: fromDate, to: toDate});
            return (
              (fromDate === null || transactionDate >= fromDate) &&
              (toDate === null || transactionDate <= toDate)
            );
          });
        }
      }

    })
  }

  toggleCustomFilter() {
    this.showCustomFilter = !this.showCustomFilter;
  }

  applyFilter(type: string): void {
    const today = new Date();
    let startDate: Date = new Date();

    if (type === '7days') {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (type === '30days') {
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
    }

    if (startDate) {
      let user = JSON.parse(<string>window.localStorage.getItem('user'));
      this.transactionService.getTransactionsByOwner(user.email).subscribe({
        next: value => {
          this.transactions = value;
          this.transactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= today;
          });

          this.filterDateEventService.notifyDatesUpdated({from: startDate, to: today})
        }
      })
    }
  }
}
