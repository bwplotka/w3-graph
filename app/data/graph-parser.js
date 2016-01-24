var Graph = require('data-structures').Graph;

// TODO(bplotka): @Piotr: Add parser from input to graph ( Graph https://github.com/chenglou/data-structures/wiki/Graph)
function parseInput(input_file) {
     // Debug (do same, dynamically!)
    graphData = new Graph();
    graphData._addNode('1', 'root-wiki1', true);
    graphData.addNode('1.1', 'wiki2');
    graphData.addNode('1.2', 'wiki3');
    graphData.addNode('1.3', 'wiki4');
    graphData.addNode('1.2.1', 'wiki5');
    graphData.addNode('1.2.2', 'wiki5');

    graphData.addEdge('1','1.1');
    graphData.addEdge('1','1.2');
    graphData.addEdge('1','1.3');
    graphData.addEdge('1.2','1.2.1');
    graphData.addEdge('1.2','1.2.2');

    return graphData;
}
