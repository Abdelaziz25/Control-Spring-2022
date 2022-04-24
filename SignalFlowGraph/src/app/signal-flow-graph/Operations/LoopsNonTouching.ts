export class LoopsNonTouching {
  private loops: String[][];
  private nonTouching: number[][];

  constructor(loops: String[][]) {
    this.loops = loops.slice();
    this.nonTouching = [];
  }

  getNonTouching(count: number): number[][] {
    this.nonTouching = [];
    let nodeMap = new Map<String, number>();
    let loops: number[] = [];

    for (let i = 0; i < this.loops.length; i++) {
      this.getPartial(i, count, loops, nodeMap);
    }

    return this.nonTouching;
  }

  private getPartial(index: number, count: number, loops: number[], map: Map<String, number>) {
    let left = count - 1;
    let currentLoop = this.loops[index];
    let nodes = new Map(map);

    let loopsNums = loops.slice();
    loopsNums.push(index);
    if (left == 0) {
      this.nonTouching.push(loopsNums);
      return;
    }

    for (let i = 0; i < currentLoop.length; i++) {
      nodes.set(currentLoop[i], 1);
    }


    for (let i = index + 1; i < this.loops.length; i++) {
      let flag = true;
      let toCheck = this.loops[i];

      for (let j = 0; j < toCheck.length; j++) {
        if (nodes.has(toCheck[j])) {
          flag = false;
          break;
        }
      }

      if (flag) {
        this.getPartial(i, left, loopsNums, nodes);
      }

    }
  }
}
