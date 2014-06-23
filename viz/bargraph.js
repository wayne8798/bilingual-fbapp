var margin2 = {top: 20, right: 20, bottom: 30, left: 40},
    width2 = 400 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;


var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width2], .1);

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

var barSVG = d3.select("#viz")
        .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)  
    //.attr("height", 500)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


d3.tsv("barData.tsv", function(error, data) {
  color2.domain(d3.keys(data[0]).filter(function(key) { return key !== "Language"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.types = color2.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.types[d.types.length - 1].y1;
  });

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
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x2(d.Language) + ",0)"; });


  language.selectAll("rect")
      .data(function(d) { return d.types; })
    .enter().append("rect")
      .attr("width", x2.rangeBand())
      .attr("y", function(d) { console.log(d); return y2(d.y1); })
      .attr("height", function(d) { return y2(d.y0) - y2(d.y1); })
      .style("fill", function(d) {console.log(color2(d.name)); return color2(d.name); });
  console.log(data);
});


