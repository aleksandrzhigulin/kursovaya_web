export class Category {
  constructor(
    public name: string,
    public color: string,
    public owner: string,
    public id?: number // Поле id есть
  ) {}
}
