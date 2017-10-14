/*
To do list:
  3. Figure out side effect from color function.
  6. Fix tooltip centering.
  12. Fix tooltip with number labels.
  9. Make page buttons automatically made.
  10. Make page buttons work.
  11. Align things more naturally.
  13. Make legendmaking a function.
  14. Fix issue when page shrinks.
  15. Add option to select different years.
  16. Fix single/multiple select so it starts with right options
  17. Fix bug with clicking question numbers.
  18. Make endpoint to serve data as its needed so client doesn't download whole dataset.
  19. Fix glitchy pie thing.
*/


const calendarYear = 2016;
const buttonChangeEffect = 'single'; // Either single or multiple
var sheet_number = 1;
var questionsPerSheet = 10;
var color = d3.scaleOrdinal()
      .range(["#A80022", "#D8ADB6", "#F27991", "#992233", "#FFCCD6"])
      .domain(["A", "B", "C", "D", "E"]);

// What data we are using
var dataPath = 'data/';
var answerData = dataPath + 'anon_answer_data_' + calendarYear + '.csv';
var barData = dataPath + 'barchartData' + calendarYear + '.csv'


/*  This will be helpful for the pie chart to keep track of which one was clicked.  
    By default show no data. */ 
var questionNumber = -1; 

// Helper function for inverting a dictionary.  All values are now lists.
function invert(d){
  newDict = {};
  for (idx in Object.keys(d)){
    key = Object.keys(d)[idx]
    vals = d[key];
    if (typeof vals=='string'){
      vals = [vals];
    };
    for (idx in vals){
      val = vals[idx];
      if (newDict[val]){
        newDict[val] = newDict[val].concat([key]);
      }
      else {
        newDict[val] = [key];
      };
    };
  };
  return newDict;
};

// For Barchart
var margin = {top: 50, right: 25, bottom: 10, left: 125},
    width = 800 - margin.left - margin.right,
    height = 680 - margin.top - margin.bottom;
    padding = 0.25;

// For Piechart
var w = 200;
    h = 200;
    r = Math.min(w, h) / 2;

var arc = d3.arc()
  .innerRadius(r - 100)
  .outerRadius(r - 20);

// Function that calculates pie angles
var pie = d3.pie()
  .value(function(d) { return d.count; }) 
  .sort(null);

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
};

//For where the axes are, for bar chart.
var y = d3.scaleBand()
    .rangeRound([0, height])
    .padding(padding)

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var xAxis = d3.axisTop(x);

var yAxis = d3.axisLeft(y);

//Puts the chart on the page!
var barSVG = d3.select("#bar_holder").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var pieSVG = d3.select("#chartdiv").append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr('id', 'choice-pie')
  .append("g")
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

//Opening Values
var dataset1 = [
  { label: 'A', count: 100 },
  { label: 'B', count: 0 },
  { label: 'C', count: 0 },
  { label: 'D', count: 0 },
  { label: 'E', count: 0 }
];

// SOMETHING IS WRONG HERE
var path = pieSVG.selectAll("path") 
  // The pie function just calculates percentages.
  .data(pie(dataset1))   
  .enter() 
  .append("path")
  .style("fill", function(d) { return color(color(d.data.label)); })
  .attr("d", arc)
  .each(function(d) { this._current = d; }); // store the initial angles

//Sets initial values for which buttons are clicked'
var buttonClickedStatus = {
  'Male': true,
  'Female': true,
  'Freshman': true,
  'Sophomore': true,
  'Junior': false,
  'Senior': false
};

// Value of buttons if active and if not active.
var colorIfActive = {
  true: "#9B1B00",
  false: "#B7B7B7"
};

/* Computes and updates the background color of all buttons, 
   called every time change is called. */
function setButtonsBackgroundColor(){
  for(idx in Object.keys(buttonClickedStatus)){
    var buttonName = Object.keys(buttonClickedStatus)[idx];
    var property = document.getElementById('button' + buttonName);
    property.style.backgroundColor = "#B7B7B7";
    if(buttonClickedStatus[buttonName]){
      property.style.backgroundColor = "#9B1B00"
    };
  };
};

var filterBys = {
  'Gender': ['Male', 'Female'],
  'Year': ['Freshman', 'Sophomore', 'Junior', 'Senior']
};

// Custom function for changing focus based on recent click.
function updateButtonsStatus(choice){
  if (choice=='none'){
    // Do nothing to buttons
  }
  else if (buttonChangeEffect=='multiple'){
    buttonClickedStatus[choice] = !buttonClickedStatus[choice];
  }
  else if (buttonChangeEffect=='single'){ 
    category = invert(filterBys)[choice];
    for(idx in filterBys[category]){
        buttonClickedStatus[filterBys[category][idx]] = false;
    };
    buttonClickedStatus[choice] = true;
  }
  else throw 'Invalid Button Change Effect';
};


