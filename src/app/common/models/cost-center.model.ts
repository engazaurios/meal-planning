export class CostCenter {
  public id: string;
  public code: string;
  public name: string;

  constructor(id: string, code: string, name: string) {
    this.id = id;
    this.code = code;
    this.name = name;
  }
}