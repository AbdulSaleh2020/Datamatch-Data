// This function still needs to be updated for style, etc.

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
  // console.log('findcolor called');
  // console.log(d);
  // console.log(selectBy);
  // console.log(d[selectBy]);
  // console.log(lookupColor(d[selectBy]));
  return lookupColor(d[selectBy]);
}

// Select by a different option from among Gender, House, Year
function setSelection(newSelection) {
  console.log(newSelection);
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
    console.log(sourceNode);
    console.log(targetNode);
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
  console.log(data);
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

  // Display data
  console.log(displayData);

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
    .attr("x1", function(d) {
      if (d.source.x == 0) {
        console.log('error error');
        console.log(d);
      }
      return d.source.x;
    })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("cx", function(d) {
      if (d.x ==0){
      console.log(x);
      }
      return d.x;
    })
    .attr("cy", function(d) { return d.y; });
}

function dragstarted(d) {
  // if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  // d.fx = d.x;
  // d.fy = d.y;
}

function dragged(d) {
  // d.fx = d3.event.x;
  // d.fy = d3.event.y;
}

function dragended(d) {
  // if (!d3.event.active) simulation.alphaTarget(0);
  // d.fx = null;
  // d.fy = null;
}











// var force = d3.layout.force()
//   .size([w,h])
//   .charge(-1000)
//   .distance(150)
//   .friction(.1);
//
//
// function labeling(d){
//   if (clicked==1){
//     return d.Gender;
//   } else if (clicked==2){
//     return d.House;
//   } else if (clicked==3){
//     return d.Year;
//   }
// }
//


//
// $("#input").change(function(){
//   id_input = $("#input").val();
//   resetPage(id_input);
// });
//
//
// function resetPage(id){
//   $("svg").empty();
//   console.log('reset page called');
//
//   var SELECTED_NODE_ID = id;
//
//   // FILTERING THE EDGES BY THE SELECTED_NODE_ID
//   var node_id_set = new Set();
//   var edges = [];
//   isCorrectId = function(n){ return n.source == SELECTED_NODE_ID || n.target == SELECTED_NODE_ID };
//   data.edges.filter(isCorrectId).forEach(function(e) {
//     console.log(e);
//     console.log(data);
//     var sourceNode = data.nodes.filter(function(n) {return n.Id == e.source})[0],
//       targetNode = data.nodes.filter(function(n) {return n.Id == e.target; })[0];
//     if (targetNode && sourceNode){
//       node_id_set.add(sourceNode.Id);
//       node_id_set.add(targetNode.Id);
//     }
//     edges.push({'source': sourceNode, 'target': targetNode, 'value': e.Value});
//   });
//
//   //FILTERING THE NODES TO GET ONLY THE ONES THAT WE NEED
//   var jsonNodes = data.nodes.filter(function(n) {
//     return node_id_set.has(n.Id);
//   });
//
//   console.log(force);
//
//   force.nodes(jsonNodes) //previously json.nodes
//     .links(edges) // previously json.edges
//     .start();
//
//   var links = svg.selectAll('.link')
//     .data(edges) // previously json.edges
//     .enter().append('line')
//     .attr('class', 'link');
//
//   var nodes = svg.selectAll('.node')
//     .data(jsonNodes) // previously json.nodes
//     .enter().append("g")
//     .attr('class', 'node');
//
//   nodes.append("circle")
//     .attr("r","9")
//     .style('fill', function(d){return find_color(d)})
//     .call(force.drag);
//
//   nodes.append("text")
//     .attr("dx", 12)
//     .attr("dy", ".35em")
//     .text(function(d) { return labeling(d) });
//
//   if (clicking ==0){
//     d3.select("#gender").classed("selected", true);
//   }
//
//   d3.selectAll("input.filter-button").on('click', function(){
//     d3.selectAll("input.filter-button").classed("selected", false);
//     d3.select(this).classed("selected", true);
//     clicking = clicking + 1;
//   });
//
//   force.on("tick", function() {
//     links.attr("x1", function(d) { return d.source.x; })
//       .attr("y1", function(d) { return d.source.y; })
//       .attr("x2", function(d) { return d.target.x; })
//       .attr("y2", function(d) { return d.target.y; });
//
//     nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//   });
//
//   var svg = d3.select('#network-container').append('svg')
//     .attr('width', w)
//     .attr('height', h);
//
//
//         // Used when trying to load a super big network
//         // function start() {
//         //   var ticksPerRender = 3;
//         //   requestAnimationFrame(function render() {
//         //     for (var i = 0; i < ticksPerRender; i++) {
//         //       force.tick();
//         //     }
//         //     links
//         //       .attr('x1', function(d) { return d.source.x; })
//         //       .attr('y1', function(d) { return d.source.y; })
//         //       .attr('x2', function(d) { return d.target.x; })
//         //       .attr('y2', function(d) { return d.target.y; });
//         //     // nodes
//         //     //   .attr('cx', function(d) { return d.x; })
//         //     //   .attr('cy', function(d) { return d.y; });
//
//         //         nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//
//         //     if (force.alpha() > 0.05) {
//         //       requestAnimationFrame(render);
//         //     }
//         //   })
//         // }
// }