// https://web.archive.org/web/20061222182121/http://policyalmanac.org/games/aStarTutorial_port.htm
async function search(map, sourceX, sourceY, destinationX, destinationY) {
    let openList = {};
    let path = null;
    const closedList = {};
    let found = false;

    const check = async (map, x, y) => {
        return map[x][y] === 0;
    };

    const manhattan = async (sourceX, sourceY, destinationX, destinationY) => {
        return (Math.abs(sourceX - destinationX) + Math.abs(sourceY - destinationY)) * 10;
    };

    const createNode = async (x, y, g, h, parent) => {
        return {
            x: x,
            y, y,
            g: g,
            h: h,
            f: g + h,
            parent: parent,
            key: `${x}_${y}`
        }
    };

    const getNeighborhood = async (map, node, destinationX, destinationY) => {
        const neighborhood = [];
        for (let x = node.x - 1; x <= node.x + 1; x++) {
            for (let y = node.y - 1; y <= node.y + 1; y++) {
                if (x == node.x && y == node.y) {
                    continue;
                }
                if (x < 0 || map.length < x) {
                    continue;
                }
                if (y < 0 || map[x].length < y) {
                    continue;
                }
                if (map[x][y] != 0) {
                    continue;
                }

                const h = await manhattan(x, y, destinationX, destinationY);
                const g = (x == node.x || y == node.y) ? 10 : 14; // diagonals....

                const newNode = await createNode(x, y, g, h, node);

                let parent = newNode.parent;
                let loopCount = map.length * map[0].length;
                let alreadyOnPath = false;
                while (parent != null && loopCount > 0) {
                    loopCount--;
                    if (parent.key == newNode.key) {
                        alreadyOnPath = true;
                        break;
                    }
                    parent = parent.parent;
                }
                if(!alreadyOnPath){
                    neighborhood.push(newNode);
                }
            }


        }
        console.log({
            k: node.key,
            p: neighborhood
        });
        return neighborhood;
    };

    const subSearch = async (map, node, destinationX, destinationY, maxSubsearc) => {
        if (maxSubsearc <= 0) {
            return null;
        }

        let neighborhood = await getNeighborhood(map, node, destinationX, destinationY);

        neighborhood = neighborhood.sort((a, b) => { return a.f < b.f ? -1 : 1 });
        for (let n of neighborhood) {
            
            if (n.x == destinationX && n.y == destinationY) {
                found = true;
                path = n;
                return n;
            }
            
            const subN = await subSearch(map, n, destinationX, destinationY, maxSubsearc - 1);
            if(found){
                return path;
            }
        }
        return null;
    };

    const initialSource = await createNode(sourceX, sourceY, 0, 0, null);
    closedList[initialSource.key] = initialSource;

    let neighborhood = await getNeighborhood(map, initialSource, destinationX, destinationY);
    neighborhood.forEach(n => {
        openList[n.key] = n;
    });
    const initialManhattan = await manhattan(sourceX, sourceY, destinationX, destinationY);

    path = await subSearch(map, initialSource, destinationX, destinationY, initialManhattan);
    console.log(path);
    return path;

}
