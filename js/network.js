/* Bugs remaining:
  * Edges won't print out
  * Sometimes after many updates it crashes.  Async problem?
 */


var data;
var selectBy = 'Gender'; // Data to sort by.
var uniqueIds;

var w = 960;
var h = 440;

var svg = d3.select('#network-container').append('svg')
  .attr('width', w)
  .attr('height', h);

function assignRandom(){
  var idx = Math.round(Math.floor(Math.random() * uniqueIds.length));
  return uniqueIds[idx];
}

function findColor(d){
  return lookupColor(d[selectBy]);
}

// Select by a different option from among Gender, House, Year
function setSelection(newSelection) {
  if (newSelection!='Same'){
    selectBy = newSelection;
  }
  updateNetwork();
}

function getGraphData(id){
  var nodes = new Set();
  var edges = [];
  isCorrectId = function(n){ return n.source==id || n.target==id };
  data.edges.filter(isCorrectId).forEach(function(e) {
    var sourceNode = data.nodes.filter(function(n) {return n.Id == e.source; })[0];
    var targetNode = data.nodes.filter(function(n) {return n.Id == e.target; })[0];
    if (targetNode && sourceNode){
      nodes.add(sourceNode.Id);
      nodes.add(targetNode.Id);
    }
    edges.push({'source': sourceNode,
                'target': targetNode});
  });
  return {
    edges: edges,
    nodes: data.nodes.filter(function(n) {
      return nodes.has(n.Id);
    })
  };
}

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.Id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(w / 2, h / 2));

d3.json("data/jsondatabyID.json", function(error, graph) {
  if (error) throw error;
  data = graph;
  data.nodes.forEach(function(d){
    d.Id = +d.Id;
  })
  uniqueIds = data.nodes.map(function (d) {
    return d.Id;
  });
  updateNetwork();
});

function updateNetwork(){
  // Reset the page
  $("svg").empty();
  // Set display data to what you want.
  var displayData = getGraphData(assignRandom());

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(displayData.edges)
    .enter().append("line");

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(displayData.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", function(d) { return findColor(d); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.Id; });

  simulation
    .nodes(displayData.nodes)
    .on("tick", function(){
      ticked(link, node);
    });

  simulation.force("link")
    .links(displayData.edges);
};

// Details of d3 Force
function ticked(link, node) {
  link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}