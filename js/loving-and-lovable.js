/*
  TODO:
    1. Clean up (rename things, delete useless code, refactor).
    2. Remove need to hardcode in house names.
    3. Figure out or delete legend code at the end.
    4. Live load this or no?
    5. Make mouseover better.
*/
var dataPath = 'data/matchcomposition.csv';

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d["Likes Given"];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Likes Received"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d["Color"];},
    color = d3.scale.category20();

// add the graph canvas to the body of the webpage
var svg = d3.select("#network-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// x-axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Loving");

// y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Lovable");

update();

//d3.select("#HouseCheck").on("click",update);
//d3.select("#GenderCheck").on("click",update);
//d3.select("#YearCheck").on("click",update);

//Define click variables
var genderclicked = 1;
var yearclicked = 1;
var houseclicked = 1;

function update(thing){
// load data
if (thing == "gender") {
  genderclicked = (genderclicked + 1) %2 
}
else if (thing == "year") {
  yearclicked = (yearclicked+1) %2
}
else {
  houseclicked = (houseclicked+1) %2
}

upperhouselist = ["Leverett", "Kirkland", "Cabot", "Lowell", "Adams", "Dunster", "Mather", "Winthrop", "Pforzheimer", "Currier", "Quincy", "Eliot"]

lowerhouselist = ["Holworthy", "Thayer", "Canaday", "Apley", "Mass Hall", "Lionel", "Greenough", "Grays", "Hurlbut", "Matthews", "Mower", "Pennypacker", "Straus", "Wigglesworth", "Weld", "Hollis", "Stoughton"]

dictionary = []
//Load Data
for (i = 0; i < upperhouselist.length; i++){
  dictionary[upperhouselist[i]] = {Sophomore:{Male:{likes_given:0,likes_received:0}, Female:{likes_given:0,likes_received:0}}, Junior: {Male:{likes_given:0,likes_received:0},Female:{likes_given:0,likes_received:0}}, Senior:{Male: {likes_given:0,likes_received:0},Female:{likes_given:0,likes_received:0}}}
}

for (i = 0; i < lowerhouselist.length; i++){
  dictionary[lowerhouselist[i]] = {Freshman:{Male:{likes_given:0,likes_received:0}, Female:{likes_given:0,likes_received:0}}}
}

liked_array = []
for (i = 0; i < 5000 ; i++){
  liked_array[i] = 0
}

// This is for if we want to live load data - I think?
// d3.json("../models/address.json", function(d) {
//   people_array = d.people
//   participants = people_array.length
//   people_array
//   .forEach(function(d) {
//     accepted = d.accepted
//     dictionary[d.dorm][d.class_year][d.gender]["likes_given"] += accepted.length
//     for (i = 0; i < accepted.length; i++){
//       liked_array[accepted[i]] += 1
//     } 
//   })
//   people_array.forEach(function(d){
//     dictionary[d.dorm][d.class_year][d.gender]["likes_received"] += liked_array[d.id]
//   })
// })


d3.csv(dataPath, function(error, data) {
  //newData = data.filter(function(d,i){return d % 2 == 0;});
  //newData = data;
  newData = [];

  // change string (from CSV) into number format
  data.forEach(function(d) {
    if (d.Delimiter == d["House"]){
      d["Participation"] = +d["Participation"];
      d["Likes Given"] = +d["Likes Given"];
      d["Likes Received"] = +d["Likes Received"];
    }
  });

var property = document.getElementById('GenderCheck');
    if(genderclicked==1){property.style.backgroundColor = "#9B1B00"} else if(genderclicked==0){property.style.backgroundColor = "#B7B7B7"};
var property = document.getElementById('HouseCheck');
    if(houseclicked==1){property.style.backgroundColor = "#9B1B00"} else if(houseclicked==0){property.style.backgroundColor = "#B7B7B7"};
var property = document.getElementById('YearCheck');
    if(yearclicked==1){property.style.backgroundColor = "#9B1B00"} else if(yearclicked==0){property.style.backgroundColor = "#B7B7B7"};

  var sorted = {};
  for (var i = 0; i < data.length; i++) {
    var description = "";
    var colortype = "";
    //if(d3.select("#GenderCheck").classed("selected", true)){
    if (genderclicked == 1){
      colortype = data[i]["Gender"];
    }
    //if(d3.select("#YearCheck").classed("selected", true)){
    if (yearclicked == 1){
      colortype = data[i]["Year"];
    }
    //if(d3.select("#HouseCheck").classed("selected", true)){
    if (houseclicked == 1){
      colortype = data[i]["House"];
    }

    //if(d3.select("#HouseCheck").classed("selected", true)){
    if (houseclicked == 1){
      description = description + data[i]["House"] + " ";
    }
    //if(d3.select("#YearCheck").classed("selected", true)){
    if (yearclicked == 1){
      description = description + data[i]["Year"] + " ";
    }
    //if(d3.select("#GenderCheck").classed("selected", true)){
    if (genderclicked == 1){
      description = description + data[i]["Gender"] + " ";
    }  

    if (description in sorted){
      sorted[description]["Likes Given"] += parseInt(data[i]["Likes Given"]);
      sorted[description]["Likes Received"] += parseInt(data[i]["Likes Received"]);
    } 
    else {
      var temp = {};
      temp["Likes Given"] = parseInt(data[i]["Likes Given"]); 
      temp["Likes Received"] = parseInt(data[i]["Likes Received"]); 
      temp["Color"] = colortype;
      sorted[description] = temp;
    }
  }
  
  for (var key in sorted){
    var temp = {"Description" : key};
    newData.push(
      extend(temp, sorted[key])
    );
  }

  function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
  }

  //svg.selectAll("*").remove();
  svg.selectAll(".dot").remove();

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(newData, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(newData, yValue)+1]);

  // draw dots
  svg.selectAll(".dot")
      .data(newData)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
        d3.selectAll("#myText").remove()
        d3.select(this).attr("r", 12).style("fill", "red");
        d3.select("svg").append("text")
          .style("font-size", "18px")
          .attr("x", 80)
          .attr("y", 40)
          .attr("id", "myText")
          .text(d["Description"]);
        d3.select("svg").append("text")
          .style("font-size", "18px")
          .attr("x", 80)
          .attr("y", 62)
          .attr("id", "myText")
          .text("Loving: " + xValue(d));
        d3.select("svg").append("text")
          .style("font-size", "18px")
          .attr("x", 80)
          .attr("y", 84)
          .attr("id", "myText")
          .text("Lovable: " + yValue(d));
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 5).style("fill", function(d) { return color(cValue(d));}) 
        //d3.selectAll("#myText").remove()    

      });

   // Update X Axis
  svg.select(".x.axis")
      .transition()
      .duration(500)
      .call(xAxis);

  // Update Y Axis
  svg.select(".y.axis")
      .transition()
      .duration(500)
      .call(yAxis);

  // svg.selectAll(".legend").remove();
  //d3.select('#legend').selectAll('ul').remove();

  // // draw legend
  // var legend = svg.selectAll(".legend")
  //   .data(color.domain())
  // .enter().append("g")
  //   .attr("class", "legend")
  //   .attr("transform", function(d, i) { 

  //     return "translate(0," + i * 10 + ")"; });

  // // draw legend colored rectangles
  // legend.append("rect")
  //     .attr("x", width + 10)
  //     .attr("y", -5)
  //     .attr("width", 10)
  //     .attr("height", 10)
  //     .style("fill", color);

  // // draw legend text
  // legend.append("text")
  //     .attr("x", width )
  //     .attr("y", 0)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d;});
});

}