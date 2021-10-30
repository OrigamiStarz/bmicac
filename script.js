const Canvas = document.getElementById("canvas");
const context = Canvas.getContext("2d");
const bg = document.getElementById("ccolor");
const canvasPage = document.getElementById("drawing");
const color1 = document.getElementById("color1");
const width = document.getElementById("brushWidth");
const customWidth = document.getElementById("customBrushWidth");
const initiateBtn = document.getElementById("toCanvas");
const navbarElements = document.getElementsByClassName("navbar");
const sidebar = document.getElementById("brushSettings");
let hide = false; //for sidebar
let editing = false; //for edit color mode
//initial width/height
let inputWidth = document.getElementById("inputwidth");
let inputHeight = document.getElementById("inputheight");
inputWidth.value = Math.floor(window.innerWidth / 1.4);
inputHeight.value = Math.floor(window.innerHeight / 1.4);
//default brush
const brush = document.getElementById("brush");
//brushes
var brushes = ["brush1", "brush2"];
let currentBrush = brushes[0];
//Create canvas modal
const menu = document.getElementById("menu");
document.getElementById("toCanvas").onclick = function() {
  //Makes modal disappear
  menu.style.display = "none";
  canvasPage.style.display = "block";
  //navbar buttons appear
  navbarElements[0].style.display = "inline";
  navbarElements[1].style.display = "inline";
  //Pick background color
  Canvas.style.backgroundColor = bg.value;
  context.fillStyle = bg.value;
  context.fillRect(0,0,Canvas.width,Canvas.height);
  //Width/height 
  Canvas.height = inputHeight.value;
  Canvas.width = inputWidth.value;
  //make default brush appear
  brush.style.display = "block";
  document.getElementById("brushSettings").style.display = "block";
  context.fillStyle = bg.value;
  context.fillRect(0,0,Canvas.width,Canvas.height);
};
//rotating between brushes
const prevBrush = document.getElementById("prevBrush");
const nextBrush = document.getElementById("nextBrush");
const displayBrush = document.getElementById("displayBrush"); // show current brush
const numBrush = brushes.length;
//first brush name
displayBrush.textContent = "Default";
//switch between brushes
function changeBrush(curBrush, move) {
   if (brushes[brushes.indexOf(curBrush) + move]) {
    currentBrush = brushes[brushes.indexOf(currentBrush) + move];
  } else if (move == 1) {
    currentBrush = brushes[0];
  } else {
    currentBrush = brushes[numBrush - 1];
  }
  if (currentBrush == "brush1"){
      context.lineCap = "round";
      displayBrush.textContent = "Default";
    }
  else if (currentBrush == "brush2"){
      context.lineCap = "butt";
      displayBrush.textContent = "Fuzzy";
    }
  }
prevBrush.addEventListener("click", function() {
  changeBrush(currentBrush, -1);
});
nextBrush.addEventListener("click", function() {
  changeBrush(currentBrush, 1);
});
//NAVBAR STUFF
var modal = document.getElementById("modal"); //modal, not the content
      var gear = document.getElementById("settings"); //button to open
      var span = document.getElementsByClassName("close")[0]; //button to close
      modal.style.display = "none";
      gear.onclick = function() {
        modal.style.display = "block";
      };
      span.onclick = function() {
        modal.style.display = "none";
      };
