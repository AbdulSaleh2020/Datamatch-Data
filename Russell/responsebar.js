var responsebar = {};

// graph size margins
var margin = {top: 50, right: 5, bottom: 30, left: 50},
    width = $('.question_chart').width() - margin.left - margin.right,
    legendWidthRatio = 3,
    legendWidth = width / legendWidthRatio,
    legendRadiusRatio = 4,
    legendRadius = legendWidth / legendRadiusRatio,
    legendSepPadding = legendRadius / 10,
    height = (legendRadius * 4 + legendSepPadding);

width = $('.question_chart').width() - margin.left - margin.right;

// generate scale and axe functions for graph with d3
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width - legendWidth], 0.3);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
var legendArc = d3.svg.arc()
    .outerRadius(legendRadius)
    .innerRadius(legendRadius * 0.65);
var legendPieData = d3.layout.pie()
  // see nest() function used to generate response groupings
  .value(function(d) { return d.values; })
  .sort(null);
var legendColors = d3.scale.category10();
var legendKeyCheck = function(boxHeight, boxWidth) {
  var points = [[boxWidth * -0.1, boxHeight * 0.5],
                [boxWidth * 0.5, boxHeight * 0.9],
                [boxWidth * 1.1, boxHeight * -0.2]];
  return d3.svg.line()(points);
};

var svg, barGroup, choiceBars;
var legend, legendAgePie, legendGenderPie,
    legendAgeKey, legendGenderKey,
    legendToolTip;
var question, responses,
    researcher, choices,
    readers, multipleChoice,
    demographicTypes;
var filteredResponses,
    filteredChoices, filteredChoice;
var shouldResize = false;

// make our graph responsive
$(window).on("resize", function() {
  responsebar.resize();
});

responsebar.resize = function() {
  if (!shouldResize)
    return;
  // TODO: remove hardcoded element
  var newWidth = $('.question_chart').width();
  width = newWidth - margin.left - margin.right;
  legendWidth = width / legendWidthRatio;
  legendRadius = legendWidth / legendRadiusRatio;
  legendSepPadding = legendRadius / 10;
  height = (legendRadius * 4 + legendSepPadding);
  x.rangeRoundBands([0, width - legendWidth], 0.3);
  y.range([height, 0]);
  svg = d3.select($('.question_chart').find('svg')[0]);
  svg.attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom);
  barGroup.select('.x.axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll(".tick text")
    .call(wrap, x.rangeBand());
  barGroup.select('.y.axis').call(yAxis);
  barGroup.selectAll(".choice-bar-vertical")
    .attr("x", function(d) { return x(d.text); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.num_responses); })
    .attr("height", function(d) { return height - y(d.num_responses); });
  barGroup.selectAll(".choice-bar-label")
    .attr("x", function(d) { return x(d.text) + (x.rangeBand() / 2); })
    .attr("y", function(d) { return y(d.num_responses) - 15; });

  legend.attr("transform", "translate(" +
                (width + margin.left + margin.right - legendWidth +
                  1.25 * legendRadius + legendSepPadding) +
                "," + (margin.top + legendRadius) + ")");
  legendGenderPie.attr("transform", "translate(" + (0) + "," +
                       ((legendRadius * 2) + legendSepPadding) + ")");
  legendArc = d3.svg.arc()
      .outerRadius(legendRadius)
      .innerRadius(legendRadius * 0.65);
  legend.selectAll(".pie-arc").attr("d", legendArc);
  legendAgeKey.attr("transform", function(d, i) {
        return "translate(" +
          (legendRadius + 1.5 * legendSepPadding) + "," +
          (legendRadius * -1 + 2 * legendSepPadding + i * legendRadius * 0.21) + ")";
      });
  legendGenderKey.attr("transform", function(d, i) {
        return "translate(" +
          (legendRadius + 1.5 * legendSepPadding) + "," +
          (legendRadius * 1 + 3 * legendSepPadding + i * legendRadius * 0.21) + ")";
      });
  legend.selectAll('.legend rect')
      .attr("width", legendRadius * 0.16)
      .attr("height", legendRadius * 0.16);
  legend.selectAll('path.legend-checkmark')
      .attr("d", function(d) {return legendKeyCheck(legendRadius * 0.16, legendRadius * 0.16);});
  legend.selectAll('.legend text')
      .attr("x", legendRadius * 0.2)
      .attr("y", legendRadius * 0.16);
};

