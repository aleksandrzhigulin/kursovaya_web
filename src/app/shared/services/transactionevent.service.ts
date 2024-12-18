import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Transaction} from "../models/transaction.model";

@Injectable()
export class TransactionEventService {
  private transactionCreatedSource = new BehaviorSubject<Transaction | null>(null);
  private transactionUpdatedSource = new BehaviorSubject<Transaction | null>(null);

  transactionCreated$ = this.transactionCreatedSource.asObservable();
  transactionsUpdated$ = this.transactionUpdatedSource.asObservable();

  notifyTransactionCreated(transaction: Transaction) {
    this.transactionCreatedSource.next(transaction);
    this.transactionUpdatedSource.next(transaction);
  }

  notifyTransactionUpdated(transaction: Transaction | null) {
    this.transactionUpdatedSource.next(transaction);
  }
}
