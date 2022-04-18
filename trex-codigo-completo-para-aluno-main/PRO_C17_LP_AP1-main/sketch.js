var PLAY = 1;
var END = 0;
var gameState = PLAY;

var recorde = 0

var jump,die,checkpoint;

var gameover, gameoverImg, restart, restartImg

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");

  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameoverImg = loadImage("gameOver.png");

  restartImg = loadImage("restart.png")

  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;

  gameover = createSprite(width/2,height-120,110,10);
  gameover.addImage(gameoverImg)
  gameover.scale = 0.5
  gameover.visible = false;



  restart = createSprite(width/2,height-90,110,10);
  restart.addImage(restartImg)
  restart.scale = 0.5
  restart.visible = false;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //criar os Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  //console.log("Olá" + 5);
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
}

function draw() {
  background(180);
  
  //exibindo a pontuação
  fill ("black");
  stroke("white")
  text("Pontuação: "+ score, width-100,height-150);
  text("Recorde: "+ recorde, width-100,height-125);
  
  //console.log("isto é ", gameState);
  
  if(gameState === PLAY){
    //mover o chão
    ground.velocityX = -(12+score/100 );
    //pontuação
    score +=  Math.round(getFrameRate()/60);
    if (score % 100 == 0 && score>0) {
      checkpoint.play();   
    }
    if (ground.x < 200){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço é pressionada
    if(touches.length>0 || keyDown("space")&& trex.y >= height-100) {
        trex.velocityY = -13;
        jump.play();
        touches= []
        
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    text("X: "+mouseX+"/ Y: "+mouseY,mouseX,mouseY);
    
    if(trex.isTouching(obstaclesGroup)){
        gameState = END;
        die.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     trex.changeAnimation("collided", trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     trex.velocityY = 0;
     gameover.visible = true;
     
     restart.visible = true;
     if (recorde < score){
       recorde = score; 

     }
     if (mousePressedOver(restart)){
       gameState = PLAY;
       gameover.visible = false;
       restart.visible = false;
       obstaclesGroup.destroyEach();
       cloudsGroup.destroyEach();
       trex.changeAnimation("running", trex_running);
       score = 0


       

     }




   }
  
 
  //impedir que trex cais
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-35,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/obstacle.velocityX;
   
   //adicionar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,height-100,40,10);
    cloud.y = Math.round(random(height-190,height-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6+score/100) ;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = width/cloud.velocityX;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

