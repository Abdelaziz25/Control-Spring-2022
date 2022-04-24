export class PathsNonTouching {
  private paths: String[][];
  private loops: String[][];
  private nonTouching: number[][];

  constructor(paths: String[][], loops: String[][]) {
    this.loops = loops.slice();
    this.paths = paths.slice();
    this.nonTouching = [];
  }

  getNonTouching(): number[][] {
    for (let i = 0; i < this.paths.length; i++) {
      this.partialNonTouching(i);
    }

    return this.nonTouching
  }

  private partialNonTouching(index: number) {
    let nonTouching = [];
    let currentPaths = this.paths[index];
    let nodes = new Map();

    for (let i = 0; i < currentPaths.length; i++) {
      nodes.set(currentPaths[i], 1);
    }

    for (let i = 0; i < this.loops.length; i++) {
      let flag = true;
      let toCheck = this.loops[i];

      for (let j = 0; j < toCheck.length; j++) {
        if (nodes.has(toCheck[j])) {
          flag = false;
          break;
        }
      }

      if (flag) {
        nonTouching.push(i);
      }
    }

    this.nonTouching.push(nonTouching);
  }
}
