

var missles = [];
var antimissles = [];

var targets = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

}

var genRateA = 0;
function draw() {
    background(51);
    //translate(width / 2, height / 2);

    // if (genRateA == 1) {
    //     missles.push(new Missle("Missle", 2, width / 2 , height - 100));
    //     antimissles.push(new Missle("Antimissle", 1, width / 2 ,  100));

    //     genRateA = 0;
    // }
    // genRateA++;

    if ( 500 > missles.length + antimissles.length )
    {
        // for (var a = 0; a < 1; a++) {
            missles.push(new Missle("Missle", 2, width / 2, height - 100));
            antimissles.push(new Missle("Antimissle", 1, width / 2, 100));
        // }
    }

    for (var b = missles.length - 1; b >= 0; b--) {
        missles[b].update();
        missles[b].render();
    }

    for (var b = antimissles.length - 1; b >= 0; b--) {
        antimissles[b].update();
        antimissles[b].render();
    }

    for (var a = missles.length - 1; a >= 0; a--) {
        for (var b = antimissles.length - 1; b >= 0; b--) {
            if (col(missles[a], antimissles[b])) {
                missles.splice(a, 1);
                antimissles.splice(b, 1);
                break;
            }
        }
    }

    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);
    let length = missles.length + antimissles.length;
    text("missles: " + length, 10, height - 40);

}

function col(a, b) {

    var d = Math.sqrt(
        Math.pow(a.pos.x - b.pos.x, 2)
        +
        Math.pow(a.pos.y - b.pos.y, 2)
    );

    if (d < a.scale + b.scale) {
        return true;
    } else {
        return false;
    }
}

function mousePressed() {
    var r = {
        pos: createVector(mouseX, mouseY),
        scale: 100
    }

    for (var a = missles.length - 1; a >= 0; a--) {
        if (col(missles[a], r)) {

            var abc = createVector(mouseX, mouseY);

            abc = abc.sub(missles[a].pos);
            abc = abc.sub(createVector(1, 1) );
            abc.setMag(-2);

            missles[a].acc.add(abc);
        }
    }

    for (var a = antimissles.length - 1; a >= 0; a--) {
        if (col(antimissles[a], r)) {

            var abc = createVector(mouseX, mouseY);

            abc = abc.sub(antimissles[a].pos);
            abc = abc.sub(createVector(1, 1) );
            abc.setMag(-2);

            antimissles[a].acc.add(abc);

        }
    }

    // for (var b = antimissles.length - 1; b >= 0; b--) {

    // }

    // missles.push(new Missle("Missle", 2, mouseX, mouseY));
    // antimissles.push(new Missle("Antimissle", 1, mouseX + 50, mouseY));

}


class Missle {

    constructor(name, targetA, x, y) {
        this.name = name;

        this.pos = createVector(x, y);

        this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.vel.setMag(1);
        // this.vel = createVector(0, 0);

        this.acc = createVector(0, 0);

        this.scale = 0*Math.random() + 10;

        this.damage = 30;

        this.targetA = targetA;
        this.target = createVector(0, 0);

        this.time = 1000;
    }

    update() {
        if (this.targetA == 1) {
            this.target = createVector(width / 2, height - 100);
        } else if (this.targetA == 2) {
            this.target = createVector(width / 2, 100);
        }

        var target = this.target;

        target.sub(this.pos);
        target.setMag(0.01);
        this.acc.add(target);

        this.vel.add(this.acc);
        this.pos.add(this.vel);


        if (this.pos.x < 0) {
            this.pos.x = width;
        }

        if (this.pos.x > width) {
            this.pos.x = 0;
        }

        if (this.pos.y < 0) {
            this.pos.y = height;
        }

        if (this.pos.y > height) {
            this.pos.y = 0;
        }

        // this.vel.mult(0.99);

        this.acc.mult(0);

    }

    findTarget() {
        var shortest = 0;
        var newD;
        var shortestD;
        if (this.targetA == 1 && missles.length >= 1 && antimissles.length >= 1) {

            for (var n = 0; n < missles.length; n++) {
                newD = dist(this.pos.x, this.pos.y, missles[n].pos.x, missles[n].pos.y)
                shortestD = dist(this.pos.x, this.pos.y, missles[shortest].pos.x, missles[shortest].pos.y)

                if (newD < shortestD) {
                    shortest = n;
                }
            }

            this.target = shortest;

        } else if (this.targetA == 2 && missles.length >= 1 && antimissles.length >= 1) {

            for (var n = 0; n < antimissles.length; n++) {
                newD = dist(this.pos.x, this.pos.y, antimissles[n].pos.x, antimissles[n].pos.y)
                shortestD = dist(this.pos.x, this.pos.y, antimissles[shortest].pos.x, antimissles[shortest].pos.y)

                if (newD < shortestD) {
                    shortest = n;
                }
            }

            this.target = shortest;

        }
    }

    render() {
        push();
        translate(this.pos.x, this.pos.y);
        {
            if (this.name == "Antimissle") {
                stroke(255, 0, 255);
            } else {
                stroke(255, 255, 0);
            }
            strokeWeight(this.scale);
            point(0, 0);

            // line(0, 0, -this.vel.x * 2, -this.vel.y * 2);

            // strokeWeight(0.1);
            // if (this.targetA == 1) {
            //     line( 0 , 0 , missles[this.target].pos.x - this.pos.x, missles[this.target].pos.y - this.pos.y);
            // } else if (this.targetA == 2) {
            //     line( 0 , 0 , antimissles[this.target].pos.x - this.pos.x, antimissles[this.target].pos.y - this.pos.y);
            // }

        }
        pop();
    }

}


// // class Cat extends Missle {
// //     constructor(a, b) {

// //     }
// // }

// // var cat = new Cat("Trick", 10);

// class Rectangle {
//     constructor(height, width) {
//         this.name = 'Rectangle';
//         this.height = height;
//         this.width = width;
//     }
//     sayName() {
//         console.log('Hi, I am a ', this.name + '.');
//     }
//     get area() {
//         return this.height * this.width;
//     }
//     set area(value) {
//         this.height = this.width = Math.sqrt(value);
//     }
// }


// var bob = new Rectangle(10, 10);
// bob.set.area(10)
// console.log(bob.area  );