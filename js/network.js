// This function still needs to be updated for style, etc.

var clicking = 0;
var total_size;
var data;
var displayData;

d3.json('data/jsondatabyID.json', function(json) {
  data = json;
  total_size = json.nodes.length;
});

var w = 960,
  h = 440;

var svg = d3.select('#network-container').append('svg')
  .attr('width', w)
  .attr('height', h);

var force = d3.layout.force().size([w,h])
  .charge(-1000)
  .distance(150)
  .friction(.1);

function returnForce(){
  return force;
}

function returnSVG(){
  return svg;
}

var id_input;
var clicked = 1;
var selectBy = 'gender'; // Data to sort by.

function changeclick(x) {
  if (x < 4){clicked = x;}
  resetPage(id_input);
}

function assign_random(){
  id_input = Math.round(Math.floor(Math.random() * total_size));
}

$("#input").change(function(){
  id_input = $("#input").val();
  resetPage(id_input);
});


function resetPage(id){
  $("svg").empty();

  var SELECTED_NODE_ID = id;

  // FILTERING THE EDGES BY THE SELECTED_NODE_ID
  var node_id_set = new Set();
  var edges = [];
  isCorrectId = function(n){ return n.source == SELECTED_NODE_ID || n.target == SELECTED_NODE_ID };
  data.edges.filter(isCorrectId).forEach(function(e) {
    var sourceNode = json.nodes.filter(function(n) {return n.Id == e.source})[0],
      targetNode = json.nodes.filter(function(n) {return n.Id == e.target; })[0];
    if (targetNode && sourceNode){
      node_id_set.add(sourceNode.Id);
      node_id_set.add(targetNode.Id);
    }
    edges.push({'source': sourceNode, 'target': targetNode, 'value': e.Value});
  });

  //FILTERING THE NODES TO GET ONLY THE ONES THAT WE NEED
  var jsonNodes = data.nodes.filter(function(n) {
    return node_id_set.has(n.Id);
  });

  force.nodes(jsonNodes) //previously json.nodes
    .links(edges) // previously json.edges
    .start();

  var links = svg.selectAll('.link')
    .data(edges) // previously json.edges
    .enter().append('line')
    .attr('class', 'link');

  var nodes = svg.selectAll('.node')
    .data(jsonNodes) // previously json.nodes
    .enter().append("g")
    .attr('class', 'node');



  function labeling(d){
    if (clicked==1){return d.Gender;} else if (clicked==2){return d.House;} else if (clicked==3){return d.Year;}
  }

  nodes.append("circle")
    .attr("r","9")
    .style('fill', function(d){return find_color(d)})
    .call(force.drag)
  nodes.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return labeling(d) });

  if (clicking == 0){
    d3.select("#gender").classed("selected", true);
  }

  d3.selectAll("input.filter-button").on('click', function(){
    d3.selectAll("input.filter-button").classed("selected", false)
    d3.select(this).classed("selected", true);
    clicking = clicking + 1;
  });

  force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });


  var clicking = 0;
  var total_size;
  d3.json('data/jsondatabyID.json', function(json) {
    total_size = json.nodes.length
  });


  var id_input;
  var clicked =1;

  function changeclick(x) {
    if (x<4){clicked = x;}
    resetPage(id_input)
  }

  function assign_random(){
    id_input = Math.round(Math.floor(Math.random() * total_size));
  }

  var w = 960,
    h = 440;

  var svg = d3.select('#network-container').append('svg')
    .attr('width', w)
    .attr('height', h);

  var force = d3.layout.force()
    .size([w,h])
    .charge(-1000)
    .distance(150)
    .friction(.1);


    $("#input").change(function(){
      id_input = $("#input").val();
      resetPage(id_input);
    });

    function resetPage(id){
      $("svg").empty();

        // FILTERING THE EDGES BY THE SELECTED_NODE_ID
        var node_id_set = new Set();
        var edges = [];
        json.edges.filter(function(n) {return (n.source == SELECTED_NODE_ID || n.target == SELECTED_NODE_ID)})
          .forEach(function(e) {
            var sourceNode = json.nodes.filter(function(n) {return n.Id == e.source})[0],
              targetNode = json.nodes.filter(function(n) {return n.Id == e.target; })[0];
            if (targetNode && sourceNode)
            {
              node_id_set.add(sourceNode.Id);
              node_id_set.add(targetNode.Id);
            }
            edges.push({'source': sourceNode, 'target': targetNode, 'value': e.Value});
          });

        //FILTERING THE NODES TO GET ONLY THE ONES THAT WE NEED
        var jsonNodes = json.nodes.filter(function(n) {
          return node_id_set.has(n.Id);
        });

        force
        //.on('start', start)
          .nodes(jsonNodes) //previously json.nodes
          .links(edges) // previously json.edges
          .start();

        var links = svg.selectAll('.link')
          .data(edges) // previously json.edges
          .enter().append('line')
          .attr('class', 'link');

        var nodes = svg.selectAll('.node')
          .data(jsonNodes) // previously json.nodes
          .enter().append("g")
          .attr('class', 'node')

        function find_color(d){
          if (d.Gender == "Female" && clicked==1) {return '#FF3368';} else if (d.Gender== "Male" && clicked==1) {return '#0021B1';} else if (d.House == "Adams" && clicked==2) {return '#b57dce';} else if (d.House== "Cabot" && clicked ==2) {return '#5eabff';} else if (d.House== "Currier" && clicked ==2) {return '#b0ff32';} else if (d.House== "Dunster" && clicked ==2) {return '#82072a';} else if (d.House== "Leverett" && clicked ==2) {return '#ffd70f';} else if (d.House== "Eliot" && clicked ==2) {return '#0021B1';} else if (d.House== "Kirkland" && clicked ==2) {return '#0021B1';} else if (d.House== "Lowell" && clicked ==2) {return '#000e93';} else if (d.House== "Mather" && clicked ==2) {return '#ff8800';} else if (d.House== "Pforzheimer" && clicked ==2) {return '#2a8c00';} else if (d.House== "Quincy" && clicked ==2) {return '#00c4b3';} else if (d.House== "Winthrop" && clicked ==2) {return '#dac4ff';} else if (d.House== "Straus" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Pennypacker" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Thayer" && clicked ==2) {return '#0021B1';} else if (d.House== "Canaday" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Mower" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Holworthy" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Hollis" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Greenough" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Weld" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Matthews" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Grays" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Lionel" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Mass Hall" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Hurlbut" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Wigglesworth" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Stoughton" && clicked ==2) {return '#a3e4ff';} else if (d.House== "Apley" && clicked ==2) {return '#a3e4ff';} else if (d.Year == "Freshman" && clicked ==3) {return '#edff54';} else if (d.Year== "Sophomore" && clicked ==3) {return '#6be5e5';} else if (d.Year== "Junior" && clicked ==3) {return '#ff884c';} else if (d.Year== "Senior" && clicked ==3) {return '#e0332a';}
        }

        function labeling(d){
          if (clicked==1){return d.Gender;} else if (clicked==2){return d.House;} else if (clicked==3){return d.Year;}
        }

        nodes.append("circle")
          .attr("r","9")
          .style('fill', function(d){return find_color(d)})
          .call(force.drag)
        nodes.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text(function(d) { return labeling(d) });

        if (clicking == 0){
          d3.select("#gender").classed("selected", true)
        }

        d3.selectAll("input.filter-button").on('click', function(){
          d3.selectAll("input.filter-button").classed("selected", false)
          d3.select(this).classed("selected", true);
          clicking = clicking + 1;
        });

        force.on("tick", function() {
          links.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

          nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });


        // Used when trying to load a super big network
        // function start() {
        //   var ticksPerRender = 3;
        //   requestAnimationFrame(function render() {
        //     for (var i = 0; i < ticksPerRender; i++) {
        //       force.tick();
        //     }
        //     links
        //       .attr('x1', function(d) { return d.source.x; })
        //       .attr('y1', function(d) { return d.source.y; })
        //       .attr('x2', function(d) { return d.target.x; })
        //       .attr('y2', function(d) { return d.target.y; });
        //     // nodes
        //     //   .attr('cx', function(d) { return d.x; })
        //     //   .attr('cy', function(d) { return d.y; });

        //         nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        //     if (force.alpha() > 0.05) {
        //       requestAnimationFrame(render);
        //     }
        //   })
        // }
      });
    }
  });
}