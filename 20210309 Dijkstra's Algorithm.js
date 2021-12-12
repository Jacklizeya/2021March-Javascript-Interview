///////////////////graph.js

class Graph {
  constructor(isDirected = false, isWeighted = false) {
    this.vertices = [];
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
  }

  addVertex(data) {
    const newVertex = new Vertex(data);
    this.vertices.push(newVertex);
    return newVertex;
  }

  removeVertex(vertex) {
    this.vertices = this.vertices.filter(v => v !== vertex);
  }

  addEdge(vertexOne, vertexTwo, weight) {
    const edgeWeight = this.isWeighted ? weight : null;

    if (vertexOne instanceof Vertex && vertexTwo instanceof Vertex) {
      vertexOne.addEdge(vertexTwo, edgeWeight);
      if (!this.isDirected) {
        vertexTwo.addEdge(vertexOne, edgeWeight);
      }
    } else {
      throw new Error('Expected Vertex arguments.');
    }
  }

  removeEdge(vertexOne, vertexTwo) {
    if (vertexOne instanceof Vertex && vertexTwo instanceof Vertex) {
      vertexOne.removeEdge(vertexTwo);
      if (!this.isDirected) {
        vertexTwo.removeEdge(vertexOne);
      }
    } else {
      throw new Error('Expected Vertex arguments.');
    }
  }

  getVertexByValue(value) {
    return this.vertices.find(vertex => vertex.data === value);
  }

  print() {
    const vertexList = this.vertices;
    vertexList.forEach(vertex => vertex.print());
  }
}

class Vertex {
  constructor(data) {
    this.data = data;
    this.edges = [];
  }

  addEdge(vertex, weight) {
    if (vertex instanceof Vertex) {
      this.edges.push(new Edge(this, vertex, weight));
    } else {
      throw new Error('Edge start and end must both be Vertex');
    }
  }

  removeEdge(vertex) {
    this.edges = this.edges.filter(edge => edge.end !== vertex);
  }

  print() {
    const edgeList = this.edges.map(edge =>
        edge.weight !== null ? `${edge.end.data} (${edge.weight})` : edge.end.data) || [];

    const output = `${this.data} --> ${edgeList.join(', ')}`;
    console.log(output);
  }
}

class Edge {
  constructor(start, end, weight = null) {
    this.start = start;
    this.end = end;
    this.weight = weight;
  }
}

module.exports = {
  Graph,
  Vertex,
  Edge,
};



//***************************PriorityQueue.js

class PriorityQueue {
  constructor() {
    this.heap = [null];
    this.size = 0;
  }

  add({vertex, priority}) {
    this.heap.push({vertex, priority});
    this.size++;
    this.bubbleUp();
  }

  isEmpty() {
    return this.size === 0;
  }

  popMin() {
    if (this.size === 0) {
      return null 
    }
    const min = this.heap[1];
    this.heap[1] = this.heap[this.size];
    this.size--;
    this.heap.pop();
    this.heapify();
    return min;
  }

  bubbleUp() {
    let current = this.size;
    while (current > 1 && this.heap[getParent(current)].priority > this.heap[current].priority) {
      this.swap(current, getParent(current));
      current = getParent(current);
    }
  }

  heapify() {
    let current = 1;
    let leftChild = getLeft(current);
    let rightChild = getRight(current);
    // Check that there is something to swap (only need to check the left if both exist)
    while (this.canSwap(current, leftChild, rightChild)){
      // Only compare left & right if they both exist
      if (this.exists(leftChild) && this.exists(rightChild)) {
        // Make sure to swap with the smaller of the two children
        if (this.heap[leftChild].priority < this.heap[rightChild].priority) {
          this.swap(current, leftChild);
          current = leftChild;
        } else {
          this.swap(current, rightChild);
          current = rightChild;
        }
      } else {
        // If only one child exist, always swap with the left
        this.swap(current, leftChild);
        current = leftChild;
      }
      leftChild = getLeft(current);
      rightChild = getRight(current);
    }
  }

  swap(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  exists(index) {
    return index <= this.size;
  }

  canSwap(current, leftChild, rightChild) {
    // Check that one of the possible swap conditions exists
    return (
      this.exists(leftChild) && this.heap[current].priority > this.heap[leftChild].priority
      || this.exists(rightChild) && this.heap[current].priority > this.heap[rightChild].priority
    );
  }
}

const getParent = current => Math.floor((current / 2));
const getLeft = current => current * 2;
const getRight = current => current * 2 + 1;

module.exports = PriorityQueue;


//*************************dijkstras.js

const testSingleVertexGraph = require('./testSingleVertexGraph.js');
const testSimpleGraph = require('./testSimpleGraph.js');
const testDisconnectedGraph = require('./testDisconnectedGraph.js');
const testGraph = require('./testGraph.js');
const PriorityQueue = require('./PriorityQueue.js');

const dijkstras = (graph, startingVertex) => {
	const distances = {};
	const previous = {};
	const queue = new PriorityQueue();

	queue.add({ vertex: startingVertex, priority: 0 });

	graph.vertices.forEach((vertex) => {
		distances[vertex.data] = Infinity;
		previous[vertex.data] = null;
	});

	distances[startingVertex.data] = 0;

	while (!queue.isEmpty()) {
		const { vertex } = queue.popMin();

		vertex.edges.forEach((edge) => {
			const alternate = edge.weight + distances[vertex.data];
			const neighborValue = edge.end.data;

			if (alternate < distances[neighborValue]) {
				distances[neighborValue] = alternate;
				previous[neighborValue] = vertex;

				queue.add({ vertex: edge.end, priority: distances[neighborValue] })
			}
		})
	}

	return { distances, previous };
};

const results = dijkstras(testGraph, testSimpleGraph.vertices[0]);
console.log(results);

module.exports = dijkstras;


//***************************shortestPath.js

const testGraph = require('./testGraph.js');
const dijkstras = require('./dijkstras.js');

const shortestPathBetween = () => {

};

// Retrieve shortest path between vertices A and G
const a = testGraph.getVertexByValue('A');
const g = testGraph.getVertexByValue('G');
const results = shortestPathBetween(testGraph, a, g);

module.exports = shortestPathBetween;

