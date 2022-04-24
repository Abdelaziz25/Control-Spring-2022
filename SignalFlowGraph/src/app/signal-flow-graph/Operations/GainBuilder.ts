export class GainBuilder {
  num: number;
  str: String;

  constructor(num: number, str: String) {
    this.num = num;
    this.str = str;
  }

  makeString(): string {
    if (this.num == 1) {
      if(this.str == "") return "1" ;
      return this.str.toString();
    }
    else if (this.num == -1) {
      if(this.str == "") return "-1" ;
      return '-' + this.str;
    }
    else return this.num.toString() + this.str;
  }
}
