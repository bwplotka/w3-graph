var Graph = require('data-structures').Graph;

// TODO(bplotka): @Piotr: Add parser from input to graph ( Graph https://github.com/chenglou/data-structures/wiki/Graph)
var names = Object();


function openFile(event ) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var text = reader.result;
        parseInput(text);
    }
    reader.readAsText(input.files[0]);

};

function loadNames(event){
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var text = reader.result;
        makeNames(text);
    }
    reader.readAsText(input.files[0]);
}
function parseInput(input_file) {
     // Debug (do same, dynamically!)
    graphData = new Graph();
    if (input_file) {
        var linesArray = input_file.split("\n");
        graphData.addNode(trim(linesArray[0].split("\t")[0]), "root",true);
        for (var i =0 ; i < linesArray.length; i++) {
            var currentLineArray = linesArray[i].split("\t");
            graphData.addNode(trim(currentLineArray[0]), names[currentLineArray[0]]);
            for (var j =1; j< currentLineArray.length; j++) {
                if (currentLineArray[j] == "0") {
                    break;
                }
                if (!graphData.getNode(trim(currentLineArray[j]))){
                    graphData.addNode(trim(currentLineArray[j]),names[currentLineArray[j]])
                }
                graphData.addEdge(trim(currentLineArray[0]), trim(currentLineArray[j]))
            }
        }
    }

    console.log(graphData);
    return graphData;
}

function makeNames(input_file){
    if (input_file){
        var linesArray = input_file.split("\n");
        for (var i =0 ; i < linesArray.length; i++) {
            var currentLineArray = linesArray[i].split("\t");
            for (var j =0; j< currentLineArray.length; j++) {
                names[trim(currentLineArray[1])] = trim(currentLineArray[0])
            }
        }
    }
    console.log(names);
}

function trim(s){
    return ( s || '' ).replace( /^\s+|\s+$/g, '' );
}
