// variable declarations 
var bg, bgImage;
var mario, marioAnime;
var brick, brickImage;
var ground, groundImage;
var obstacle, obstacleAnime;
var obstacleGroup, brickGroup;
var rand,score = 0;
var checkpointSound, dieSound;
var restart, restartImage;
var gameOver, gameOverImage;
var GAMEON = 1, END = 0, gameState = 1;

function preload(){
  
// loading Images
  bgImage = loadImage("bg.png");
  brickImage = loadImage("brick.png");
  groundImage = loadImage("ground2.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");

// loading Animations  
  marioAnime = loadAnimation("mario00.png",
                             "mario01.png",
                             "mario02.png",
                             "mario03.png");
  obstacleAnime = loadAnimation("obstacle1.png",
                                "obstacle2.png",
                                "obstacle3.png",
                                "obstacle4.png")
  dieAnime = loadAnimation("collided.png")
  
// loading Sounds
  jumpSound = loadSound("jump.mp3")
  checkpointSound = loadSound("checkPoint.mp3"); 
  dieSound = loadSound("die.mp3");

}

function setup(){
  createCanvas (400,400);
  
  ground = createSprite(100,200,500,10);
  ground.addImage(bgImage);
  ground.scale= 1.2;
 
  mario = createSprite(40,340,40,10);
  mario.addAnimation("running",marioAnime);
  mario.addAnimation("dead",dieAnime);
  
  invisibleGround = createSprite(250,365,500,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(200,190,20,20); 
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(200,220,20,20);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  obstacleGroup=new Group();
  brickGroup = new Group();
  
}

function draw(){
  background("white");
  
  //gravity 
  mario.velocityY = mario.velocityY + 0.75;
  mario.collide(invisibleGround); 

  if (gameState === GAMEON){ 
    
    //Jump Mario!!!
    if(keyDown('space') && mario.y >= 340){
      mario.velocityY = -10;
      jumpSound.play();
    }

    giveBricks();
    bringOnTheObstacles();

    if(obstacleGroup.isTouching(mario)){
      gameState = END;
      dieSound.play();
    }
    
    if(brickGroup.isTouching(mario)){      
   //   brickGroup.destroyEach();
      brickGroup[0].destroy();
      score = score + 1;
    }
    
    if ((score % 100 === 0) && (score > 0)){
      checkpointSound.play();
    }
  }
  
  if (gameState === END){
    
    mario.changeAnimation("dead",dieAnime);
    
    gameOver.visible = true;
    restart.visible = true;
  
    ground.velocityX = 0;
    brickGroup.setVelocityXEach(0);   
    obstacleGroup.setVelocityXEach(0);
    
    brickGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
    
  }
  drawSprites();
  text("Score : "+score,300,100);
 
}

function bringOnTheObstacles(){
  
  if (frameCount % 61 === 0){
    obstacle = createSprite(400,335,10,40);
    obstacle.addAnimation("obstacle",obstacleAnime);
    obstacle.velocityX = -8;
    obstacle.lifetime = 100;
    obstacleGroup.add(obstacle);
  }
}

function giveBricks(){
  
  if (frameCount % 25 === 0){
    brick = createSprite(400,250,10,40);
    brick.addAnimation("brick",brickImage);
    brick.velocityX = -8;
    brick.y = Math.round(random(250,300)); 
    brick.lifetime = 100;
    brickGroup.add(brick);
    //brick.debug = true;
  }
}

function reset(){
  gameState = GAMEON;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  
  mario.changeAnimation("running",marioAnime);
  
  score = 0;
  
}

  