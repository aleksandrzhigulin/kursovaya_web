import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {Transaction} from "../../../../shared/models/transaction.model";
import {CategoryService} from "../../../../shared/services/category.service";
import {TransactionEventService} from "../../../../shared/services/transactionevent.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    NgClass, CommonModule
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {
  @Input({required: true}) transaction!: Transaction;
  @Output() edit = new EventEmitter<Transaction>();
  @Output() deleting = new EventEmitter<Transaction>();
  @Output() repeating = new EventEmitter<Transaction>();

  private transactionSubscription: Subscription | null = null;
  protected categoryName: string = "Неизвестная категория";

  public constructor(public categoryService: CategoryService,
                     private transactionEventService: TransactionEventService){

  }

  editTransaction() {
    this.edit.emit(this.transaction);
  }

  deleteTransaction() {
    this.deleting.emit(this.transaction);
  }

  repeatTransaction() {
    this.repeating.emit(this.transaction);
  }

  ngOnInit(): void {
    this.categoryService.getCategoryNameById(this.transaction.categoryId).subscribe((category) => {
      this.categoryName = category;
    })
    this.transactionEventService.transactionsUpdated$.subscribe((newTransaction) => {
      if (newTransaction?.id == this.transaction.id) {
        this.categoryService.getCategoryNameById(this.transaction.categoryId).subscribe((category) => {
          this.categoryName = category;
        })
      }
    })
  }

}
