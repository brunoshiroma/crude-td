onmessage = function(e){
    const a = e.data.a;
    const b = e.data.b;
    //const field = e.data.field.map(x => x);
    const field = e.data.field;

    let done = false;
    let success = false;

    const aX = a.x;
    const aY = a.y;

    const bX = b.x;
    const bY = b.y;

    let cX = aX;//current y
    let cY = aY;//current y

    let maxLoopCount = 10;

    //for debugging
    let lX = 0;//last x
    let lY = 0;//last y

    while(!done && maxLoopCount > 0){
        
        for(let x = 0; x < field.length; x++){
            for(let y = 0; y < field[0].length; y++){
                if(field[x][y] != 10){
                    field[x][y] = 2;
                }
            }
        }
        done = true;

        maxLoopCount--;
    }

    if(maxLoopCount == 0){
        console.log("EXISTED BECAUSE MAXLOOPCOUNT");
    }

    postMessage({
        success : true,
        field : field
    });
}