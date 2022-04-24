import {LoopsNonTouching} from "./LoopsNonTouching";
import {GainBuilder} from "./GainBuilder";

export class FinalExpression {
  paths: String[][];
  frwdGains: String[][];
  loops: String [][];
  loopsGains: String[][];
  loopsGainsVals: GainBuilder[];

  numerator: String;
  denominator: String;

  constructor(paths: String[][], frwdGains: String[][], loops: String [][], loopsGains: String[][]) {
    this.paths = paths;
    this.loops = loops;
    this.frwdGains = frwdGains;
    this.loopsGains = loopsGains;

    this.loopsGainsVals = [];
    this.numerator = "";
    this.denominator = "";

    this.makeDenominator();
    this.makeNumerator();
  }

  private makeDenominator() {
    this.denominator += "1 - ( "

    for (let i = 0; i < this.loopsGains.length; i++) {
      this.loopsGainsVals.push(this.makeGain(this.loopsGains[i]));
      this.denominator += this.loopsGainsVals[i].makeString();

      if (i != this.loopsGains.length - 1)
        this.denominator += " + ";
      else this.denominator += " )";
    }

    let nonTouching = new LoopsNonTouching(this.loops);
    let i = 2;
    while (true) {
      let array = nonTouching.getNonTouching(i);
      if (array.length == 0) break;
      this.denominator += " + " + Math.pow(-1, i) + this.calcNonTouchingGain(array).toString();
      i++;
    }
  }

  private makeNumerator(){
    for (let i = 0; i <this.paths.length; i++) {

    }

  }

  private calcNonTouchingGain(array: number[][]): String {
    let result: String = "( ";
    for (let i = 0; i < array.length; i++) {
      let Builder = new GainBuilder(1, "");
      for (let j = 0; j < array[i].length; j++) {
        Builder.num *= this.loopsGainsVals[array[i][j]].num;
        Builder.str += this.loopsGainsVals[array[i][j]].str.toString();
      }

      result += " + " + Builder.makeString();
      if (i == array.length - 1) result += " ) ";
    }

    return result;
  }

  private makeGain(gain: String[]): GainBuilder {
    let Builder = new GainBuilder(1, "");

    for (let i = 0; i < gain.length; i++) {
      if (isNaN(parseInt(gain[i].toString(), 10))) {
        let char = gain[i];
        if (char.charAt(0) == '-') {
          Builder.num *= -1;
          Builder.str += char.slice(1, char.length - 1);
        } else {
          Builder.str += char.toString();
        }

      } else {
        Builder.num *= parseInt(gain[i].toString(), 10);
      }
    }
    return Builder;
  }
}
