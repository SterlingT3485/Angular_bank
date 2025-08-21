import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { BankingService } from '../../services/banking';
import { Account } from '../../models/account';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  accounts: Account[] = [];
  isSubmitting = false;
  submitMessage = '';

  constructor(
    private fb: FormBuilder,
    private bankingService: BankingService,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    this.loadAccounts();
    this.setupFormValidation();
  }

  loadAccounts() {
    this.bankingService.accounts$.subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  setupFormValidation() {
    // Add custom validator to ensure from and to accounts are different
    this.transferForm.setValidators(this.differentAccountsValidator());

    // Watch for balance validation
    this.transferForm.get('amount')?.valueChanges.subscribe(() => {
      this.transferForm.updateValueAndValidity();
    });
    this.transferForm.get('fromAccountId')?.valueChanges.subscribe(() => {
      this.transferForm.updateValueAndValidity();
    });
  }

  get formControls() {
    return this.transferForm.controls;
  }

  get fromAccount(): Account | undefined {
    const fromAccountId = this.formControls['fromAccountId'].value;
    return this.accounts.find(acc => acc.id === fromAccountId);
  }

  get toAccount(): Account | undefined {
    const toAccountId = this.formControls['toAccountId'].value;
    return this.accounts.find(acc => acc.id === toAccountId);
  }

  get availableToAccounts(): Account[] {
    const fromAccountId = this.formControls['fromAccountId'].value;
    return this.accounts.filter(acc => acc.id !== fromAccountId);
  }

  differentAccountsValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const form = control as FormGroup;
      const fromAccount = form.get('fromAccountId')?.value;
      const toAccount = form.get('toAccountId')?.value;

      if (fromAccount && toAccount && fromAccount === toAccount) {
        return { sameAccount: true };
      }
      return null;
    };
  }

  get hasInsufficientBalance(): boolean {
    const amount = this.formControls['amount'].value;
    const fromAccount = this.fromAccount;
    return amount && fromAccount && amount > fromAccount.balance;
  }

  onSubmit() {
    if (this.transferForm.valid && !this.isSubmitting && !this.hasInsufficientBalance) {
      this.isSubmitting = true;
      const { fromAccountId, toAccountId, amount, description } = this.transferForm.value;

      const success = this.bankingService.transferFunds(
        fromAccountId,
        toAccountId,
        parseFloat(amount),
        description || 'Transfer'
      );

      if (success) {
        this.submitMessage = `Transfer of $${amount} completed successfully!`;
        this.transferForm.reset();

        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      } else {
        this.submitMessage = 'Transfer failed. Please check your account details and balance.';
      }

      this.isSubmitting = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.transferForm.controls).forEach(key => {
      const control = this.transferForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateBack() {
    this.router.navigate(['/dashboard']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
