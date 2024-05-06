const circleDetail = 800;

export class Drop {
  constructor(_p5, x, y, r, col) {
    this.p5 = _p5;
    this.center = this.p5.createVector(x, y);
    this.r = r;
    this.vertices = [];
    for (let i = 0; i < circleDetail; i++) {
      let angle = this.p5.map(i, 0, circleDetail, 0, this.p5.TWO_PI);
      let v = this.p5.createVector(Math.cos(angle), Math.sin(angle));
      v.mult(this.r);
      v.add(this.center);
      this.vertices[i] = v;
    }
    this.col = col;
  }

  // tine(x, z, c) {
  //   let u = 1 / pow(2, 1 / c);
  //   for (let v of this.vertices) {
  //     v.x = v.x;
  //     v.y = v.y + z * pow(u, abs(v.x - x));
  //   }
  // }

  tine(m, x, y, z, c) {
    let u = 1 / pow(2, 1 / c);
    let b = this.p5.createVector(x, y);
    for (let v of this.vertices) {
      let pb = this.p5.Vector.sub(v, b);
      let n = m.copy().rotate(HALF_PI);
      let d = Math.abs(pb.dot(n));
      let mag = z * Math.pow(u, d);
      v.add(m.copy().mult(mag));
    }
  }

  marble(other) {
    for (let v of this.vertices) {
      let c = other.center;
      let r = other.r;
      let p = v.copy();
      p.sub(c);
      let m = p.mag();
      let root = Math.sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);
      v.set(p);
    }
  }

  show() {
    this.p5.push();
    this.p5.noFill();
    // this.p5.fill(this.col);
    this.p5.stroke(255);
    // this.p5.noStroke();
    this.p5.beginShape();
    for (let v of this.vertices) {
      this.p5.vertex(v.x, v.y);
    }
    this.p5.endShape(this.p5.CLOSE);
    this.p5.pop();
  }
}
