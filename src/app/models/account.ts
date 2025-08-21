export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'Checking' | 'Savings';
  accountHolderName: string;
  balance: number;
  createdDate: Date;
}
