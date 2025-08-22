import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankingService } from '../../services/banking';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];
  totalBalance: number = 0;

  constructor(
    private bankingService: BankingService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadAccounts();
    this.loadRecentTransactions();
  }

  loadAccounts() {
    this.bankingService.accounts$.subscribe(accounts => {
      this.accounts = accounts;
      this.calculateTotalBalance();
    });
  }

  loadRecentTransactions() {
    this.bankingService.transactions$.subscribe(transactions => {
      // Get the 5 most recent transactions
      this.recentTransactions = transactions
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
        .slice(0, 5);
    });
  }

  calculateTotalBalance() {
    this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  getAccountInfo(accountId: string): Account | undefined {
    return this.accounts.find(acc => acc.id === accountId);
  }

  navigateToCreateAccount() {
    this.router.navigate(['/create-account']);
  }

  navigateToTransfer() {
    if (this.accounts.length < 2) {
      alert('You need at least 2 accounts to make a transfer. Please create another account first.');
      return;
    }
    this.router.navigate(['/transfer']);
  }

  navigateToHistory() {
    this.router.navigate(['/history']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAccountTypeIcon(accountType: string): string {
    return accountType === 'Chequing' ? 'fas fa-check-circle' : 'fas fa-piggy-bank';
  }

  getTransactionIcon(transaction: Transaction): string {
    return 'fas fa-exchange-alt';
  }
}
