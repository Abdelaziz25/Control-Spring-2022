import {LoopsNonTouching} from "./LoopsNonTouching";
import {GainBuilder} from "./GainBuilder";
import {PathsNonTouching} from "./PathsNonTouching";

export class FinalExpression {
  paths: String[][];
  frwdGains: String[][];
  pathsGainsVals: GainBuilder[];
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
    this.pathsGainsVals = [];
    this.numerator = "";
    this.denominator = "";

    this.makeDenominator();
    this.makeNumerator();
  }

  private makeDenominator() {
    this.denominator += "1"
    if(this.loopsGains.length == 0)
      return;
    
    this.denominator += " - ("

    for (let i = 0; i < this.loopsGains.length; i++) {
      this.loopsGainsVals.push(this.makeGain(this.loopsGains[i]));
      const loopGain=this.loopsGainsVals[i].makeString();
      this.denominator += loopGain;

      if (i !== this.loopsGains.length - 1 && loopGain.length>0)
        this.denominator += " + ";
      else if(i === this.loopsGains.length-1)
        this.denominator += " )";
    }

    let nonTouching = new LoopsNonTouching(this.loops);
    let i = 2;
    while (true) {
      let array = nonTouching.getNonTouching(i);
      if (array.length == 0) break;
      
      this.denominator += " + ";
      if(this.calcNonTouchingGain(array).toString().length>0){
        if (Math.pow(-1, i) == -1)
          this.denominator += "- " + this.calcNonTouchingGain(array).toString();
        else
          this.denominator += this.calcNonTouchingGain(array).toString();
      }
      i++;
    }
  }

  private makeNumerator() {
    let nonTouching = new PathsNonTouching(this.paths, this.loops);
    let array = nonTouching.getNonTouching();
     
     console.log(array);
    for (let i = 0; i < this.paths.length; i++) {
      this.pathsGainsVals.push(this.makeGain(this.frwdGains[i]));
      this.numerator += this.pathsGainsVals[i].makeString();

      if (array[i].length != 0) {
        this.numerator += " ( 1 - ( ";

        for (let j = 0; j < array[i].length; j++) {
          this.numerator += this.loopsGainsVals[array[i][j]].makeString();
          if (j != array[i].length - 1) this.numerator += " + ";
        }

        this.numerator += " ) ) ";
      }

      if (i != this.paths.length - 1) this.numerator += " + ";
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
      if(i !== 0)
        result += " + "
      result += Builder.makeString();
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
          Builder.str += char.slice(1, char.length);
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
