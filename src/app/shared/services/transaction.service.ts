import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable()
export class TransactionService {
  private readonly apiUrl = 'http://localhost:3000/transactions';

  constructor(private http: HttpClient) {}

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  getTransactionsByOwner(owner: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?owner=${owner}`);
  }

  deleteTransactionById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteTransaction(transaction: Transaction) {
    return this.http.delete(`${this.apiUrl}/${transaction.id}`);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  repeatTransaction(transaction: Transaction): Observable<Transaction> {
    const newTransaction: Omit<Transaction, 'id'> = {
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      owner: transaction.owner,
      date: transaction.date,
      categoryId: transaction.categoryId
    };
    return this.createTransaction(newTransaction);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionsByType(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?type=${type}`);
  }

  getTransactionsByCategory(categoryId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  getTotalAmountByOwner(owner: string): Observable<number> {
    return this.getTransactionsByOwner(owner).pipe(
      map(transactions => transactions.reduce((total, transaction) => total + transaction.amount, 0))
    );
  }
}
