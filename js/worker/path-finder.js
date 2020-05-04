onmessage = function(e){
    const a = e.data.a;
    const b = e.data.b;
    const field = e.data.field.map(x => x);

    let done = false;
    let success = false;

    const aX = a.x;
    const aY = a.y;

    const bX = b.x;
    const bY = b.y;

    let cX = aX;//current y
    let cY = aY;//current y

    let maxLoopCount = 5;

    while(!done && maxLoopCount > 0){
        let dX = 0;//direction x
        let dY = 0;//direction y
        
        if(cX < bX){
            dX = 1;
        } else if(cX > bX){
            dX = -1;
        }

        if(cY < bY){
            dY = 1;
        } else if(cY > bY){
            dY =-1;
        }
        let moved = 0;
        let maxMoved = 0;
        let maxMovedX = 0;
        let maxMovedY = 0;

        let yMoveOnX = cY;
        for(let x = cX + dX; x != bX; x += dX){
            console.log(`X X:${x} Y: ${yMoveOnX}`);

            if(moved > maxMoved){
                console.log(`MAX MOVED ${moved}`);
                maxMoved = moved;
                maxMovedX = x - dX;
            }

            if(field[x][yMoveOnX] != 0){
                if(field[cX][yMoveOnX + dY] == 0){
                    yMoveOnX += dY;
                    x = cX;

                    if(moved > maxMoved){
                        console.log(`MAX MOVED ${moved}`);
                        maxMoved = moved;
                        maxMovedX = x - dX;
                    }

                    moved = 0;
                    continue;
                }
                break;
            }
            ++moved;
        }
        cX = maxMovedX;

        moved = 0;
        maxMoved = 0;
        let xMoveOnY = cX;
        for(let y = cY + dY; y != bY; y += dY){
            console.log(`Y X:${xMoveOnY} Y: ${y}`);

            if(moved > maxMoved){
                console.log(`MAX MOVED ${moved}`);
                maxMoved = moved;
                maxMovedY = y - dY;
            }

            if(field[xMoveOnY][y] != 0){
                
                if(field[xMoveOnY + dX][y] == 0){
                    xMoveOnY += dX;
                    y = cY;

                    if(moved > maxMoved){
                        console.log(`MAX MOVED ${moved}`);
                        maxMoved = moved;
                        maxMovedY = y - dY;
                    }

                    moved = 0;
                    continue;
                }
                break;
            }
            ++moved;
        }
        cY = maxMovedY;


        maxLoopCount--;
    }

    if(maxLoopCount == 0){
        console.log("EXISTED BECAUSE MAXLOOPCOUNT");
    }

    postMessage({
        success : success
    });
}