// Tallies answers into dict with keys A-E and values #responses for A, etc.
function tallyAnswers(data){
  var answerCounts = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'E': 0
  };
  for (i=0; i<data.length;i++) {
    key = data[i][questionNumber];
    if(Object.keys(answerCounts).indexOf(key) >=0) {
      answerCounts[key] += 1;
    };
  };
  return answerCounts;
};

// Takes a row and filters and returns a true if the row passes filters, else false.
function passesFilter(row, filters){
  return Object.keys(filters).reduce(function(bool, filter){
    return bool && (filters[filter].indexOf(row[filter]) >= 0);
  }, true)
};

// Given the click, determines what filter we have now.
function populateFilters(choice){
  var filters = {};
  function helper(choice){
    return buttonClickedStatus[choice] && (invert(filterBys)[choice]==filterBy);
  }
  for (idx in Object.keys(filterBys)){
    var filterBy = Object.keys(filterBys)[idx];  // either gender or year
    filters[filterBy] = filterBys[filterBy].filter(helper);
  };
  return filters;
}

// Prepare an array to be a pie chart.
function preparePie(array){
  function makeDatum(key){
    return {label: key, count: array[key]};
  };
  return Object.keys(array).map(makeDatum);
};

// Calculate path
function calculatePath(oldPath, answerCounts){
  if (Object.values(answerCounts).reduce(function(a, b){
    return a + b;}, 0) == 0) {
    var path = oldPath.data(pie(dataset1));
  }
  else {
    var path = oldPath.data(pie(preparePie(answerCounts)));
  };
  return path;
};

// Changes pie chart selection based on new click
function change(choice) {
  updateButtonsStatus(choice);
  setButtonsBackgroundColor();
  // Define and populate the filters for the data.
  var filters = populateFilters(choice);
  d3.csv(answerData, function(error, data) {
    var csv = data.filter(function(row) {return passesFilter(row, filters);});
    var answerCounts = tallyAnswers(csv);
    // Path is global variable
    path = calculatePath(path, answerCounts);
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
  } ); //Ends d3.csv
} //Ends change

options = ["A", "B", "C", "D", "E"];

// Given a bar, makes the text that should be displayed.
function makeOptionsText(d){
  var s = '';
  for(option in options){
    s += '<p>' + d['label' + options[option]] + '</p>'
  };
  return s;
}

function selectDataSubset(sheetNum){
  return allData.slice((sheetNum - 1) * questionsPerSheet, 
                        sheetNum * questionsPerSheet);
}

// TO DO: Factor this function so it can be called once for each legend.
function makeLegend(svg, legendTab, width, name){
  legendHolder = svg.append("g")
                    .attr("class", "legend-holder")
                    // .attr("id", "bar-legend-holder");
  var legend = legendHolder.selectAll('.' + name + '-legend')
    .data(color.domain().slice(0, 5))
    .enter().append("g")
    .attr("class", name + "-legend")
    .attr("transform", function(d, i) { return "translate(" + legendTab + "-35)"; });

  d3.selectAll("." + name + "-legend").append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  d3.selectAll("." + name + "-legend").append("text")
      .attr("x", 22)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "begin")
      .style("font" ,"10px sans-serif")
      .text(function(d) { return d; });

  d3.selectAll(".axis")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

  var move = width/2 - barLegendHolder.node().getBBox().width/2;
  d3.selectAll('.' + name + '-legend-holder').attr("transform", "translate(" + move  + ",0)");
}


function makeLegends(){
  var barLegendHolder = barSVG.append("g")
                          .attr("class", "legend-holder")
                          .attr("id", "bar-legend-holder");
  var pieLegendHolder = pieSVG.append("g")
                          .attr("class", "legend-holder")
                          .attr("id", "pie-legend-holder");

  var legendTabs = {
    bar: [0, 80, 160, 240, 320],
    pie: [0, 40, 80, 120, 160]
  };

  var barLegend = barLegendHolder.selectAll(".legend")
    .data(color.domain().slice(0, 5))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + legendTabs['bar'][i] + "-35)"; });

  var pieLegend = pieLegendHolder.selectAll(".legend")
    .data(color.domain().slice(0, 5))
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + legendTabs['pie'][i] + "-100)"; });

  d3.selectAll(".legend").append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  d3.selectAll(".legend").append("text")
      .attr("x", 22)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "begin")
      .style("font" ,"10px sans-serif")
      .text(function(d) { return d; });

  d3.selectAll(".axis")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

  var barMove = width/2 - barLegendHolder.node().getBBox().width/2;
  var pieMove = w/2 - pieLegendHolder.node().getBBox().width/2 - 100;
  d3.selectAll("#bar-legend-holder").attr("transform", "translate(" + barMove  + ",0)");
  d3.selectAll("#pie-legend-holder").attr("transform", "translate(" + pieMove  + ",0)");
}

