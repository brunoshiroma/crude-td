let field;

onmessage = function(e){
    field = e.data.field.map(x => x);
    //gameLogic();
}

function gameLogic(){
    var x = Math.round(Math.random() * 15);
    var y = Math.round(Math.random() * 15);
    if(field[x][y] == 0){
        field[x][y] = 2;
        
    }
    postMessage({field});
}