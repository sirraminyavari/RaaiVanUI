export interface IReduxActionCall {
  done?: (res?: any) => any;
  error?: (err?: string) => any;
}
