import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankingService } from '../../services/banking';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {
  filterForm: FormGroup;
  accounts: Account[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedAccount: Account | null = null;

  constructor(
    private fb: FormBuilder,
    private bankingService: BankingService,
    public router: Router
  ) {
    this.filterForm = this.fb.group({
      accountId: [''],
      dateFrom: [''],
      dateTo: [''],
      transactionType: ['']
    });
  }

  ngOnInit() {
    this.loadAccounts();
    this.loadTransactions();
    this.setupFilters();
  }

  loadAccounts() {
    this.bankingService.accounts$.subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  loadTransactions() {
    this.bankingService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.applyFilters();
    });
  }

  setupFilters() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.transactions];
    const { accountId, dateFrom, dateTo, transactionType } = this.filterForm.value;

    // Filter by account
    if (accountId) {
      this.selectedAccount = this.accounts.find(acc => acc.id === accountId) || null;
      filtered = filtered.filter(t =>
        t.fromAccountId === accountId || t.toAccountId === accountId
      );
    } else {
      this.selectedAccount = null;
    }

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(t => new Date(t.transactionDate) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(t => new Date(t.transactionDate) <= toDate);
    }

    // Filter by transaction type
    if (transactionType) {
      filtered = filtered.filter(t => t.type === transactionType);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

    this.filteredTransactions = filtered;
  }

  getAccountInfo(accountId: string): Account | undefined {
    return this.accounts.find(acc => acc.id === accountId);
  }

  isIncomingTransaction(transaction: Transaction, accountId?: string): boolean {
    const targetAccountId = accountId || this.selectedAccount?.id;
    return targetAccountId ? transaction.toAccountId === targetAccountId : false;
  }

  isOutgoingTransaction(transaction: Transaction, accountId?: string): boolean {
    const targetAccountId = accountId || this.selectedAccount?.id;
    return targetAccountId ? transaction.fromAccountId === targetAccountId : false;
  }

  getTransactionTypeClass(transaction: Transaction): string {
    if (this.selectedAccount) {
      return this.isIncomingTransaction(transaction) ? 'text-success' : 'text-danger';
    }
    return 'text-primary';
  }

  getTransactionIcon(transaction: Transaction): string {
    if (this.selectedAccount) {
      return this.isIncomingTransaction(transaction) ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
    }
    return 'fas fa-exchange-alt';
  }

  // Add helper methods for template calculations
  getTotalReceived(): number {
    return this.filteredTransactions
      .filter(t => this.isIncomingTransaction(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalSent(): number {
    return this.filteredTransactions
      .filter(t => this.isOutgoingTransaction(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  clearFilters() {
    this.filterForm.reset();
  }

  navigateBack() {
    this.router.navigate(['/dashboard']);
  }

  navigateToTransfer() {
    this.router.navigate(['/transfer']);
  }

  navigateToCreateAccount() {
    this.router.navigate(['/create-account']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  exportTransactions() {
    if (this.filteredTransactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'From Account', 'To Account', 'Amount', 'Type', 'Description'];
    const csvContent = [
      headers.join(','),
      ...this.filteredTransactions.map(t => {
        const fromAccount = this.getAccountInfo(t.fromAccountId);
        const toAccount = this.getAccountInfo(t.toAccountId);
        return [
          `"${this.formatDate(t.transactionDate)}"`,
          `"${fromAccount?.accountNumber || 'Unknown'}"`,
          `"${toAccount?.accountNumber || 'Unknown'}"`,
          t.amount,
          t.type,
          `"${t.description}"`
        ].join(',');
      })
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