responsebar.create = function(el, data) {
  responsebar.el = el;

  question = data.question;
  responses = data.responses;
  researcher = data.researcher;
  choices = data.choices;
  readers = data.readers;
  multipleChoice = data.question.multiple_choice;
  demographicTypes = data.demographic_types;
  // use this if you want some dummy data to test multirow checkboxes
  // demographicTypes.age.push("60");
  // demographicTypes.age.push("60");
  // demographicTypes.age.push("60");
  // demographicTypes.age.push("60");

  filteredResponses = $.extend(true, [], responses);
  filteredChoices = $.extend(true, [], choices);

  x.domain(choices.map(function(d) { return d.text; }));
  y.domain([0, d3.max(choices, function(d) { return d.num_responses; }) + 10]);
  // use this if you want to fix to the limit instead
  // y.domain([0, question.limit]);

  svg = d3.select(el).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", 'response-bar-graph');
  barGroup = svg.append("g")
    .attr("class", 'bar-graph-area')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  barGroup.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll(".tick text")
      .call(wrap, x.rangeBand());
  barGroup.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", ".9em")
      .style("text-anchor", "end")
      .text("Num responses");
  barGroup.append("rect")
      .attr({
          "width": width,
          "height": height,
          "fill": "none",
          "pointer-events": "all"
      })
      .on("click", function() { responseBarClick(null, null); });
  choiceBars = barGroup.selectAll(".choice-bar-group")
      .data(choices)
    .enter().append('g')
      .attr("class", "choice-bar-group");
  choiceBars.append("rect")
      .attr("class", "choice-bar-vertical")
      .attr("x", function(d) { return x(d.text); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.num_responses); })
      .attr("height", function(d) { return height - y(d.num_responses); })
      .on("click", function(d) { responseBarClick(this, d.text); });
  choiceBars.append("text")
      .attr("class", "choice-bar-label")
      .attr("x", function(d) { return x(d.text) + (x.rangeBand() / 2); })
      .attr("text-anchor", "middle")
      .attr("y", function(d) { return y(d.num_responses) - 15; })
      .text(function(d) { return d.num_responses; });
  barGroup.selectAll('text')
      .classed('medium-text', true);

  legend = svg.append("g")
      .attr("class", "bar-legend")
      .attr("transform", "translate(" +
            (width + margin.left + margin.right - legendWidth +
              1.25 * legendRadius + legendSepPadding) +
            "," + (margin.top + legendRadius) + ")");
  var responsesByAge = nestResponsesByType(responses, "age");
  legendAgePie = legend.append("g")
      .attr('class', 'legend-pie')
      .datum('Age')
    .selectAll(".pie-arc.pie-arc-age")
      .data(legendPieData(responsesByAge))
    .enter().append('path')
      .attr('class', 'pie-arc pie-arc-age')
      .attr('data-dtype', 'age')
      .attr("d", legendArc)
      .attr("fill", function(d) { return legendColors(d.data.key); })
      .each(function(d) { this._current = d; });
  var responsesByGender = nestResponsesByType(responses, "gender");
  legendGenderPie = legend.append("g")
      .attr('class', 'legend-pie')
      .datum('Gender')
      .attr("transform", "translate(" +
        (0) + "," +
        ((legendRadius * 2) + legendSepPadding) + ")");
  legendGenderPie.selectAll(".pie-arc.pie-arc-gender")
      .data(legendPieData(responsesByGender))
    .enter().append('path')
      .attr('class', 'pie-arc pie-arc-gender')
      .attr('data-dtype', 'gender')
      .attr("d", legendArc)
      .attr("fill", function(d) { return legendColors(d.data.key); })
      .each(function(d) { this._current = d; });
  // clear any lingering tooltips from last graph load
  $(el).find('div.legend-tooltip').remove();
  legendToolTip = d3.select(el).append('div')
    .attr("class", "legend-tooltip")
    .style("min-width", legendRadius + 'px');
  legend.selectAll(".legend-pie")
    .append("text")
    .attr("class", "pie-text")
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bolder')
    .text(function(d) {return d;});
  legend.selectAll(".pie-arc")
    .on("mouseover", function(d) {legendPieOver(this, d.data.key);})
    // .on("touchstart", function(d) {legendPieOver(this, d.data.key);})
    .on("mouseout", legendPieOut)
    // .on("touchend", legendPieOut)
    .on("click", function(d) {legendPieClick(this, d.data.key);});
    // .on("touchstart", function(d) {legendPieClick(this, d.data.key);});
  legendAgeKey = legend.selectAll('.legend.legend-age')
      .data(responsesByAge.map(function(d) {return d.key;}))
    .enter()
      .append('g')
    .attr('class', 'legend legend-age')
    .attr('data-dtype', 'age')
    .attr("transform", function(d, i) {
      return "translate(" +
        // (legendRadius * -0.45) + "," +
        // (legendRadius * -0.4 + i * legendRadius * 0.16) + ")";
        (legendRadius + 1.5 * legendSepPadding) + "," +
        (legendRadius * -1 + 2 * legendSepPadding + i * legendRadius * 0.21) + ")";
    });
  legendGenderKey = legend.selectAll('.legend.legend-gender')
      .data(responsesByGender.map(function(d) {return d.key;}))
    .enter()
      .append('g')
    .attr('class', 'legend legend-gender')
    .attr('data-dtype', 'gender')
    .attr("transform", function(d, i) {
      return "translate(" +
        // (legendRadius * -0.45) + "," +
        // (legendRadius * 1.6 + 20 + i * legendRadius * 0.16) + ")";
        (legendRadius + 1.5 * legendSepPadding) + "," +
        (legendRadius * 1 + 3 * legendSepPadding + i * legendRadius * 0.21) + ")";
    });
  legend.selectAll('.legend').append("rect")
      .attr("class", "legend-checkmark-container enabled")
      .attr("width", legendRadius * 0.16)
      .attr("height", legendRadius * 0.16)
      .attr("stroke", legendColors)
      .attr("fill", legendColors)
      .on("click", function(d) { toggleLegendFilter(this, mapNullToText(d)); });
  legend.selectAll('.legend').append("path")
      .attr("d", function(d) {return legendKeyCheck(legendRadius * 0.16, legendRadius * 0.16);})
      .attr("class", "legend-checkmark")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2.5);
  legend.selectAll('.legend').append("text")
      .attr("x", legendRadius * 0.2)
      .attr("y", legendRadius * 0.16)
      .attr("class", "small-text")
      .text(function(d) { return mapNullToText(d); })
      .on("click", function(d) { toggleLegendFilter(this, mapNullToText(d)); });

  updateFilterForm(el);
  shouldResize = true;
};

