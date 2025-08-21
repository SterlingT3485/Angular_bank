import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../models/account';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class BankingService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  accounts$ = this.accountsSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Load data from localStorage if available and in browser
    this.loadData();
  }

  // Create a new user account
  createAccount(accountHolderName: string, accountType: 'Checking' | 'Savings', initialBalance: number): Account {
    const accountNumber = this.generateAccountNumber();
    const newAccount: Account = {
      id: this.generateId(),
      accountNumber,
      accountType,
      accountHolderName,
      balance: initialBalance,
      createdDate: new Date()
    };

    const currentAccounts = this.accountsSubject.value;
    const updatedAccounts = [...currentAccounts, newAccount];
    this.accountsSubject.next(updatedAccounts);
    this.saveData();

    return newAccount;
  }

  // Transfer funds between accounts
  transferFunds(fromAccountId: string, toAccountId: string, amount: number, description: string = 'Transfer'): boolean {
    const accounts = this.accountsSubject.value;
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);

    if (!fromAccount || !toAccount || fromAccount.balance < amount || amount <= 0) {
      return false;
    }

    // Update balances
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    // Create transaction record
    const transaction: Transaction = {
      id: this.generateId(),
      fromAccountId,
      toAccountId,
      amount,
      transactionDate: new Date(),
      description,
      type: 'Transfer'
    };

    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...currentTransactions, transaction]);

    // Update accounts
    this.accountsSubject.next([...accounts]);
    this.saveData();

    return true;
  }

  // Get transaction history for a specific account
  getTransactionHistory(accountId: string): Observable<Transaction[]> {
    return new Observable(observer => {
      this.transactions$.subscribe(transactions => {
        const accountTransactions = transactions.filter(
          t => t.fromAccountId === accountId || t.toAccountId === accountId
        );
        observer.next(accountTransactions);
      });
    });
  }

  // Get account by ID
  getAccount(accountId: string): Account | undefined {
    return this.accountsSubject.value.find(acc => acc.id === accountId);
  }

  // Get all accounts
  getAccounts(): Account[] {
    return this.accountsSubject.value;
  }

  // Private utility methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  }

  private generateAccountNumber(): string {
    const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
    return randomNum.toString();
  }

  private saveData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bankingAccounts', JSON.stringify(this.accountsSubject.value));
      localStorage.setItem('bankingTransactions', JSON.stringify(this.transactionsSubject.value));
    }
  }

  private loadData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const accountsData = localStorage.getItem('bankingAccounts');
      const transactionsData = localStorage.getItem('bankingTransactions');

      if (accountsData) {
        const accounts = JSON.parse(accountsData);
        this.accountsSubject.next(accounts);
      }

      if (transactionsData) {
        const transactions = JSON.parse(transactionsData);
        this.transactionsSubject.next(transactions);
      }
    }
  }
}
