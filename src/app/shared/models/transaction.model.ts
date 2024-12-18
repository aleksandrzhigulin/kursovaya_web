export class Transaction {
  constructor(public amount: number,
              public type: string,
              public description: string,
              public owner: string,
              public date: string,
              public categoryId: number,
              public id?: number) {

  }
}
