export interface TxHistoryModel {
  position: number;
  date: Date;
  amount: number;
  type: TxHistoryType;
}

export enum TxHistoryType {
  Deposit,
  Withdraw,
  Send,
  Receive
}