// update graph with new response data (or merely just re-filtered)
responsebar.updateDisplayedResponses = function(newChoices) {
  x.domain(newChoices.map(function(d) { return d.text; }));
  y.domain([0, d3.max(newChoices, function(d) { return d.num_responses; }) + 10]);

  barGroup.selectAll('.choice-bar-vertical')
    .data(newChoices)
    .transition()
    .duration(750)
    .attr("y", function(d) { return y(d.num_responses); })
    .attr("height", function(d) { return height - y(d.num_responses); });
  barGroup.selectAll('.choice-bar-label')
    .data(newChoices)
    .transition()
    .duration(750)
    .attr("y", function(d) { return y(d.num_responses) - 15; })
    .text(function(d) {
      if ($("#percent-response-rate").is(':checked')){
        var totalResponses = d3.sum(choices, function(c) { return c.num_responses; });
        return d3.format(".2%")(d.num_responses / totalResponses);
      }
      else
        return d.num_responses;
    });

  barGroup.transition()
    .select('.x.axis')
    .duration(750)
    .call(xAxis)
  .selectAll(".tick text")
    .call(wrap, x.rangeBand());
  barGroup.transition()
    .select('.y.axis')
    .duration(750)
    .call(yAxis);

  legend.selectAll(".pie-arc-age")
    .data(legendPieData(nestResponsesByType(filteredResponses, "age")))
    .transition()
    .duration(750)
    .attr("fill", function(d) { return legendColors(d.data.key); })
    .attrTween('d', function(d) {
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return legendArc(interpolate(t));
      };
    });
  legend.selectAll(".pie-arc-gender")
    .data(legendPieData(nestResponsesByType(filteredResponses, "gender")))
    .transition()
    .duration(750)
    .attr("fill", function(d) { return legendColors(d.data.key); })
    .attrTween('d', function(d) {
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return legendArc(interpolate(t));
      };
    });
};

