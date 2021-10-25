crude_td = {};

function gameInit() {
    var canvas = document.getElementById('game-canvas');

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        crude_td.graphics = {
            canvas,
            ctx
        };

        initGameCanvas();

        canvas.onclick = canvasClicked;

        crude_td.field = [];
        for (var x = 0; x < 16; x++) {
            crude_td.field[x] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        window.requestAnimationFrame(redraw);
        //crude_td.gameLogicId = window.setInterval(gameLogic, 100);

        crude_td.gameLogicEnemyWorker = new Worker('js/worker/game-logic-enemy.js');

        crude_td.gameLogicEnemyWorker.onmessage = processGameLogicEnemyWorkerMessage;
        crude_td.gameLogicEnemyWorker.onerror = processGameLogicEnemyWorkerError;
        crude_td.gameLogicEnemyWorker.postMessage({
            field:
                crude_td.field
        });

        fetch('js/stage-1.json').then(resp => {
            resp.json().then(j => {
                console.log(j);
                crude_td.original_field = JSON.parse(JSON.stringify(j.field));
                crude_td.field = j.field;

                search(j.field, 1, 0, 8, 15).then((p) => {
                    console.log(p);
                    let parent = p.parent;
                    crude_td.field[p.x][p.y] = 1
                    while (parent) {
                        crude_td.field[parent.x][parent.y] = 1
                        parent = parent.parent;
                    }
                });

                const pathWorker = new Worker('js/worker/path-finder.js');
                pathWorker.onmessage = processGameLogicEnemyWorkerMessage;
                // pathWorker.postMessage({
                //     a : {
                //         x : 1,
                //         y : 0
                //     },
                //     b : {
                //         x : 8,
                //         y : 15
                //     },
                //     field : j.field
                // });

            });
        });

    } else {
        alert("Your browser dont support canvas =(");
    }

}

function callGameLogicEnemyWorker() {
    crude_td.gameLogicEnemyWorker.postMessage({
        field: crude_td.field
    });
}

function processGameLogicEnemyWorkerMessage(e) {
    crude_td.field = e.data.field;

    setTimeout(callGameLogicEnemyWorker, 100);
}

function processGameLogicEnemyWorkerError(e) {
    console.error(e);
}

function gameLogic() {
    var x = Math.round(Math.random() * 15);
    var y = Math.round(Math.random() * 15);
    if (crude_td.field[x][y] == 0) {
        //crude_td.field[x][y] = 2;
    }
}

function redraw() {
    for (var x = 0; x <= 15; x++) {
        for (var y = 0; y <= 15; y++) {
            switch (crude_td.field[x][y]) {
                case 1:
                    fillRect(x * 30 + 1, y * 30 + 1, 28, 28, 'rgb(0,50,0)');
                    break;
                case 0:
                    fillRect(x * 30 + 1, y * 30 + 1, 28, 28, 'rgb(0,0,0)');
                    break;
                case 2:
                    fillRect(x * 30 + 1, y * 30 + 1, 28, 28, 'rgb(50,0,0)');
                    break;
                case 10:
                    fillRect(x * 30 + 1, y * 30 + 1, 28, 28, 'rgb(255,255,255)');
                    break;
            }
        }
    }
    for (var x = 0; x <= 15; x++) {
        drawString(x * 30 + 15, 15 * 30 + 45, `${x}`);
    }
    for (var y = 0; y <= 15; y++) {
        drawString(15 * 30 + 45, y * 30 + 15, `${y}`);
    }

    window.requestAnimationFrame(redraw);
}

function processCanvasClick(x, y) {
    const fieldValue = crude_td.field[x][y];
    if (x <= 15 && y <= 15 && x >= 0 && y >= 0) {
        if (fieldValue == 0) {
            crude_td.field[x][y] = 10;
        } else if (fieldValue == 10) {
            crude_td.field[x][y] = 0;
        } else if (fieldValue == 1) {
            crude_td.field[x][y] = 10;

            let cloneField = [];
            for (var xx = 0; xx < crude_td.field.length; xx++) {
                const column = crude_td.field[xx];
                cloneField.push([]);
                for (var yy = 0; yy < column.length; yy++) {
                    if (crude_td.field[xx][yy] == 10) {
                        cloneField[xx][yy] = 10;
                    } else {
                        cloneField[xx][yy] = 0;
                    }
                }
            }

            search(cloneField, 1, 0, 8, 15).then((p) => {
                console.log(p);
                if (p) {
                    let parent = p.parent;
                    crude_td.field[p.x][p.y] = 1
                    while (parent) {
                        crude_td.field[parent.x][parent.y] = 1
                        parent = parent.parent;
                    }
                } else {
                    crude_td.field[x][y] = 1;
                }
            });
        }
    } else {
        console.log("invalid input");
    }
}

function canvasClicked(e) {
    var x = Math.round(Math.max(e.x / 30, 1)) - 1;
    var y = Math.round(Math.max(e.y / 30, 1)) - 1;

    processCanvasClick(x, y);
}

function initGameCanvas() {
    fillRect(0, 0, 640, 480, 'rgb(0,0,0)');

    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            strokeRect(x * 30, y * 30, 30, 30, 'rgb(244, 244, 244)');
        }
    }

}

function drawString(x, y, string) {
    crude_td.graphics.ctx.fillStyle = "red";
    crude_td.graphics.ctx.fillText(string, x, y);
}

function fillRect(x, y, width, height, style) {
    crude_td.graphics.ctx.fillStyle = style;
    crude_td.graphics.ctx.fillRect(x, y, width, height);
}

function strokeRect(x, y, width, height, style) {
    crude_td.graphics.ctx.strokeStyle = style;
    crude_td.graphics.ctx.strokeRect(x, y, width, height);
}

function drawLine(x, y) {
}