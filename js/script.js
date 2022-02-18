//Canvas' info.
const canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 690;

//Context parameters.
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.globalCompositeOperation = 'source-over';

//Buttons.
const pencil = document.getElementById('pencil');
const pen = document.getElementById('pen');
const brush = document.getElementById('brush');
const marker = document.getElementById('marker');
const fun = document.getElementById('fun'); //'Fun' is a magic button, the line of which changes its thickness and color as you draw.

//Actions.
const size = document.getElementById('line-size');
const color = document.getElementById('line-color');
const undo = document.getElementById('undo');
const reset = document.getElementById('reset');
const save = document.getElementById('save');

//Variables in work.
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;
let arrayOfActions = [];
let index = -1;

//Toggle-class function.
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('click', toggleClass));

function toggleClass() {
    if (!this.classList.contains('active')) {
        buttons.forEach(button => button.classList.remove('active'));
    } this.classList.toggle('active');
};

//Line-parameters setting functions.
function setColor() {
    if (marker.classList.contains('active') || fun.classList.contains('active')) {
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        hue++;
        
        if (hue >= 360) {
            hue = 0;
        };
    } else {
        ctx.strokeStyle = color.value; //Default color.
    };
};

function setSize() {
    if (pencil.classList.contains('active')) {
        ctx.lineWidth = 2;
    } else if (pen.classList.contains('active')) {
        ctx.lineWidth = 5;
    } else if (brush.classList.contains('active')) {
        ctx.lineWidth = 10;
    } else if (fun.classList.contains('active')) {
        if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
            direction = !direction;
        };
        if (direction) {
            ctx.lineWidth++;
        } else {
            ctx.lineWidth--;
        };
    } else {
        ctx.lineWidth = size.value;
    };
};

color.addEventListener('input', setColor);
color.addEventListener('click', () => {
    marker.classList.remove('active');
    fun.classList.remove('active');
});

size.addEventListener('input', setSize);
size.addEventListener('change', () => {
    pencil.classList.remove('active');
    pen.classList.remove('active');
    brush.classList.remove('active');
    fun.classList.remove('active');
});

//Drawing function.
function draw(e) {
    if (!isDrawing) return;
    setColor();
    setSize();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
};

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    arrayOfActions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
});

canvas.addEventListener('mouseout', () => isDrawing = false);

//Reset-button.
function clearCanvas() {
    let isTrue = confirm('This action will remove all the contents of the Canvas. Are you sure?');

    if (isTrue) {
        ctx.fillStyle = 'white';
        ctx.clearRect = (0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        arrayOfActions = [];
        index = -1;
    };
};

reset.addEventListener('click', clearCanvas);

//Undo-button.
function undoLastAction() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index -= 1;
        arrayOfActions.pop();
        ctx.putImageData(arrayOfActions[index], 0, 0);
    };
};

undo.addEventListener('click', () => {
    let isTrue = confirm('Undo the last action on the Canvas?');
    isTrue && undoLastAction();
});

//Save-button.
function saveSketch() {
    const image = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';

    let isTrue = confirm('Save this drawing to your computer?');
    isTrue && link.click();
};

save.addEventListener('click', saveSketch);