//dim screen except for obj
const dark = document.createElement("div");
const inst = document.getElementById("inst");
dark.id = "dark";
document.body.appendChild(dark);
let dim = false;
function dimScreen(x) {
  if (dim == false) {
    //dim screen
    x.style.zIndex = 2;
    dark.style.display = "inline";
    dim = true;
    inst.style.display = "block";
  } else {
    //undim screen
    dark.style.display = "none";
    x.style.zIndex = 0;
    dim = false;
    inst.style.display = "none";
  }
}
const cp = document.getElementById("cp"); //color palette
const editColors = document.getElementById("editColors");
//add to color palette
function NewColor() {
  let newC = document.createElement("input");
  newC.type = "button";
  newC.value = color1.value;
  //style
  newC.style.backgroundColor = color1.value; //color
  newC.style.color = color1.value; //hides HEX
  cp.appendChild(newC);
  newC.onclick = function() {
    //change color
    if (editing === false) {
      document.getElementById("color1").value = newC.value;
    } else {
      //delete color
      this.remove();
    }
  };
}
//delete colors on color palette
function editColorList() {
  if (editing === false) {
    //change to edit mode
    editColors.textContent = "Done";
    editing = true;
  } else {
    //revert back to normal
    editColors.textContent = "Edit";
    editing = false;
  }
  dimScreen(cp);
}
//redo/undo buttons——not completely original code
//Based off of: Tom Cantwell, https://medium.com/@cantwell.tom/making-an-undo-button-part-1-834d0cfd4185
let undoBtn = document.getElementById("undo");
let redoBtn = document.getElementById("redo");
let undoStack = [Canvas.toDataURL()];
let redoStack = [];
let img = new Image();
let baseDimension;
let rect;
//clear button
let clearBtn = document.getElementById("clear");
clearBtn.onclick = function() {
  context.clearRect(0, 0, Canvas.width, Canvas.height);
  context.fillStyle = bg.value;
  context.fillRect(0,0,Canvas.width,Canvas.height);
  //save current state
  undoStack.push(Canvas.toDataURL());
  redoStack = [];
};
//DRAWING FUNCTION
//NEED TO FIND WEBSITE THAT CODE WAS USED FROM...
let drawing = false;
let x = 0;
let y = 0; //touchstart, touchmove, touchend 
//pointerdown, pointermove, pointerup
//drag
Canvas.addEventListener("pointerdown", e => {
  x = e.offsetX;
  y = e.offsetY;
  if (currentBrush == "brush1")
    {
      context.lineCap = "round";
    }
  drawing = true;
});

Canvas.addEventListener("pointermove", e => {
  if (drawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});
window.addEventListener("pointerup", e => {
  if (drawing === true) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    drawing = false;
    undoStack.push(Canvas.toDataURL());
    redoStack = [];
  }
});
// BRUSH
function drawLine(context, x1, y1, x2, y2) {
  context.strokeStyle = color1.value;
  context.lineWidth = width.value;
  context.beginPath();
  context.lineJoin = "round";
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}
//for redo/undo
function renderImage() {
  context.clearRect(0, 0, Canvas.width, Canvas.height); 
    Canvas.imageSmoothingEnabled = false; //prevents blur
    context.drawImage(img, 0, 0, Canvas.width, Canvas.height); //draw state onto context
  };
}
//Redo/undo function
function redoUndo(push, pop) {
  push.push(pop.pop());
  renderImage();
}
//undo
undoBtn.addEventListener("click", function() {
  img.src = undoStack[undoStack.length - 2];
  if (undoStack.length > 1) {
    redoUndo(redoStack, undoStack);
  }
});
//redo
redoBtn.addEventListener("click", function() {
  img.src = redoStack[redoStack.length - 1];
  if (redoStack.length >= 1) {
    redoUndo(undoStack, redoStack);
  }
});
//save
let savebtn = document.getElementById("save");
let saveAhref = document.createElement('a');
document.body.appendChild(saveAhref);
savebtn.addEventListener("click", function() {
  let imgurl = Canvas.toDataURL('image/jpg');
  saveAhref.href = imgurl;
  saveAhref.download = "mydrawing";
  saveAhref.target = 'C:';
  saveAhref.click();
});
saveAhref.target = 'C:';
saveAhref.click();
function flexCanvasSize() {
  renderImage();
}
window.onresize = flexCanvasSize();
//function to change width with textbox
const customBrushWidth = document.getElementById("customBrushWidth");
width.onmousemove = function() {
  //set value of textbox to the value of whatever you dragged it to 
  customBrushWidth.value = width.value; 
};
customBrushWidth.onchange = function() {
  //change value of slider to whatever the textbox is
  if(!(width.value>100 && !(width.value<1))) {
     width.value = customBrushWidth.value; 
  }
};
//THEMES
const musicT = document.getElementById("musicTheme");
const springT = document.getElementById("springTheme");
const seaT = document.getElementById("seaTheme");
const spookT = document.getElementById("spookTheme");
const xmasT = document.getElementById("xmasTheme");
const logo = document.getElementById("logo");
const sidebarElements = document.getElementsByClassName("side");
// customThemes (navbarColor, [sideBackgroundColor,sideTextColor,sideBorders], [buttonBackgroundColor, buttonTextColor, buttonBorders], imageAddressForBackground)
let customThemes = (nav, side, buttons, l, background) => {
  //logo 
  logo.src = l;
  //background
  document.body.style.backgroundImage = "url(" + background + ")";
  document.body.style.backgroundSize = "cover";
  //nav
  document.getElementsByTagName("nav")[0].style.backgroundColor = nav;
  //sidebar stuff
  for (let i=0; i<sidebarElements.length; i++){
    sidebarElements[i].style.backgroundColor = side[0];
    sidebarElements[i].style.color = side[1];
    sidebarElements[i].style.border = side[2];
  };
  //width container for slider
  document.getElementById("widthContainer").style.backgroundColor = side[0];
  //buttons
  const b = document.getElementsByTagName("button");
  for (let i=0;i<b.length;i++){
    b[i].style.backgroundColor = buttons[0];
    b[i].style.color = buttons[1];
    b[i].style.border = buttons[2];
  };
  };
