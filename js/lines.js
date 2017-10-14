/* Incomplete work in update function.  Goal is to update axes dynamically and only
   redraw lines that have to by update rule.  Also I just removed some code that 
   wasn't necessary for buttons, so it would be good to see if buttons still work. */

var clickedVar = 'All';
var year = 2017;

// Removes previous lines and resets variables.
function clicked(n){
  d3.select("g").selectAll("*").remove()
  clickedVar = n;
}

var svg = d3.select("svg"),
    margin = {top: 70, right: 80, bottom: 90, left: 100},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    lineSpace = svg.append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                   .id("line-holder");

//Define x and y axis scales 
var x = d3.scaleTime()
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .rangeRound([height, 0]);
//Used to draw the paths
var line = d3.line()
    .x(function(d) { return x(d.date);})
    .y(function(d) { return y(d.response); });

// Parameters for each line drawn.
var lineParameters = {
  'all': {'All': '#215fc4'},
  'gender': {'Female': '#FF3368',
             'Male': '#215fc4'},
  'class_year': {'Freshman': '#6be5e5',
                 'Sophomore': '#6be5e5',
                 'Junior': '#ff884c',
                 'Senior': '#e0332a'},
  'dorm': {'Mather': '#ff8800',
           'Dunster': '#82072a',
           'Leverett': '#ffd70f',
           'Kirkland': '#8c00ff',
           'Eliot': '#ff3700',
           'Winthrop': '#dac4ff',
           'Lowell': '#000e93', 
           'Adams': '#b57dce',
           'Quincy': '#00c4b3',
           'Cabot': '#5eabff',
           'Currier': '#b0ff32', 
           'Pforzheimer': '#2a8c00'
  }
};
// Translates button name to attribute within data.
var translation = {
  'House': 'dorm',
  'Gender': 'gender',
  'Year': 'class_year', 
  'All': 'all'
};

// Given a category, computes what biggest category will be (to know axes)
function findExtent(array, attrName){
  var counts = {};
  array.forEach(function(x) { counts[x[attrName]] = (counts[x[attrName]] || 0)+1; });
  return [0, Math.max(...Object.values(counts))];
};

// Called before anything is plotted.  Called only once.
function processData(timesArray){
  timesArray = timesArray.filter(function(d){return (d.signup_time != null);});
  timesArray.forEach(function(d) {
      d.date = new Date(Date.parse(d.signup_time));
    });
  //Sort times
  timesArray.sort(function (a,b) {return (new Date(a.date) - new Date(b.date))})
  var total = 1;
  timesArray.forEach(function(d){
    d.response = total++;
  });
  return timesArray;
};

// This function is called on every click
function plotAll(timesArray){
  rawAttributeName = translation[clickedVar];
  options = lineParameters[rawAttributeName];
  // Set domains to be the total stretch of all data.
  x.domain(d3.extent(timesArray, function(d) { return d.date; }));
  y.domain(findExtent(timesArray, rawAttributeName));

  for (key_idx in Object.keys(options)){
    key = Object.keys(options)[key_idx];
    new_array = timesArray.filter(function(d){return (rawAttributeName=='all' ||
                                                       d[rawAttributeName]==key);})
    // Give each student a position value
    var total = 1;
    new_array.forEach(function(d){
      d.response = total;
      total += 1;
    });
    g.append("path")
      .datum(new_array)
      .attr("d", line)
      .attr("fill", "none")
      .attr("id", key)
      .attr("class", "line")
      .attr("stroke", options[key])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .style("stroke-width", "2.5px")
      .on("mouseover", function (d) {       
        d3.select(this)                        
        .style("stroke-width",'6px');
        
        d3.select("g").append("text")
                 .attr("class", "myText")
                 .attr("text-anchor", "middle")
                 .style("font-size", "18px")
                 .attr("x", 400)
                 .attr("y", 40)
                 .text(this.id);
        })
      .on("mouseout", function(d) { 
        d3.selectAll(".myText").remove();
        d3.select(this)
        .style("stroke-width",'2.5px')});
  };

  //Axes Stuff
  g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Number of People Signed Up");

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
        .attr("fill", "#000")
        .attr("x", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
    .select(".domain")
      .remove();
};

// Assumes timesArray is sorted by time.
function updateData(timesArray) {
  updateButtonColor();
  rawAttributeName = translation[clickedVar];
  options = lineParameters[rawAttributeName];
  // Set domains to be the total stretch of all data.
  x.domain(d3.extent(timesArray, function(d) { return d.date; }));
  y.domain(findExtent(timesArray, rawAttributeName));

  // Data keeps track of which data to use in each line.  Responses keeps counts.
  // Data has one array for each key, and one key for each option.
  var data = {};
  var responses = {};
  console.log(timesArray);
  // Partition timesArray by rawAttributeName
  timesArray.forEach(function(d){
    d.response = responses[d[rawAttributeName]] || 1;
    responses[d[rawAttributeName]] = responses[d[rawAttributeName]] + 1 || 2;
    data[d[rawAttributeName]] = data[d[rawAttributeName]] || [];
    data[d[rawAttributeName]].push(d);
  });
  console.log(data);
  // Select the section we want to apply our changes to
  // var selection = d3.select("body");
  // Make the changes
  d3.select("#line-holder")
    .data(function(d){console.log(d); return data[this.id]})
    .attr("d", line)
    .transition().duration(750);
  d3.select(".x.axis") // change the x axis
    .call(d3.axisBottom(x))
    .transition().duration(750);
  d3.select(".y.axis") // change the y axis
    .call(d3.axisBottom(y))
    .transition().duration(750);
  }


function XHR(query) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Get times, then process the data.
      finishUp(processData(JSON.parse(this.responseText).times));
    }
  };
  xhttp.open("GET", query, true);
  xhttp.send();
}

// Get the data that we want to use
if (year == 2016){
  d3.json(dataSource, function(d) {
    data = d.times;
    data.sort(function (a,b) {return (new Date(a.date) - new Date(b.date))});
  });
}
else if (year == 2017){
  XHR("https://api.datamatch.hcs.harvard.edu/times");
  setTimeout(function() {
    location.reload();
  }, 10*60*1000);
}

// This is its own function because it must be called asyncronously
function finishUp(d){
  plotAll(d);
  d3.selectAll("input.filter-button").on('click', function(){
    updateData(d);
  });
}

