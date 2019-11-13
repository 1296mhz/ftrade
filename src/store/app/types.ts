export interface AppState {
  drawer: any;
  currentView: string;
  accounts: IAccount[];
  appReady: boolean;
  centrifugeConnectedFlag: boolean;
  currentAccount: IAccount;
}
export interface IAccount {
  Id: string;
  Name: string;
}

export interface IAccountCombobox {
  text: string;
  value: string;
}
