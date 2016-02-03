# WebGL 3D Graph Visualisations aka 'w3-graph'

![Walrus](https://github.com/Bplotka/w3-graph/blob/master/doc/walrus.jpg)

Walrus graph visualization using WebGL via THREE.js lib.
It renders tree graphs in a 3D space within sphere.

## Usage:

1. Create two files `labels` and `links`
2. Import `labels` using `Menu > Import labels`
3. Import `links` using `Menu > Import links`

`Labels` should contain pairs `name -> id` delimited by `/t` or space:

```
NAME1 1
NAME2 2
```

`Links` should contain neighbourhood matrix (aka adjacency matrix) delimited by `/t` or space:

```
1 2 3 4 5 6
2 7 8 9 10
```

Make sure there is no `new line` at the end of your files.

## Example:
![Example](https://github.com/Bplotka/w3-graph/blob/master/doc/w3-walrus-example.PNG)
