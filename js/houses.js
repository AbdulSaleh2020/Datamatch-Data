/* TODO:
  1.  Clean this up.
  2.  Make buttons autogenerate.
  3.  Make option for Freshmen focus within data.
  
*/

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;
var legendRectSize = 20;
var legendSpacing = 4;
var dataPath = 'data/matchmatrix.csv';



var enterClockwise = {
  startAngle: 0,
  endAngle: 0
};

var enterAntiClockwise = {
  startAngle: Math.PI * 2,
  endAngle: Math.PI * 2
};

var color = d3.scaleOrdinal()
  .domain([])
  .range(["#A80022", "#D8ADB6", "#F27991", "#992233", "#FFCCD6", "#881133", 
    "#AA8888", "#DF2047", "#FF99AE", "#A3465C", "#881122", "#660011", "#C5677B"]);

var pie = d3.pie()
  .sort(null)

var arc = d3.arc()
  .innerRadius(radius - 100)
  .outerRadius(radius - 20)
  

var tooltip = d3.select('#chart')                               
                .append('div')                                                
                .attr('class', 'tooltip'); 

tooltip.append('div')                                           
.attr('class', 'label'); 

var svg = d3.select("#chart-container")
.append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", function(d){
  		return "translate(" + width / 2 + "," + height / 2 + ")";
})

d3.csv(dataPath, function(error, data) {
  console.log(data);
  var path = svg.datum(data).selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("fill", function(d, i){ return color(i); })
      .each(function(d) { 
        this._current = {
          data: d.data,
          value: d.value,
          startAngle: enterClockwise.startAngle,
          endAngle: enterClockwise.endAngle
        };
      });                 

  d3.selectAll("input.filter-button").on('click', function(){
      var value = this.value;
      pie.value(function(d) { 
          return d[value]; 
      }); // change the value function
      path = path.data(pie); // compute the new angles
      path.transition().duration(750).attrTween("d",arcTween); // redraw the arcs
      d3.selectAll("input.filter-button").classed("selected", false)
      d3.select(this).classed("selected", true);
  });

  var legend = svg.selectAll('.legend')
      .data(["Leverett", "Kirkland", "Cabot", "Lowell", "Adams", "Dunster", "Mather", "Winthrop", "Pforzheimer", "Currier", "Quincy", "Eliot", "Freshmen"])
      .enter()
      .append('g')
      .attr('class', 'legend')
       .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset =  height * color.domain().length / 2.4;
          var horz = -370;
          var vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

  legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);
  legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

  array = ["Leverett", "Kirkland", "Cabot", "Lowell", "Adams", "Dunster", "Mather", "Winthrop", "Pforzheimer", "Currier", "Quincy", "Eliot", "Freshmen"]

  path.on('mouseover', function(d) {
    d3.select("g").append("text")
      .attr("id", "myText")
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text(array[d.index].toString() +" (" + String(d.value) + ")");
  });

  path.on('mouseout', function(d) { 
     d3.selectAll("#myText").remove()
      // tooltip.style('display', 'none');
     });

  path.exit()
      .transition()
      .duration(750)
      .attrTween('d', arcTweenOut)
      .remove() // now remove the exiting arcs
});

function type(d) {
  d.Leverett = +d.Leverett;
  d.Quincy = +d.Quincy;
  d.Kirkland = +d.Kirkland;
  d.Currier = +d.Currier;
  d.Winthrop = +d.Winthrop;
  d.Freshmen = +d.Freshmen;
  d.Cabot = +d.Cabot;
  d.Pforzheimer = +d.Pforzheimer;
  d.Adams = +d.Adams;
  d.Eliot = +d.Eliot;
  d.Dunster = +d.Dunster;
  d.Mather = +d.Mather;
  d.Lowell = +d.Lowell;
  return d;
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

// Interpolate exiting arcs start and end angles to Math.PI * 2
// so that they 'exit' at the end of the data
function arcTweenOut(a) {
  var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
  this._current = i(0);
  return function (t) {
    return arc(i(t));
  };
}