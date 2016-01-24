var Graph = require('data-structures').Graph;

// TODO(bplotka): @Piotr: Add parser from input to graph ( Graph https://github.com/chenglou/data-structures/wiki/Graph)
function parseInput(input_file) {
     // Debug (do same, dynamically!)

    return debugGraph2();
}

function debugGraph2() {
     graphData = new Graph();
    graphData.addNode('1', 'root-wiki1', true);
    graphData.addNode('1.1', 'wiki2');
    graphData.addNode('1.2', 'wiki3');
    graphData.addNode('1.3', 'wiki4');
    graphData.addNode('1.4', 'wiki2');
    graphData.addNode('1.5', 'wiki3');
    graphData.addNode('1.6', 'wiki4');
    graphData.addNode('1.7', 'wiki2');
    graphData.addNode('1.8', 'wiki3');
    graphData.addNode('1.9', 'wiki4');
    graphData.addNode('1.10', 'wiki4');
    graphData.addNode('1.2.1', 'wiki5');
    graphData.addNode('1.2.2', 'wiki5');
    graphData.addNode('1.2.3', 'wiki5');
    graphData.addNode('1.2.4', 'wiki5');

    graphData.addEdge('1','1.1');
    graphData.addEdge('1','1.2');
    graphData.addEdge('1','1.3');
    graphData.addEdge('1','1.4');
    graphData.addEdge('1','1.5');
    graphData.addEdge('1','1.6');
    graphData.addEdge('1','1.7');
    graphData.addEdge('1','1.8');
    graphData.addEdge('1','1.9');
    graphData.addEdge('1','1.10');
    graphData.addEdge('1.2','1.2.1');
    graphData.addEdge('1.2','1.2.2');
    graphData.addEdge('1.2','1.2.3');
    graphData.addEdge('1.2','1.2.4');

    return graphData;

}

function debugGraph1() {
    graphData = new Graph();
    graphData.addNode('1', 'root-wiki1', true);
    graphData.addNode('1.1', 'wiki2');
    graphData.addNode('1.2', 'wiki3');
    graphData.addNode('1.3', 'wiki4');

    graphData.addEdge('1','1.1');
    graphData.addEdge('1','1.2');
    graphData.addEdge('1','1.3');

    return graphData;

}