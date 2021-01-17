//Create variables here
var dog, dogImg
var happyDog
var database
var foodS
var foodStock 
var feedDog
var addFood
var feedTime, lastFed
var foodObj
var gameState, readState
var bedroom, washroom, garden, sadDog;


function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png")
  happyDog = loadImage("images/dogImg1.png")
  bedroom = loadImage("images/Bedroom.png")
  washroom = loadImage("images/Washroom.png")
  garden = loadImage("images/Garden.png")
  sadDog = loadImage("images/Lazy.png")

}

function setup() {
	createCanvas(1000, 500);
  dog = createSprite(500,300)
  dog.addImage(dogImg)
  dog.scale = 0.2 
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock)

  foodObj = new Food();

  feeds = createButton("Feed the dog.");
        feeds.position(700,95);
        feeds.mousePressed(feedDog)

  addFoods = createButton("Add food.");
        addFoods.position(800,95 );
        addFoods.mousePressed(addFood);    
        
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
  
}



function draw() {  

background(46, 139, 87)

feedTime = database.ref('FeedTime');
feedTime.on("value",function(data){
  lastFed = data.val();
})

fill(255,255,254);
textSize(15);
if(lastFed>=12){
  text("Last Feed: " + lastFed%12 + "PM", 350, 30);
}else if(lastFed === 0 ){
  text("Last Feed: 12 AM ", 350, 30);
}else{
  text("Last Feed: " + lastFed + "AM", 350, 30);
}

if(gameState!="Hungry"){
  feeds.hide();
  addFoods.hide();
  dog.remove();
}else{
  feeds.show();
  addFoods.show();
  dog.addImage(sadDog);
}

currentTime = hour();
if(currentTime===(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime === (lastFed+2)){
  update("Sleeping")
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washroom();
}else{
  update("hungry")
  foodObj.display();
}

foodObj.display()


  drawSprites();
  //add styles here
  stroke("white")
  fill("white")
  text("Food Stock:"+foodS, 450,220)
  

}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog );

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
    //gameState:"hungry"
  })
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}

function writeStock(x){

if(x<=0){
x = 0;
}else{
  x = x-1
}

  database.ref('/').update({
    food:x
  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}



