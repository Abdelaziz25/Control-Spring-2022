export class Node {
  private _name: string;
  private _weight: string;

  constructor(name: string, weight: string) {
    this._name = name;
    this._weight = weight;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
  get weight(): string {
    return this._weight;
  }

  set weight(value: string) {
    this._weight = value;
  }
}
