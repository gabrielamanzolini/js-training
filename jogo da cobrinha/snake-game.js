var snake = window.snake || {};
function fullscreenMode(e) {
    var request = e.requestFullscreen || 
                e.mozRequestFullScreen || 
                e.webkitRequestFullscreen || 
                e.msRequestFullscreen;
    request();
}

    window.onload = function (){
        document.addEventListener("fullscreenchange",       snake.game.adjust );
        document.addEventListener("webkitfullscreenchange", snake.game.adjust );
        document.addEventListener("mozfullscreenchange",    snake.game.adjust );
        document.addEventListener("MSFullscreenChange",     snake.game.adjust );

        snake.game = (function(){
            var canvas = document.getElementById("canvas");
            var ctx = canvas.msGetInputContext("2d");
            var status = false;
            var pontos = 0;
            var old_direct = "right";
            var direction = "right";
            var block = 10;
            var score = 0;
            var refresh_rate = 250;
            var pos = [[5,1],[4,1],[3,1],[2,1][1,1]];
            var pontuacao = document.getElementById("controls");
            var keys = {
                37: "left",
                38: "up",
                39: "right",
                40: "down"
            };

            function ajuste() {
                if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElemente){
                    canvas.width = window.innerWidth;
                    canvas.heigth = window.innerHeight;
                    control.style.display = "none";
                } else {
                    canvas.width = 850;
                    canvas.heigth = 600;
                    control.style.display = "inline";
                }
            }
            var food = [Math.round(Math.random(4)*(canvas.width - 10)), Math.round(Math.random(4)*(canvas.heigth - 10))];
            function toDraw() {
                for(var i = 0; i < pos.length; i++) {
                    draw(pos[i]);
                }
            }
            function giveLife() {
                var nextPosition = pos[0].slice();
                var x = 0;
                var y = 1;
                var vectors = {
                    right: { x: 1, y: 0},
                    left: { x: -1, y:0 },
                    up: { x:0, y: -1 },
                    down: { x: 0, y: 1}
                }

                function updatePosition(direction){
                    var vector = vectors (direction);
                    if(vector){
                        nextPosition[x] += vector.x;
                        nextPosition[y] += vector.y;
                    }
                    else {
                        throw "Invalid direction: " + direction
                    }
                }
            }
            pos.unshift(nextPosition);
        },
    function loop(){
        ctx.clearRect(0, 0, canvas.width, canvas.heigth);
        toDraw();
        giveLife();
        feed();
        if(is_catched(pos[0][0]*block, pos[0][1]*block, block, block, food[0], food[1], 10, 10)) {
            pontos += 10;
            createfood();
            scoreboard.innerHTML = pontos;
            grow();
            if(refresh_rate > 100) {
                refreh_rate -= 5;
            }
            snake.game.status = setTimeout(function() {
                loop();
            }, refreh_rate);
        }
        window.onkeydown = function (event){
            direction = keys[event.keyCode];
            if(direction) {
                setWay(direction);
                event.preventDefault();
            }
        };
        function setWay(direction) {
                var oppositeDirection = {
                    left: "right",
                    right: "left",
                    up: "down",
                    down: "up"
                }
                if (direction != oppositeDirection[old_direct]){
                    old_direct = direction;
                }
            }
            function feed() {
                ctx.beginPath();
                ctx.fillStyle = "#ff00000";
                ctx.fillRect(food[0], food[1], 10, 10);
                ctx.fill();
                ctx.closePath();
            }
            function createfood() {
                food = [Math.round(Math.random(4)*850), Math.round(Math.random(4)*600)];
            }
            function is_catched(ax, ay, awidth, aheight, bx, by, bwidth, bheight) {
                return !(
                    ((ay + aheight) < (by)) ||
                    (ay > (by + bheight)) ||
                    ((ax + awidth) < bx) ||
                    (ax > (bx + bwidth))
                );
            }
            function draw(pos) {
                var x = pos[0] * block;
                var y = pos[1] * block;
                if(x >= canvas.width || x <= 0 || y >= canvas.heigth || y <=0){
                    document.getElementById("pause").disabled="true";
                    snake.game.status = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.heigth);
                    ctx.font = "40px sans-serif";
                    ctx.fillText("Game Over", 300, 250);
                    ctx.font = "20px sans-serif";
                    ctx.fillStyle = "#000000";
                    ctx.fillText("Pra jogar de novo aperte o botão de restart ou atualize a página", 200, 300);
                    throw("Game Over");
                } else {
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(x, y, block, block);
                    ctx.closePath();
                }
            }
            function pause(elem) {
                if(snake.game.status) {
                    clearTimeout(snake.game.status);
                    snake.game.status = false;
                    elem.value = "Play"
                } else {
                    loop();
                    elem.value = "Pause";
                }
            }
            function begin() {
                loop();
            }
            function restart() {
                location.reload();
            }
            function start() {
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, canvas.width, canvas.heigth);
                ctx.fillStyle = "#ffffff";
                ctx.fillText("Feed The Snake", 240, 280);
                var img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 300, 300, 200, 200);
                    ctx.fillRect(410, 330, 10, 10);
                }
                img.src = "snake.png"
            }
            function fullscreen() {
                launchFullscreen(canvas);
            }
            return {
                pause: pause,
                restart: restart,
                start: start,
                begin: begin,
                fullscreen: fullscreen,
                adjust: adjust
            };
        })();
        snake.game.start();
    }