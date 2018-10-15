export class Result {
  resultCode: string;
  resultData: any;
  errorMsg: string;

  public isSuccess(): boolean {
    return this.resultCode === 'SUCCESS';
  }
}
