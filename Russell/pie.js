<script>
var width = 100,
    height = 100,
    radius = Math.min(width, height) / 2;

var enterClockwise = {
    startAngle: 0,
    endAngle: 0
    };

var enterAntiClockwise = {
    startAngle: Math.PI * 2,
    endAngle: Math.PI * 2
    };
        
var color = d3.scale.ordinal()
    .domain(["Adams", "Cabot", "Currier", "Dunster", "Leverett", "Eliot", "Kirkland", "Lowell", "Mather", "Pforzheimer", "Quincy", "Winthrop", "Freshmen"])
    .range(["#A80022", "#D8ADB6", "#F27991", "#992233", "#FFCCD6", "#881133", "#AA8888", "#DF2047", "#FF99AE", "#A3465C", "#881122", "#660011", "#C5677B"]);
        
var pie = d3.layout.pie()
    .sort(null)
        
        
var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);
        
var svg = d3.select("#chart-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("matchmatrixold.csv", type, function(error, data) {
    var path = svg.datum(data).selectAll("path")
        .data(pie)
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc(enterClockwise))
        .each(function(d) { 
            this._current = {
                data: d.data,
                value: d.value,
                startAngle: enterClockwise.startAngle,
                endAngle: enterClockwise.endAngle
            };
        });

    path.on('mouseover', function(d) {
        var total = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? d.count : 0;                       // UPDATED
            }));
        tooltip.select('.label').html(d.data);
        tooltip.style('display', 'block');
    });
          
    path.on('mouseout', function() {
        tooltip.style('display', 'none');
    });


    d3.selectAll("input.filter-button").on('click', change); 
        function change() {
         // clearTimeout(timeout);
            var value = this.value;
            pie.value(function(d) { 
              return d[value]; 
            }); // change the value function
            path = path.data(pie); // compute the new angles
                path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
          }
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
</script>