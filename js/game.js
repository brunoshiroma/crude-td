crude_td = {};

function gameInit(){
    var canvas = document.getElementById('game-canvas');

    if(canvas.getContext){
        var ctx = canvas.getContext('2d');
        crude_td.graphics = {
            canvas,
            ctx
        };

        initGameCanvas();

        canvas.onclick = canvasClicked;

        crude_td.field = [];
        for(var x = 0; x < 16; x++){
            crude_td.field[x] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }

        window.requestAnimationFrame(redraw);
        //crude_td.gameLogicId = window.setInterval(gameLogic, 100);

        crude_td.gameLogicEnemyWorker = new Worker('js/worker/game-logic-enemy.js');

        crude_td.gameLogicEnemyWorker.onmessage = processGameLogicEnemyWorkerMessage;
        crude_td.gameLogicEnemyWorker.onerror = processGameLogicEnemyWorkerError;
        crude_td.gameLogicEnemyWorker.postMessage({field : 
            crude_td.field
        });

        fetch('js/stage-1.json').then(resp => {
            resp.json().then(j => {
                console.log(j);
                crude_td.field = j.field;

                const pathWorker = new Worker('js/worker/path-finder.js');
                pathWorker.postMessage({
                    a : {
                        x : 1,
                        y : 0
                    },
                    b : {
                        x : 8,
                        y : 15
                    },
                    field : j.field
                });

            });
        });

    } else{
        alert("Your browser dont support canvas =(");
    }
    
}

function callGameLogicEnemyWorker(){
    crude_td.gameLogicEnemyWorker.postMessage({
        field : crude_td.field
    });
}

function processGameLogicEnemyWorkerMessage(e){
    crude_td.field = e.data.field;

    setTimeout(callGameLogicEnemyWorker, 100);
}

function processGameLogicEnemyWorkerError(e){
    console.error(e);
}

function gameLogic(){
    var x = Math.round(Math.random() * 15);
    var y = Math.round(Math.random() * 15);
    if(crude_td.field[x][y] == 0){
        crude_td.field[x][y] = 2;
    }
}

function redraw(){
    for(var x = 0; x <= 15; x++){
        for(var y = 0; y <= 15; y++){
            switch(crude_td.field[x][y]){
                case 1:
                    fillRect(x * 30 + 1, y * 30 +1, 28, 28, 'rgb(0,50,0)');
                    break;
                case 0:
                    fillRect(x * 30 + 1, y * 30 +1, 28, 28, 'rgb(0,0,0)');
                    break;
                case 2:
                    fillRect(x * 30 + 1, y * 30 +1, 28, 28, 'rgb(50,0,0)');
                    break;
                case 10:
                    fillRect(x * 30 + 1, y * 30 +1, 28, 28, 'rgb(255,255,255)');
                    break;
            }
        }
    }
    window.requestAnimationFrame(redraw);
}

function processCanvasClick(x, y){
    if(x <= 15 && y <= 15 && x >= 0 && y >= 0){
        if(crude_td.field[x][y] == 0){
            crude_td.field[x][y] = 1;
        } else if(crude_td.field[x][y] == 1) {
            crude_td.field[x][y] = 0;
        }
    } else{
        console.log("invalid input");
    }
}

function canvasClicked(e){
    var x = Math.round(Math.max(e.x / 30, 1)) - 1;
    var y = Math.round(Math.max(e.y / 30, 1)) - 1;

    processCanvasClick(x, y);
}

function initGameCanvas(){
    fillRect(0, 0, 640, 480, 'rgb(0,0,0)');

    for(var x = 0; x < 16; x++){
        for(var y = 0; y < 16; y++){
            strokeRect(x * 30, y * 30, 30, 30, 'rgb(244, 244, 244)');
        }
    }
    
}

function fillRect(x, y, width, height, style){
    crude_td.graphics.ctx.fillStyle = style;
    crude_td.graphics.ctx.fillRect(x, y, width, height);
}

function strokeRect(x, y, width, height, style){
    crude_td.graphics.ctx.strokeStyle = style;
    crude_td.graphics.ctx.strokeRect(x, y, width, height);
}

function drawLine(x, y){
}