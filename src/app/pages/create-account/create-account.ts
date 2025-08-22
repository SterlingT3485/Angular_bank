import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankingService } from '../../services/banking';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.css']
})
export class CreateAccountComponent {
  accountForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';

  constructor(
    private fb: FormBuilder,
    private bankingService: BankingService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      accountType: ['Chequing', Validators.required]
    });
  }

  get formControls() {
    return this.accountForm.controls;
  }

  onSubmit() {
    // Early return if form is not ready for submission - prevents any error flashing
    if (this.accountForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const { accountHolderName, accountType, initialBalance } = this.accountForm.value;

    try {
      const newAccount = this.bankingService.createAccount(
        accountHolderName,
        accountType,
        initialBalance
      );

      this.submitMessage = `Account created successfully! Account Number: ${newAccount.accountNumber}`;

      // Reset form
      this.accountForm.reset({
        accountType: 'Chequing',
        initialBalance: 0
      });

      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error) {
      this.submitMessage = 'Error creating account. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  navigateBack() {
    this.router.navigate(['/dashboard']);
  }
}