function mapNullToText(d) {
  if ((d === null) || (d === "null")){
    return "None";
  } else {
    return d;
  }
}

function nestResponsesByType(responses, type) {
  var responsesByType = d3.nest()
    .key(function(d) {return d[type];})
    .rollup(function(v) {return v.length;})
    .entries(responses);
  var presentResponseTypes = responsesByType.map(function(d) {return d.key;});

  // need dummy 0 values, or pie graph won't update the corresponding arcs
  for (var dIndex in demographicTypes[type]) {
    var dVal = (demographicTypes[type][dIndex] === null) ?
      "null" : demographicTypes[type][dIndex];
    if (presentResponseTypes.indexOf(dVal) === -1) {
      responsesByType.push({key: dVal, values: 0 });
    }
  }

  return responsesByType;
}

function responseBarClick(element, choice) {
  if (choice === null) {
    choiceBars.selectAll('.choice-bar-vertical')
      .classed("selected", false);
    filteredChoice = null;
  } else if (filteredChoice !== choice) {
    d3.select(element).classed("selected", true);
    filteredChoice = choice;
  } else {
    d3.select(element).classed("selected", false);
    filteredChoice = null;
  }
  filterResponses();
}

function toggleLegendFilter(element, filterType) {
  // jQuery 2 doesn't support SVG classing :(
  // allow this function to be called from either checkbox or text label
  var selectedLegendFilter = d3.select($(element).parent().children('rect')[0]);
  var dType = $(element).parent().data("dtype");
  selectedLegendFilter.classed("enabled",
    !selectedLegendFilter.classed("enabled"));
  selectedLegendFilter.classed("disabled",
    !selectedLegendFilter.classed("disabled"));
  $("#response-filter-" + dType)
    .children("[value='" + filterType + "']")
    .trigger("click");
}

function legendPieOver(element, dVal) {
  var highlightedArc = d3.select(element);
  highlightedArc.classed("highlight", true);
  d3.selectAll($(element).siblings('.pie-arc').toArray())
    .classed("fadeout", true);
  legendToolTip.style('top', (d3.event.layerY + 10) + 'px')
    .style('left', (d3.event.layerX + 10) + 'px');
  // use jQuery here for its nice fading API
  $(legendToolTip[0]).stop(true, true).fadeIn(500);
  var dType = $(element).data("dtype");
  var numResponsesByType = nestResponsesByType(filteredResponses, dType);
  var numResponsesThisType = $.grep(numResponsesByType, function(d) {
                                return d.key === dVal;})[0].values;
  var totalResponses = d3.sum(numResponsesByType, function(d) {return d.values; });
  var responsesByChoice = d3.nest()
    .key(function(d) {return d.text;})
    .entries(filteredResponses);

  var toolTipContent = "";
  toolTipContent += ("<div><span style='text-transform:capitalize'>" +
    dType + "</span>: <span class='emphasis'>" + mapNullToText(dVal) + "</span>" +
    "</div>");
  toolTipContent += "<hr>" + numResponsesThisType +
     " / " + totalResponses + " (" +
     d3.format(".2%")(numResponsesThisType / totalResponses) + ")" +
     " of <span class='emphasis'>all</span> (selected) responses";
  // used to generate stats per choice
  // not needed now, but maybe in the future? (assumes a list)
  toolTipContent += "<hr><ul>";
  for (var c in responsesByChoice) {
    numResponsesByType = nestResponsesByType(responsesByChoice[c].values, dType);
    numResponsesThisType = $.grep(numResponsesByType, function (d) {
                                  return d.key === dVal;})[0].values;
    totalResponses = d3.sum(numResponsesByType, function(d) {return d.values; });
    toolTipContent += "<li>" + numResponsesThisType +
       " / " + totalResponses + " (" +
       d3.format(".2%")(numResponsesThisType / totalResponses) + ")" +
       " of <span class='emphasis'>&quot;" + responsesByChoice[c].key + "&quot;</span> responses" +
       "</li>";
  }
  toolTipContent += "</ul>";
  legendToolTip.html(toolTipContent);
}

