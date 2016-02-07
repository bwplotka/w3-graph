var Graph = require('data-structures').Graph;

var names = Object();
var graphData;

function makeNames(inputFile) {
  if (inputFile) {
    names = [];
    var linesArray = inputFile.split("\n");
    for (var i = 0; i < linesArray.length; i++) {
      var currentLineArray = linesArray[i].split("\t");
      // Make it checkbox parameter:
      if (currentLineArray.length == 1) {
        currentLineArray = linesArray[i].split(" ");
      }
      for (var j = 0; j < currentLineArray.length; j++) {
        names[trim(currentLineArray[1])] = trim(currentLineArray[0])
      }
    }
    console.log("Loaded Names:");
    console.log(names);
  }
}

function openFile(event) {
  if (isEmpty(names)) {
    alert("Load labels first")
    return
  }
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function() {
    var text = reader.result;
    parseInput(text);
  }

  inputData = input.files[0];
  if (!isUndefined(inputData)){
      reader.readAsText(inputData);
  }
};

function loadNames(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function() {
    var text = reader.result;
    makeNames(text);
  }

  inputData = input.files[0];
  if (!isUndefined(inputData)){
      reader.readAsText(inputData);
  }

}

function parseInput(input_file) {
  console.log("Parse");
  graphData = new Graph(true);
  if (input_file) {
    var linesArray = input_file.split("\n");
    for (var i = 0; i < linesArray.length; i++) {
      var currentLineArray = linesArray[i].split("\t");
      if (currentLineArray.length == 1) {
        currentLineArray = linesArray[i].split(" ");
      }
      var root = false;

      if (i == 0) {
        root = true;
      }
      graphData.addNode(trim(currentLineArray[0]), names[trim(currentLineArray[0])], root);
      for (var j = 1; j < currentLineArray.length; j++) {
        if (currentLineArray[j] == "0") {
          break;
        }
        if (!graphData.getNode(trim(currentLineArray[j]))) {
          graphData.addNode(trim(currentLineArray[j]), names[trim(currentLineArray[j])])
        }
        graphData.addEdge(trim(currentLineArray[0]), trim(currentLineArray[j]))
      }
    }
  }
  console.log("loaded Graph: ", graphData);
  console.log(graphData);

  renderGraphOnScene(graphData);
}

/* When the user clicks on the button,
 toggle between hiding and showing the dropdown content */
function dropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
