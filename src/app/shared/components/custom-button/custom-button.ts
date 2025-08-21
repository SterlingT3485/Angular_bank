import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.html',
  styleUrls: ['./custom-button.css']
})
export class CustomButtonComponent {
  @Input() text: string = '';
  @Input() type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' = 'primary';
  @Input() accountType: 'Checking' | 'Savings' | null = null;
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    let classes = 'btn';

    // Add size class
    if (this.size === 'sm') classes += ' btn-sm';
    if (this.size === 'lg') classes += ' btn-lg';

    // Add type-based classes
    if (this.accountType) {
      // Account type specific styling
      if (this.accountType === 'Checking') {
        classes += ' btn-checking';
      } else if (this.accountType === 'Savings') {
        classes += ' btn-savings';
      }
    } else {
      // Regular button types
      switch (this.type) {
        case 'primary':
          classes += ' btn-banking';
          break;
        case 'secondary':
          classes += ' btn-outline-secondary';
          break;
        case 'success':
          classes += ' btn-success';
          break;
        case 'danger':
          classes += ' btn-danger';
          break;
        case 'warning':
          classes += ' btn-warning';
          break;
        default:
          classes += ' btn-banking';
      }
    }

    return classes;
  }

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