function legendPieOut() {
  var highlightedArc = d3.select(this);
  highlightedArc.classed("highlight", false);
  d3.selectAll($(this).siblings('.pie-arc').toArray())
    .classed("fadeout", false);
  $(legendToolTip[0]).stop(true, true).fadeOut(500);
}

function legendPieClick(element, dVal) {
  var dType = $(element).data("dtype");
  if ($("#response-filter-" + dType)
        .children('input:checked').length > 1) {
    legend.selectAll('.legend-' + dType)
      .selectAll('.legend-checkmark-container')
      .classed("enabled", false);
    legend.selectAll('.legend-' + dType)
      .selectAll('.legend-checkmark-container')
      .classed("disabled", true);
    legend.selectAll('.legend-' + dType)
      .selectAll('.legend-checkmark-container')
      .filter(function(d) { return d === dVal; })
      .classed("enabled", true)
      .classed("disabled", false);
    $("#response-filter-" + dType)
      .children('input').prop('checked', false);
    $("#response-filter-" + dType)
      .children("[value='" + mapNullToText(dVal) + "']")
      .trigger("click");
  } else {
    legend.selectAll('.legend-' + dType)
      .selectAll('.legend-checkmark-container')
      .classed("enabled", true);
    legend.selectAll('.legend-' + dType)
      .selectAll('.legend-checkmark-container')
      .classed("disabled", false);
    $("#response-filter-" + dType)
      .children('input').prop('checked', true);
    filterResponses();
  }
}

/**
 * All the stuff having to do with the filter form
 **/

var $filterForm = $('.question_chart').children('.response-filter-form');

// update the choices for the filter form after we get fresh data
function updateFilterForm(el) {
  var $filterForm = $(el).children('.response-filter-form');
  for (var dType in demographicTypes) {
    var $filterType = $filterForm.find('#response-filter-' + dType);
    var demoOptions = "";
    for (var dIndex in demographicTypes[dType]) {
      var dVal = demographicTypes[dType][dIndex];
      dVal = mapNullToText(dVal);
      if (["age", "gender"].indexOf(dType) !== -1) {
        var dValString = 'response-filter-' + dType + '-' + dVal;
        demoOptions += "<input type='checkbox' name='" + dValString +
                       "' id='" + dValString + "' value='" +
                       dVal + "' class='response-filter-checkbox'" +
                       " checked></input>";
        demoOptions += "<label for='" + dValString + "'>" +
                       dVal + "</label>";
       if (dIndex % 4 === 3)
         demoOptions += "</br>";
      }
      else {
        demoOptions += "<option selected value='" + dVal +
                       "'>" + dVal + "</option>";
      }
    }
    $filterType.children().remove();
    $filterType.append(demoOptions);
  }
  // refresh event handlers for the filters
  $filterForm.find('select[name^="response-filter"]').off('change');
  $filterForm.find('input[name^="response-filter"]').off('change');
  $filterForm.find('input#percent-response-rate').off('change');
  $filterForm.find('select[name^="response-filter"]').on('change', function() {
    $filterForm.find('.selectpicker').selectpicker('refresh');
    filterResponses();
  });
  $filterForm.find('input[name^="response-filter"]').on('change', filterResponses);
  $filterForm.find('input#percent-response-rate').on('change', toggleResponsePercent);
  // use the pie chart checkboxes to select age/gender instead
  // but keep the checkboxes around for code reusability (and in case we need them again)
  $filterForm.find('input[name^="response-filter"]').each(function() {
    $(this).parents().eq(2).css('clear', 'none !important').css('display', 'none');
  });
  // refresh the selectpicker
  $filterForm.find('.selectpicker').selectpicker({
    iconBase: 'fontawesome',
    tickIcon: 'fa fa-check'
  });
  $filterForm.find('.selectpicker').selectpicker('refresh');
}

