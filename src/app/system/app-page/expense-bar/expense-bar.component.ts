import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgStyle} from "@angular/common";
import {Category} from "../../../shared/models/category.model";
import {CategoryService} from "../../../shared/services/category.service";
import {TransactionService} from "../../../shared/services/transaction.service";
import {User} from "../../../shared/models/user.model";
import {Transaction} from "../../../shared/models/transaction.model";
import {forkJoin, of, Subscription} from "rxjs";
import {switchMap, tap} from "rxjs/operators";
import {CategoryEventService} from "../../../shared/services/categoryevent.service";
import {TransactionEventService} from "../../../shared/services/transactionevent.service";

@Component({
  selector: 'app-expense-bar',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle
  ],
  templateUrl: './expense-bar.component.html',
  styleUrls: ['./expense-bar.component.scss']
})
export class ExpenseBarComponent implements OnInit {
  @Input() filter: { from: Date; to: Date } | null = null; // Период фильтрации

  private transactionsUpdateSubscription: Subscription | null = null;
  private categorySubscription: Subscription | null = null;

  protected categories: Category[] = [];
  protected transactions: Transaction[] = [];
  protected catsMapping: Map<number, string> = new Map();
  protected expenseMap: Map<string, number> = new Map();
  protected incomeMap: Map<string, number> = new Map();
  protected totalExpenses: number = 0;
  protected totalIncome: number = 0;

  constructor(private categoryService: CategoryService,
              private transactionService: TransactionService,
              private categoryEventService: CategoryEventService,
              private transactionEventService: TransactionEventService) {
  }

  updateCategories() {
    const user: User = JSON.parse(<string>window.localStorage.getItem('user'));

    this.categoryService.findCategoriesByOwner(user.email).pipe(
      switchMap(categories => {
        this.categories = categories;

        const categoryNameRequests = categories.map(cat =>
          cat.id ? this.categoryService.getCategoryNameById(cat.id).pipe(
            tap(name => this.catsMapping.set(cat.id!, name))
          ) : of(null)
        );

        return forkJoin(categoryNameRequests);
      }),
      switchMap(() => this.transactionService.getTransactionsByOwner(user.email))
    ).subscribe({
      next: transactions => {
        this.transactions = transactions;
        this.calculateData(); // Выполняем расчёты
      },
      error: err => console.error("Ошибка загрузки данных:", err)
    });
  }

  ngOnInit(): void {
    this.updateCategories()
    this.categorySubscription = this.categoryEventService.categoriesUpdated$.subscribe(categories => {
      this.updateCategories();
    })

    this.transactionsUpdateSubscription = this.transactionEventService.transactionsUpdated$.subscribe(transaction => {
      this.updateCategories();
    })
  }

  private calculateData(): void {
    this.expenseMap.clear();
    this.incomeMap.clear();
    this.totalExpenses = 0;
    this.totalIncome = 0;

    // Применяем фильтр по датам
    const filteredTransactions = this.transactions.filter(transaction => {
      if (!this.filter) return true;
      const date = new Date(transaction.date);
      return (!this.filter.from || date >= this.filter.from) &&
        (!this.filter.to || date <= this.filter.to);
    });

    // Расчёт расходов и доходов по категориям
    for (const transaction of filteredTransactions) {
      const name = transaction.categoryId ? this.catsMapping.get(transaction.categoryId) : undefined;
      if (!name) continue;

      if (transaction.type === 'expense') {
        const currentSum = this.expenseMap.get(name) || 0;
        this.expenseMap.set(name, currentSum + Number(transaction.amount));
        this.totalExpenses += Number(transaction.amount);
      } else if (transaction.type === 'income') {
        const currentSum = this.incomeMap.get(name) || 0;
        this.incomeMap.set(name, currentSum + Number(transaction.amount));
        this.totalIncome += Number(transaction.amount);
      }
    }
  }

  getCategoryPercentage(category: Category, type: 'expense' | 'income'): number {
    if (!category.id) return 0;

    const name = this.catsMapping.get(category.id);
    const total = type === 'expense' ? this.totalExpenses : this.totalIncome;
    const map = type === 'expense' ? this.expenseMap : this.incomeMap;

    if (!name || total === 0) return 0;

    const value = map.get(name) || 0;
    return (value / total) * 100;
  }

  getBalancePercentage(): { income: number; expense: number } {
    const total = this.totalIncome + this.totalExpenses;
    if (total === 0) return {income: 0, expense: 0};

    return {
      income: (this.totalIncome / total) * 100,
      expense: (this.totalExpenses / total) * 100
    };
  }
}
