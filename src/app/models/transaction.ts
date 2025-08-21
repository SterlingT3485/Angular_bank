export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transactionDate: Date;
  description: string;
  type: 'Transfer' | 'Deposit' | 'Withdrawal';
}