// update the global/displayed responses based on user-selected filters
function filterResponses(){
  var responsesToFilter = responses;
  if (filteredChoice !== null && filteredChoice !== undefined){
    var responsesByChoice = d3.nest()
      .key(function(d) {return d.text;})
      .entries(responses);
    for (var c in responsesByChoice) {
      if (responsesByChoice[c].key.toLowerCase() === filteredChoice.toLowerCase()) {
        responsesToFilter = responsesByChoice[c].values;
        break;
      }
    }
  }

  filteredResponses = responsesToFilter.filter(function(r){
    var responseAllowed = true;
    for (var filterType in demographicTypes){
      var selectedFilters = $filterForm.find('#response-filter-' + filterType)
                              .children(':selected, :checked').map(function() {
                                return this.value;
                              }).get();
      if (selectedFilters.length === 0){
        selectedFilters = demographicTypes[filterType];
      }
      // by default, response types are still null
      if (selectedFilters.indexOf("None") != -1)
        selectedFilters.push(null);
      responseAllowed = responseAllowed &&
                        (selectedFilters.indexOf(r[filterType]) != -1);
    }
    return responseAllowed;
  });
  // moderately faster to update outselves than filter again
  filteredChoices.forEach(function(c){ c.num_responses = 0; });
  filteredResponses.forEach(function(r){
    filteredChoices.filter(function(c){
      return c.id === r.choice_id;
    })[0].num_responses += 1;
  });
  if (filteredChoices.filter(function(c) {
        return c.num_responses !== 0;
      }).length === 0) {
    filteredChoices = choices;
    filteredResponses = responses;
  }

  // propagate the visual update
  responsebar.updateDisplayedResponses(filteredChoices);
}

// switch between % and absolute response numbers
function toggleResponsePercent(){
  var changedEl = $(this);
  choiceBars.transition()
    .selectAll('.choice-bar-label')
    .duration(750)
    .text(function(d) {
      if (changedEl.is(':checked')){
        var totalResponses = d3.sum(choices, function(c) { return c.num_responses; });
        return d3.format(".2%")(d.num_responses / totalResponses);
      }
      else
        return d.num_responses;
    });
}

function wrap(text, textWidth) {
  text.each(function() {
    var text = d3.select(this),
        letters = text.text().split('').reverse(),
        letter,
        line = [],
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null)
                    .append("tspan")
                      .attr("x", 0).attr("y", y)
                      .attr("dy", dy + "em");
    letter = letters.pop();
    while (letter) {
      line.push(letter);
      tspan.text(line.join(""));
      if (tspan.node().getComputedTextLength() > textWidth) {
        line.pop();
        tspan.text(line.join("") + "...");
        break;
      }
      letter = letters.pop();
    }
  });
}


// toggle all filters for a demo type on/off
$filterForm.find('.response-filter-link-none').on("click.filterResponses", function(){
  if ($(this).children('i').hasClass('fa-toggle-off')){
    $(this).html('<i class="fa fa-toggle-on"></i>');
    // rather than try and predict which type, just go for both
    $(this).siblings('div').children('input[name^="response-filter"]').prop('checked', true);
    $(this).siblings('select').children().prop('selected', true);
  } else {
    $(this).html('<i class="fa fa-toggle-off"></i>');
    $(this).siblings('div').children('input[name^="response-filter"]').prop('checked', false);
    $(this).siblings('select').children().prop('selected', false);
  }
  filterResponses();
});
