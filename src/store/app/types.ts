export interface AppState {
  drawer: any;
  currentView: string;
  accounts: IAccount[];
  appReady: boolean;
  centrifugeConnectedFlag: boolean;
}
export interface IAccount {
  Id: string;
  Name: string;
}
