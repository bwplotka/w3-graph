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

## Results:
![Example](https://github.com/Bplotka/w3-graph/blob/master/doc/w3-walrus-example.PNG)

![Example2](https://github.com/Bplotka/w3-graph/blob/master/doc/w3-walrus-example2.PNG)

## Implementation details:

Author: [Bplotka](https://github.com/Bplotka).


Currently, algorithm is able to distribute & render thousands of nodes in couple of seconds.

The algorithm includes several steps:
* _Parsing phase._ Parsing input in two .CSV to the js graph structure.
First .csv contains label -> id map, Second contains adjacency matrix.
That data is simply parsed to data structure based on: [chenglou/data-structures](https://github.com/chenglou/data-structures).
It contains list of `nodes`. Each node includes two list of edges: `outEdges`,
`inEdges` and couple of other statistics like:

    ```
    node = {
      _outEdges: {},
      _inEdges: {},
      name: _name,
      root: _root,
      depth: 0,
      _id: id,
      obj: null,
      position: new THREE.Vector3(0, 0, 0),
      parentId: null,
      direction: new THREE.Vector3(0, 1, 0),
      subNodes: 0, // Meaningful children.
      edgeLength: 0,
      children: 0,
      deltaRotByAxisDir: 0,
      rotByAxisDir: 0,
      rotByAxisPerpDirA: 0,
      rotByAxisPerpDirB: 0,
      distanceToRoot: 0
    }
  ```
Storing other graph types than `tree` is currently blocked. Each node can have only one parent.
These statistics are needed for further calculations and filled during `addEdge` function.
Important additional structures are `levels`:
![Level](https://github.com/Bplotka/w3-graph/blob/master/doc/w3-walrus-level.PNG)
Level is a group of all nodes without children which share a single parent. They are aggregated and rendered as as half of 3D sphere. Levels are filled in early parsing stage during `addEdge` function.
Lavel structure is simple:
  ```
  level = {
    size: 0,
    members: []
  }
  ```
This stage is done in `app/data/graph-parser.js`. Structure is defined in `app/data/data-structures.js`

* _Statistic phase._ Before we render the tree we need to collect some statistic and store it in graph attributes like:
  * `maxWidth`: Maximum tree width - maximum number of children having their children and sharing single parent.
  * `avgWidth`: Average tree width - average number of children having their children and sharing single parent.
  * `nodesWithChildren`: Number of nodes which have children.
  * `maxDistanceToRoot`: Longest path from the root to the leaf.
  * `depth`: Depth of the tree.
In this stage we also calculate some node's attribute like `rotation directions`, `distanceToRoot`, `subNodes` (number of children with children of per each node), `edgeLength` (based on number of subNodes: more subNodes, longer edge), `deltaRotByAxisDir` (360 degrees / number of subNodes) and `depth` of each node.
Additionally, we calculate the needed `RADIUS` of a sphere in which we render our tree. This is based on longest path in graph from root.
All data are calculated using [BFS](https://en.wikipedia.org/wiki/Breadth-first_search) in file `app/data/data-structures.js`.

* _Rendering phase._ This stage calculates position of the nodes and edges in the sphere.
algorithm:
  1. Use BFS and foreach node:
    * Get all children of this node.
    * If the node has not any children then it is a leaf and was rendered in his parent `level` so continue to 1.
      * If it's root node than render it in the CENTER (defined in `app/render/scene.js`)
      * If it's a different node get his parentNode.
        * Copy `direction` from his parent. `direction` is a normalized `Vector3` which specifies direction in which node should be placed.
        * Calculate normalized perpendicular `Vector3` to `direction`. (Using cross)
        * Apply initial rotation to node `direction` around axis specified by perpendicular direction. (currently it is 45 degree)
        * Apply rotation around the parent `direction` axis by `rotByAxisDir` calculated in previous stage to `direction`.
        * Apply additional rotation around perpendicular direction axis by different angles to `direction` using this algorithm:
          * For root children:
            * Each fourth child of parent will apply by `rotByAxisPerpDirB` angle. (Currently: -22 degrees)
            * Each fourth + 1 child of parent will apply by 2 * `rotByAxisPerpDirB` angle. (Currently: -44 degrees)
            * Each fourth + 2 child of parent will apply by `rotByAxisPerpDirA` angle. (Currently: 75 degrees)
            * Each fourth + 3 child of parent will apply by 2 * `rotByAxisPerpDirA` angle. (Currently: 150 degrees)
          * else:
            * Always apply by `rotByAxisPerpDirB` angle. (Currently: -22 degrees)
        * Sum `rotByAxisDir` with parent `deltaRotByAxisDir`
        * Copy `position` from his parent.
        * Move `position` by adding `direction` multiplied by parentNode `edgeLength` calculated in previous stage.
        * Render vertex knowing `position`, `direction` (if rendering is detailed and includes cubes we need to know the rotation), `sizeNode` and node `name`
        * Render edge from parent to node.
        * If it has leaf children then render `level` in specified node `direction`:
          * Check the _rendering level phase_ below
        * Add children to `nodesToVisis` BFS list
 * _Rendering level phase._ This stage is included in _Rendernig phase_ but it also quite complex so i have created additional phase for that.

 ![Level-Algorithm](https://github.com/Bplotka/w3-graph/blob/master/doc/w3-walrus-level-alg.png)

 The algorithm goes as follows:
  1. Calculate perpendicular `Vector3` to given `direction` of the owner.
  2. Calculate area of the square made with all `members` of the `level` with some interval between (all leafs of the owner)
  3. Find radius of a circle which covers area calculated in 2
  4. Check if radius is not smaller than MIN_LVL_RADIUS (which is sphere radius / 10)
  5. Calculate how many sub levels (rings) can be placed within our circle.
  6. Calculate relative X angle (How we should move down in 3D sphere around the relative X axis). Divide 120 degrees by number of `subLevels` (We want to have this special `flower` look)
  7. Calculate initial `sphereVec` which simply indicates the movement from owner to leaf localization.
  8. `numNodesOnSubLvl` = 1 since we have only one leaf on the top.
  9. Init `angleRelY` (rotation around relative Y axis). For the first leaf it does not matter. It will indicates on how many degree we should rotate around center of the sphere (360 / `numNodesOnSubLvl`)
  10. Foreach `level` `member`:
   * Copy `position` from `owner`. Compose base position.
   * If we need to move down (if `numNodesOnSubLvl` <= 0)
   * Apply a `angleRelX` rotation to `sphereVec` to move down the sphere by perpendicular to direction vector
   * Add `angleRelX` to `summaricAngleRelX`
   * Calculate how many nodes can be in the given radius after moving down:
   * Calculate `subRadius` (sin(`summaricAngleRelX`) * radius)
   * Calculate circuit length
   * Calculate how many nodes (leafs) can be placed within given circuit
   * If it is the last `subLvl` or there is no space for any leaf on `subLvl` or there are less nodes to be placed in next `subLvl` than in current:
   * Take all leafs which have not been placed yet and place to `numNodesOnSubLvl`.
   * Create reverse calculation to obtain the needed `angleRelX` from circuit length made by all `numNodesOnSubLvl`. (This is needed to fix the overlapping leafs)
   * Apply new rotation to the `sphereVec`
   * Calculate `angleRelY` knowing the number of nodes in `subLvl`
   * Move `position` using `sphereVec` indicator.
   * Render vertex in `position` in `direction` of the owner
   * Render edge from owner to leaf
   * Apply a `angleRelY` rotation to `sphereVec` (our direction & distance ndicator)
   * Decrement `numNodesOnSubLvl`

## Next Steps:

When the input contains large, wide tree, the visualization could be not clear due to many intersections.
This need to be fixed as a next steps.
When the input contains large, deep tree, the `w3-walrus` will handle it gracefully.
