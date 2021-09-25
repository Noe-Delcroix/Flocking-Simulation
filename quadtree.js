class Point{
  constructor(x,y,userData){
    this.x=x
    this.y=y
    this.userData=userData
  }
}

class Rectangle{
  constructor(x,y,w,h){
    this.x=x
    this.y=y
    this.w=w
    this.h=h
  }
  contains(point){
    return (point.x>=this.x && point.y>=this.y && point.x<=this.x+this.w && point.y<=this.y+this.h)
  }
  
  overlaps(rectangle){
     return !(this.x >= rectangle.x+rectangle.w || rectangle.x >= this.x+this.w || this.y >= rectangle.y+rectangle.h || rectangle.y >= this.y+this.h)
  }
}

class Circle{
  constructor(x,y,r){
    this.x=x
    this.y=y
    this.r=r
  }
  contains(point){
    return dist(this.x,this.y,point.x,point.y)<this.r
  }
  overlaps(rectangle){
    let distX=this.x
    let distY=this.y
    if (this.x<rectangle.x){
      distX=rectangle.x
    }else if (this.x>rectangle.x+rectangle.w){
      distX=rectangle.x+rectangle.w
    }
    if (this.y<rectangle.y){
      distY=rectangle.y
    }else if (this.y>rectangle.y+rectangle.h){
      distY=rectangle.y+rectangle.h
    }
    distX=this.x-distX
    distY=this.y-distY
    return sqrt((distX*distX)+(distY*distY))<=this.r
  }
}

class Quadtree{
  constructor(boundary,capacity){
    this.boundary=boundary
    this.capacity=capacity
    this.points=[]
    this.divided=false
  }
  subdivide(){
    let b=this.boundary
    let rect
    rect=new Rectangle(b.x,b.y,b.w/2,b.h/2)
    this.topleft=new Quadtree(rect,this.capacity)
    rect=new Rectangle(b.x+b.w/2,b.y,b.w/2,b.h/2)
    this.topright=new Quadtree(rect,this.capacity)
    rect=new Rectangle(b.x,b.y+b.h/2,b.w/2,b.h/2)
    this.bottomleft=new Quadtree(rect,this.capacity)
    rect=new Rectangle(b.x+b.w/2,b.y+b.h/2,b.w/2,b.h/2)
    this.bottomright=new Quadtree(rect,this.capacity)
    this.divided=true
  }
  insert(point){
    if (!this.boundary.contains(point)){
      return
    }
    if (this.points.length<this.capacity){
      this.points.push(point)
    }else{
      if (!this.divided){
        this.subdivide()
      }
      this.topleft.insert(point)
      this.topright.insert(point)
      this.bottomleft.insert(point)
      this.bottomright.insert(point)
    }
    
    
  }
  query(range,found){
    if (!found){
      found=[]
    }
    
    if (!range.overlaps(this.boundary)){
      return null;
    }else{
      for (let p of this.points){
        if (range.contains(p)){
          found.push(p)
        }
      }
      if (this.divided){
        this.topleft.query(range,found)
        this.topright.query(range,found)
        this.bottomleft.query(range,found)
        this.bottomright.query(range,found)
      }
      return found
    }
    
    
  }
  
  show(){
    if (!this.divided){
      let b=this.boundary
      noFill()
      stroke(0,255,255,50)
      strokeWeight(1)
      rect(b.x,b.y,b.w,b.h)
    }else{
      this.topleft.show()
      this.topright.show()
      this.bottomleft.show()
      this.bottomright.show()
    }
  }
}