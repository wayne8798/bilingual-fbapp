var margin2 = {top: 20, right: 20, bottom: 30, left: 40},
    width2 = 400 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;


var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width2 - 20], .1);

var y2 = d3.scale.linear()
    .rangeRound([height2, 0]);

var color2 = d3.scale.ordinal()
    .range(["#00abc5", "#6b486b",  "#ff8c00"]);

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left")
    .tickFormat(d3.format(".2s"));


var parseDate = d3.time.format("%Y%m").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

startingYear = 2011;
startingMonth = 9;



var barSVG = d3.select("#viz")
        .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .style("padding-right", margin2.right *2)  
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


d3.tsv("barData.tsv", function(error, data) {
  color2.domain(d3.keys(data[0]).filter(function(key) { return (key !== "Language" && key!== "date"); }));


  data.forEach(function(d) {

    d.date = parseDate(d.date);
    var y0 = 0;
    d.types = color2.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.types[d.types.length - 1].y1;
  });

  //month starts from 0
  filteredData = data.filter(function(d, i){ return (d.date.getFullYear() == startingYear && d.date.getMonth() == startingMonth); });


  x2.domain(data.map(function(d) { return d.Language; }));
  y2.domain([0, d3.max(data, function(d) { return d.total; })]);


  barSVG.append("g")
      .attr("class", "x2 axis2")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  barSVG.append("g")
      .attr("class", "y2 axis2")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Posts");

  var language = barSVG.selectAll(".language")
      .data(filteredData)
    .enter().append("g")
      .attr("class", "language")
      .attr("transform", function(d) { return "translate(" + x2(d.Language) + ",0)"; });


  language.selectAll("rect")
      .data(function(d) { return d.types; })
    .enter().append("rect")
      .attr("width", x2.rangeBand())
      .attr("y", function(d) { return y2(d.y1); })
      .attr("height", function(d) { return y2(d.y0) - y2(d.y1); })
      .style("fill", function(d) {return color2(d.name); });


  var legend = barSVG.selectAll(".legend")
      .data(color2.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate("+ (margin2.right*2)  +"," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width2 - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color2);

  legend.append("text")
      .attr("x", width2 - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  //if the user clicks on the line, update the contents
  svg.selectAll(".line")
    .on("mousedown", function() {
    console.log({"x": d3.event.x, "y": d3.event.y});
        var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0; //d = the object closest to it
        newYear = d.date.getFullYear();
        newMonth = d.date.getMonth();
        changeBargraph(newYear, newMonth);
        d3.selectAll(".month").text(monthNames[d.date.getMonth()] + " " + d.date.getFullYear());
      })


function changeBargraph(newYear, newMonth) {
  // clearTimeout(timeout);
  filteredData = data.filter(function(d, i){ return ((d.date).getFullYear() == newYear && (d.date).getMonth() == newMonth); }); //refilter the data for the updated year

  x2.domain(filteredData.map(function(d) { return d.Language; }));
  y2.domain([0, d3.max(filteredData, function(d) { return d.total; })]);


  //update data for all both languages
  d3.selectAll(".language").data(filteredData).enter();


  var svg = d3.select("body").transition();
  svg.select(".x2.axis2") // change the x axis
    .duration(750)
    .call(xAxis2);
  svg.select(".y2.axis2") // change the y axis
    .duration(750)
    .call(yAxis2);


  var language = barSVG.selectAll(".language")
    .data(filteredData);
    language.attr("transform", function(d) {return "translate(" + x2(d.Language) + ",0)"; });


  language.selectAll("rect")
      //.duration(750)
      .data(function(d) { return d.types; }) //correct
      //.enter().append("rect")
      .attr("width", x2.rangeBand())
      .attr("y", function(d) { return y2(d.y1); })
      .attr("height", function(d) { return y2(d.y0) - y2(d.y1); })
      .style("fill", function(d) {return color2(d.name); });


  } //end of change


});