//music
musicT.onclick = function() {customThemes("#00e0a5",["#95decb","#007d75","groove #00664b 3px"],["#95decb","#00664b","groove 00664b 2px"], "https://cdn.glitch.me/003f7267-64c1-41f0-82cc-6d6dd063dc47%2Fwilliam_singer.png?v=1635462324095","https://wallpaperaccess.com/full/1400324.jpg");};
//spring
springT.onclick = function() {customThemes("#2fcc46",["#f7d9ff","black","double green 3px"],["#aed6b4","#ae4dc9","groove #a6ffb5 2px"], "https://cdn.glitch.me/003f7267-64c1-41f0-82cc-6d6dd063dc47%2Fwilliam_flowerboi.png?v=1635462968828", "https://animecorps.files.wordpress.com/2018/01/63571144_p0.png");};
//sea
seaT.onclick = function() {customThemes("#4d87d5",["#d4e5ff","black", "double #4d87d5 3px"], ["#bdd6fc", "black","solid #1481F3 2px"],"https://cdn.glitch.me/003f7267-64c1-41f0-82cc-6d6dd063dc47%2F8a8dc580-bd81-4726-a6f7-d3a18268723d.image.png?v=1635460438534", "https://cdn.glitch.com/003f7267-64c1-41f0-82cc-6d6dd063dc47%2F2faa4282-86f6-4f46-80e9-cc9b2eff2233.image.png?v=1632872208004");};
//spook
spookT.onclick = function() {customThemes("orange",["black","#ffb361","ridge orange 3px"],["#ffe600","black","solid white 2px"],"https://cdn.glitch.me/003f7267-64c1-41f0-82cc-6d6dd063dc47%2Fwilliam_wizard.png?v=1635461678551","https://wallpaperaccess.com/full/86406.jpg");};
//xmas
xmasT.onclick = function() {customThemes("#960500",["#56cca3","#e30909","double #e30909 3px"],["#00c764","#003812","solid #003812 2px"], "https://cdn.glitch.me/003f7267-64c1-41f0-82cc-6d6dd063dc47%2Fwilliam_xmas.png?v=1635461925861", "https://i.ytimg.com/vi/16vv4TloNto/maxresdefault.jpg");};
//NOTE: images not owned by us
