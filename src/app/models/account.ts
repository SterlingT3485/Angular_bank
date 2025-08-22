export interface Account {
  id: string;
  accountNumber: string;
  accountType: 'Chequing' | 'Savings';
  accountHolderName: string;
  balance: number;
  createdDate: Date;
}
