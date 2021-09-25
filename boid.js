class Boid{
  constructor(x,y){
    this.pos=createVector(x,y)
    this.vel = p5.Vector.random2D()
    this.vel.setMag(random(1,3))
    this.acc=createVector(0,0)
    this.speed=S_Speed.value()
    this.r=S_Radius.value()
    this.maxForce=S_maxForce.value()
    this.flockmates=[]
  }
  update(){
    this.speed=S_Speed.value()
    this.r=S_Radius.value()
    this.maxForce=S_maxForce.value()
    
    if (C_quadtree.checked()){
      this.flockmates=this.getFlockmatesQuadtree()
    }else{
      this.flockmates=this.getFlockmates()
    }
    this.render()
    
    this.acc.add(this.alignment().mult(S_Alignment.value()))
    this.acc.add(this.cohesion().mult(S_Cohesion.value()))
    this.acc.add(this.separation().mult(S_Separation.value()))
    
    this.vel.add(this.acc)
    this.pos.add(this.vel) 
    this.acc.mult(0)
    
    this.keepOnScreen()
  }
  keepOnScreen(){
    if (this.pos.x<0){
      this.pos.x=width
    }
    if (this.pos.x>width){
      this.pos.x=0
    }
    if (this.pos.y<0){
      this.pos.y=height
    }
    if (this.pos.y>height){
      this.pos.y=0
    }
  }
  alignment(){
    let avgVel=createVector()
    let total=0
    for (let f of this.flockmates){
      avgVel.add(f.vel)
      total++
    }
    if (total>0){
      avgVel.div(total)
      avgVel.setMag(this.speed)
      avgVel.sub(this.vel)
      avgVel.limit(this.maxForce)
    }
    return avgVel
  }
  cohesion(){
    let avgPos=createVector()
    let total=0
    for (let f of this.flockmates){
      avgPos.add(f.pos)
      total++
    }
    let st=createVector()
    if (total>0){
      avgPos.div(total)
      let desired=p5.Vector.sub(avgPos,this.pos)
      desired.setMag(this.speed)
      st = p5.Vector.sub(desired, this.vel)
      st.limit(this.maxForce)
      
    }
    return st;
  }
  separation(){
    let avgVel=createVector()
    let total=0
    for (let f of this.flockmates){
      let diff = p5.Vector.sub(this.pos,f.pos)
      diff.div(this.pos.dist(f.pos))
      avgVel.add(diff)
      total++
    }
    if (total>0){
      avgVel.div(total)
      avgVel.setMag(this.speed)
      avgVel.sub(this.vel)
      avgVel.limit(this.maxForce)
    }
    return avgVel
  }
  
  getFlockmates(){
    let flockmates=[]
    for (let b of boids){
      if (b!=this && this.pos.dist(b.pos)<this.r){
        flockmates.push(b)
      }
    }
    return flockmates
  }
  getFlockmatesQuadtree(){
    let points=quadtree.query(new Circle(this.pos.x,this.pos.y,this.r))
    let flockmates=[]
    for (let p of points){
      flockmates.push(p.userData)
    }
    return flockmates
  }
  
  
  render(){
    let size=S_renderSize.value()
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.vel.heading())
    fill(255,50)
    stroke(255)
    triangle(-size*2,size,-size*2,-size,2*size,0)
    if (C_showRadius.checked()){
      stroke(0,255,0)
      noFill()
      strokeWeight(1)
      circle(0,0,this.r*2)
    }
    if (C_showLines.checked()){
      stroke(255,0,0)
      strokeWeight(1)
      for (let f of this.flockmates){
        push()
        resetMatrix()
        line(this.pos.x,this.pos.y,f.pos.x,f.pos.y)
        pop()
      }
    }
    pop()
  }
}