function changeBars(data){
  // Adjust axes
  console.log(data);
  x.domain([0, d3.max(data, function(d) {return d.boxes["4"].x1;})]);
  y.domain(data.map(function(d) { return d.Question; }));
  console.log(y);
  d3.select('.y-axis')
    .call(yAxis)
  setButtonsBackgroundColor(); // Adjust buttons
  // Adjust data
  barSVG.selectAll(".bar").selectAll(".subbar")
        .data(function(d, i){ return data[i].boxes})

  d3.selectAll(".subrect").transition()
    .attr("x", function(d, i) { return x(this.parentNode.__data__.x0);})
    .attr("width", function(d, i) { return x(this.parentNode.__data__.x1) - 
                                           x(this.parentNode.__data__.x0); })

  d3.selectAll(".subbar text").transition()
    .attr("x", function(d) { return (x(this.parentNode.__data__.x0) +
                                     x(this.parentNode.__data__.x1)) / 2;})
    .attr("y", y.bandwidth()/2)
    .text(function(d) { 
      var label = this.parentNode.__data__.n;
      return label !== 0 ? label : ""; 
    })
}

// Does barchart setup (things that only need to happen once).
function setupBars(data){
  x.domain([0, d3.max(data, function(d) {return d.boxes["4"].x1;})]);
  y.domain(data.map(function(d) { return d.Question; }));
	setButtonsBackgroundColor();

  barSVG.append("g")
      .attr("class", "y-axis")
      .call(yAxis)

  var questions = barSVG.selectAll(".question")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

  var bars = questions.selectAll("rect")
    .data(function(d) { return d.boxes; })
    .enter().append("g")
      .attr("class", "subbar");

  bars.append("rect")
    .attr("height", y.bandwidth)
    .attr("x", function(d) { return x(d.x0); })
    .attr("width", function(d) { return x(d.x1) - x(d.x0); })
    .style("fill", function(d) { return color(d.name); })
    .attr("id", function(d){ return d["label"];})
    .attr("class", "subrect")
    .style("cursor", "pointer")
    .on('mouseover', function(d) {
      d3.select(this).style("fill", "red");
    })
    .on('mouseout', function(d) {
      d3.select(this).style("fill", function(d) { return color(d.name); });
    });
  d3.selectAll('.bar')
    .on('click', function(d){
      change("none");
      d3.select("#question-div p")
        .html('<span>' + d.RealQuestion + '<span>' + d['optionsText']);
      var a = d.Question.charAt(9)+ d.Question.charAt(10);
      if (a>9) {questionNumber=a} else {questionNumber=a.charAt(0)}; 
  })

  bars.append("text")
    .attr("x", function(d) { return (x(d.x0)+((x(d.x1)- x(d.x0))/2)); })
    .attr("y", y.bandwidth()/2)
    .attr("dy", "0.5em")
    .attr("dx", "0.5em")
    .style("font" ,"10px sans-serif")
    .style("text-anchor", "end")
    .style("fill", function(d, index) { return index==0 || index==3 ? "white" : "black"; })
    .style("cursor", "pointer")
    .text(function(d) { 
      return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : ""; 
    })
    .on('mouseover', function(d) {
      d3.select(this.previousElementSibling).style("fill", "red");
    })
    .on('mouseout', function(d) {
      d3.select("rect").style("fill", function(d) { return color(d.name); });
    });


  questions.insert("rect",":first-child")
    .attr("height", y.bandwidth)
    .attr("x", "1")
    .attr("width", width)
    .attr("fill-opacity", "0.5")
    .style("fill", "#F5F5F5")

  barSVG.append("g")
    .attr("class", "y axis")
  .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y2", height);

  makeLegends();
  // Make tooltip using special package
  Tipped.create('.bar rect', function (d){
    return d["id"];
  }, { 
    skin: 'light',
    offset: {x: 50}
  });
};  
// Ends sheet shift
    
// Function takes data (from a csv) and adds boxes attribute so we know sizing.
function addCustomAttributes(data){
  data.forEach(function(d) {
    var x0 = 0, idx = 0;
    d['optionsText'] = makeOptionsText(d);
    // TODO: Fix the below.  Color domain should only have 5 things.
    d.boxes = color.domain().slice(0, 5).map(function(name) { 
      return {label: d["label" + name],
              name: name, 
              x0: x0, 
              x1: x0 += parseInt(d[name]),
              n: d[options[idx++]]
             }; 
            });
  }); 
  return data;
};

function sheet_shift(n){
  changeBars(selectDataSubset(n));
}

// Load all data and set up the charts.
d3.csv(barData, function(error, data) {
  var preprocess = new Promise(
    function(resolve){
      resolve(addCustomAttributes(data));
    });

  preprocess.then(function(data){
    allData = data;
    setupBars(selectDataSubset(1));
  });
})





