export class CostCenter {
  public id: string;
  public code: string;
  public name: string;
  public discountPercent: number;

  constructor(id: string, code: string, name: string, discountPercent: number) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.discountPercent = discountPercent;
  }
}