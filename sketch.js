var boids=[]

var timer=0
var fps=5

var quadtree

function setup() {
  createCanvas(windowWidth-300, windowHeight);
  let ele
  ele=createElement('p','General settings :')
  ele.position(width,-10)
  ele.class('title')
  T_boidsNumber=createElement('h5','Number of boids :')
  T_boidsNumber.position(width,5)
  T_boidsNumber.class('subtitle')
  S_boidsNumber=createSlider(10,2000,200,1)
  S_boidsNumber.position(width,50)
  S_boidsNumber.class('subtitle')
  S_boidsNumber.input(changeBoidNumber)
  ele=createElement('h5','View Radius')
  ele.position(width,50)
  ele.class('subtitle')
  S_Radius=createSlider(10,100,30,0.01)
  S_Radius.position(width,95)
  ele=createElement('h5','Speed')
  ele.position(width,95)
  ele.class('subtitle')
  S_Speed=createSlider(1,10,2,0.01)
  S_Speed.position(width,140)
  ele=createElement('h5','Maximum steering force')
  ele.position(width,140)
  ele.class('subtitle')
  S_maxForce=createSlider(0.01,1,0.1,0.01)
  S_maxForce.position(width,185)
  C_quadtree=createCheckbox('Quadtree Optimization')
  C_quadtree.position(width,210)
  C_quadtree.class('subtitle')
  T_quadtreeCapacity=createElement('h5','Capacity per quad : ')
  T_quadtreeCapacity.position(width,210)
  T_quadtreeCapacity.class('subtitle')
  S_quadtreeCapacity=createSlider(1,20,4,1)
  S_quadtreeCapacity.position(width,255)
  
  ele=createElement('p','Flocking settings :')
  ele.position(width,270)
  ele.class('title')
  ele=createElement('h5','Alignment')
  ele.position(width,285)
  ele.class('subtitle')
  S_Alignment=createSlider(0,2,1,0.01)
  S_Alignment.position(width,330)
  ele=createElement('h5','Cohesion')
  ele.position(width,330)
  ele.class('subtitle')
  S_Cohesion=createSlider(0,2,0.5,0.01)
  S_Cohesion.position(width,375)
  ele=createElement('h5','Separation')
  ele.position(width,375)
  ele.class('subtitle')
  S_Separation=createSlider(0,2,1,0.01)
  S_Separation.position(width,420)
  
  
  ele=createElement('p','Rendering settings :')
  ele.position(width,440)
  ele.class('title')
  ele=createElement('h5','Boid size')
  ele.position(width,455)
  ele.class('subtitle')
  S_renderSize=createSlider(2,20,2,0.01)
  S_renderSize.position(width,500)

  C_showRadius=createCheckbox('Show radius')
  C_showRadius.position(width,530)
  C_showRadius.class('subtitle')
  C_showLines=createCheckbox('Connect to flockmates')
  C_showLines.position(width,550)
  C_showLines.class('subtitle')
  
  C_showQuadtree=createCheckbox('Show quadtree')
  C_showQuadtree.position(width,570)
  C_showQuadtree.class('subtitle')
  
  changeBoidNumber()
}

function changeBoidNumber(){
  if (boids.length<S_boidsNumber.value()){
    for (let i=0;i<S_boidsNumber.value()-boids.length;i++){
      boids.push(new Boid(random(width),random(height)))
    }
  }else{
    for (let i=boids.length-1;i>=S_boidsNumber.value();i--){
      boids.splice(i,1)
    }
  }
  T_boidsNumber.html('Number of boids : '+boids.length)
}

function draw() {
  background(51);
  if (C_quadtree.checked()){
    S_quadtreeCapacity.show()
    T_quadtreeCapacity.show()
    C_showQuadtree.show()
    T_quadtreeCapacity.html('Capacity per quad : '+S_quadtreeCapacity.value())
    quadtree=new Quadtree(new Rectangle(0,0,width,height),S_quadtreeCapacity.value())
  }else{
    S_quadtreeCapacity.hide()
    T_quadtreeCapacity.hide()
    C_showQuadtree.hide()
  }
  for (let b of boids){
    b.update()
    if (C_quadtree.checked()){
      quadtree.insert(new Point(b.pos.x,b.pos.y,b))
    }
  }
  if (C_showQuadtree.checked()){
    quadtree.show()
  }
  
  if (timer==floor(fps/3)){
    fps=floor(frameRate())
    timer=0
  }else{
    timer++
  }
  fill(255,255,0)
  noStroke()
  textSize(20)
  textAlign(LEFT,TOP)
  text(fps,0,0)
}