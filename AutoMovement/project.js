// Function of Drawing Object

function drawArrow(fromx, fromy, tox, toy) {
    var headlen = 10;

    var angle = Math.atan2(toy - fromy, tox - fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.strokeStyle = "#cc0000";
    context.lineWidth = 3;
    context.stroke();
    context.closePath();

    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    context.strokeStyle = "#cc0000";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = "#cc0000";
    context.fill();
    context.closePath();
}
function drawLine(frX, frY, toX, toY) {
    context.beginPath();
    context.moveTo(frX, frY);
    context.lineTo(toX, toY);
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
}

function drawballDynamic(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 0.1;
    context.strokeStyle = 'green';
    context.closePath();
}
function drawballStatic(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);

    context.lineWidth = 2;
    context.strokeStyle = 'blue';


    context.closePath();
    context.stroke();
}
// Function to Calculation 

function FindChangeAngle(targetX, targetY, vHeadingX, vHeadingY, offset) {
    let angleRadians = Math.atan2(targetY, targetX) - Math.atan2(vHeadingY, vHeadingX);
    if (angleRadians > Math.PI) { angleRadians -= 2 * Math.PI; }
    else if (angleRadians <= -Math.PI) { angleRadians += 2 * Math.PI; }
    return angleRadians / offset;

}


// Class needed
class targetBall {
    constructor(x, y, r = 5) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    drawballStatic() {
        context.beginPath();
        context.arc(this.x, this.y, this.r - 50, 0, 2 * Math.PI, false);

        context.lineWidth = 2;

        if (this.isColided) {
            context.strokeStyle = 'blue';
        } else {
            context.strokeStyle = 'green';
        }
        context.closePath();
        context.stroke();
    }
}

class directBall {
    constructor(x, y, r = 30) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.targetObject = null;

        this.uX = -this.vHeadingY;
        this.uY = this.vHeadingX;
    }

    randomNewPosition() {
        let t = 2 * Math.PI * Math.random();
        let newX = this.r * Math.cos(t);
        let newY = this.r * Math.sin(t);

        this.targetObject = new targetBall(newX, newY);


        return {
            x: this.x + newX,
            y: this.y + newY
        };
    }



    show() {
        drawballStatic(this.x, this.y, this.r);
        if (this.targetObject != null) {
            drawballDynamic(this.x + this.targetObject.x, this.y + this.targetObject.y, this.targetObject.r);
        }
    }
}



class ball {
    constructor(x, y, r = 0, velocityX = 0, velocityY = 0, length) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isColided = false;
        this.vHeadingX = velocityX;
        this.vHeadingY = velocityY;
        this.direct = new directBall(this.x + this.vHeadingX * (length + 30), this.y + this.vHeadingY * (length + 30));
        this.length = length;

        this.uX = -this.vHeadingY;
        this.uY = this.vHeadingX;
    }


    randomNewPosition() {
        let newPos = this.direct.randomNewPosition();
        newPos = this.normalizeVetor(newPos.x, newPos.y);
        return {
            x: newPos.x,
            y: newPos.y
        };
    }

    normalizeVetor(vx, vy) {
        let len = Math.sqrt(Math.pow(vx - this.x, 2) + Math.pow(vy - this.y, 2));
        return {
            x: (vx - this.x) / len,
            y: (vy - this.y) / len
        };
    }

    changeVHeading(angle) {
        this.vHeadingX = Math.round(10000 * (this.vHeadingX * Math.cos(angle) - this.vHeadingY * Math.sin(angle))) / 10000;
        this.vHeadingY = Math.round(10000 * (this.vHeadingX * Math.sin(angle) + this.vHeadingY * Math.cos(angle))) / 10000;
    }


    moveTo(nextX, nextY) {
        if (nextX - this.r <= 0) {
            this.x = canvas.width - 11;
            this.direct.x = canvas.width - 11;
        }
        else if (nextX + this.r >= canvas.width) {
            this.x = 11;
            this.direct.x = 11;
        }
        else {
            this.x = nextX;
            this.direct.x = nextX;
        }

        if (nextY - this.r <= 0) {
            this.y = canvas.height - 11;
            this.direct.y = canvas.height - 11;
        }
        else if (nextY + this.r >= canvas.height) {
            this.y = 11;
            this.direct.y = 11;
        }
        else {
            this.y = nextY;
            this.direct.y = nextY;
        }
    }

    updateDirectBall() {
        this.direct.x = this.x + this.vHeadingX * (this.length + 30);
        this.direct.y = this.y + this.vHeadingY * (this.length + 30);
    }


    show() {
        this.drawballDynamic();
        this.isColided = false;
        //this.drawvHeading();
        // if (this.direct != null){
        //     this.updateDirectBall();
        //     this.direct.show();
        // }

    }
    drawvHeading() {
        drawArrow(this.x, this.y, this.x + this.vHeadingX * 50, this.y + this.vHeadingY * 50);
    }



    drawballDynamic() {
        drawballDynamic(this.x, this.y, this.r);
    }

    drawballStatic() {
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);

        context.lineWidth = 2;

        if (this.isColided) {
            context.strokeStyle = 'blue';
        } else {
            context.strokeStyle = 'green';
        }
        context.closePath();
        context.stroke();
    }
}

function iterate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    timer++;
    if (mouseIsDown) {
        let t = 2 * Math.PI * Math.random();
        let r = 10;
        let x = mouseX;
        let y = mouseY;
        let firstX = Math.cos(t);
        let firstY = Math.sin(t);

        c = new ball(x, y, r, firstX, firstY, 50);
        balls.push(c);

        target = c.randomNewPosition();
        angle = FindChangeAngle(target.x, target.y, c.vHeadingX, c.vHeadingY, 150);
        lstTarget.push(target);
        lstAngle.push(angle);
    }

    if (timer % 150 == 0) {
        timer = 0;
        for (var i = 0; i < balls.length; i++) {
            balls[i].vHeadingX = lstTarget[i].x;
            balls[i].vHeadingY = lstTarget[i].y;
        }
        lstTarget.splice(0, lstTarget.length);
        lstAngle.splice(0, lstAngle.length);
        for (var i = 0; i < balls.length; i++) {
            let target = balls[i].randomNewPosition();
            let angle = FindChangeAngle(target.x, target.y, balls[i].vHeadingX, balls[i].vHeadingY, 150);
            lstTarget.push(target);
            lstAngle.push(angle);
        }
    }
    for (var i = 0; i < balls.length; i++) {

        balls[i].changeVHeading(lstAngle[i]);
        F.x = lstTarget[i].x - balls[i].vHeadingX;
        F.y = lstTarget[i].y - balls[i].vHeadingY;

        nextX = balls[i].x + (balls[i].vHeadingX) * velocity + F.x * velocity / offset;
        nextY = balls[i].y + (balls[i].vHeadingY) * velocity + F.y * velocity / offset;
        balls[i].moveTo(nextX, nextY);

        balls[i].show();
    }
}
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var mouseIsDown = false;
var avoidObject = [];
var balls = [];
var lstTarget = [];
var lstAngle = [];
var mouseX = 0;
var mouseY = 0;



var velocity = 1.5;
var offset = 10;
var m = 2;
var target;
var F = new targetBall();
var P = new targetBall();
var timer = 150;
var angle = 0;

var boolInit = true;




canvas.onmousedown = function (e) {
    mouseIsDown = true;
}
canvas.onmouseup = function (e) {
    mouseIsDown = false;
}
canvas.addEventListener('mousemove', function (evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
});
setInterval(iterate, 20); // 50 frame

