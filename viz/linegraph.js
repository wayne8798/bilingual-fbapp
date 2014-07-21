
var currentYear = 2013;
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    //.interpolate("basis") //interpolate for smoother curves
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.status); });


var svg = d3.select("#one").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {

  var parseDate = d3.time.format("%Y%m").parse,
      bisectDate = d3.bisector(function(d) { return d.date; }).left;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));


  var uniqueYears = [];

  //filtering data to one year and parse date for each item
  filteredData = data.filter(function(d, i){ return parseDate(d.date).getFullYear() == currentYear; });
  data.forEach(function(d) { 
    d.date = parseDate(d.date);
    uniqueYears.push(d.date.getFullYear());
  });

  //find out the unique years and add a radio button for each year
  uniqueYears = d3.set(uniqueYears).values();
  console.log(uniqueYears);
  var years = d3.select("#years").selectAll("label")
    .data(uniqueYears)    
    .enter().append("label");

  years.attr("style","margin-left:10pt");

  years.append("input")
  .attr({
        type: "radio",
        class: "shape",
        name: "mode",
        value: function(d, i) {return d;}
    })
  .property("checked", function(d, i) { 
        return (d==2013); 
    });

  years.append("label").text(function(d) {return d;}).attr("style","margin-left: 4pt");



  var languages = color.domain().map(function(name) {
    return {
      name: name,
      values: filteredData.map(function(d) {
        return {date: d.date, status: +d[name]};
      })
    };
  });

  x.domain(d3.extent(filteredData, function(d) { return d.date; }));

  y.domain([
    d3.min(languages, function(c) { return d3.min(c.values, function(v) { return v.status; }); }),
    d3.max(languages, function(c) { return d3.max(c.values, function(v) { return v.status; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of updates");

  var language = svg.selectAll(".language")
      .data(languages)
    .enter().append("g")
      .attr("class", "language");

  var path = language.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .on("mousedown", function() {
        console.log({"x": d3.event.x, "y": d3.event.y});
      });


  language.append("g").attr("class", "dot").selectAll(".dot")
      .data(function(d) {return d.values})
      .enter().append("circle")
      .attr("class", "circle")
      .attr("cx", function(d){ return x(d.date);})
      .attr("cy", function(d){ return y(d.status);})
      .attr("r", function(d){ return 5;})
      .attr("stroke", function (d) {
          return color(this.parentNode.__data__.name)
      })
      .attr("fill", "white").attr("fill-opacity", .5)
      .attr("stroke-width", 2);

  language.append("text")
      .attr("class", "desc")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.status) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });



 d3.selectAll(".line").on("click", function(d, i){   console.log(d);  });

  d3.selectAll("input").on("change", change);

  function change() {
    // clearTimeout(timeout);
    var currentYear = this.value;
    filteredData = data.filter(function(d, i){ return (d.date).getFullYear() == currentYear; }); //refilter the data for the updated year

    //update languages
    languages = color.domain().map(function(name) {
      return {
        name: name,
        values: filteredData.map(function(d) {
          return {date: d.date, status: +d[name]};
        })
      };
    });

    x.domain(d3.extent(filteredData, function(d) { return d.date; }));

    y.domain([
      d3.min(languages, function(c) { return d3.min(c.values, function(v) { return v.status; }); }),
      d3.max(languages, function(c) { return d3.max(c.values, function(v) { return v.status; }); })
    ]);

    //update data for all the elements
    var language = d3.selectAll(".language").data(languages).enter();
    d3.selectAll(".line").data(languages).enter();
   // d3.selectAll("circle").data(languages.values).enter();
    d3.selectAll(".desc").data(languages).enter();




  d3.select("#one").selectAll(".language").selectAll(".circle")
      .data(function(d) {return d.values});

    var svg = d3.select("body").transition();

      svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
      svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);

      svg.selectAll(".desc")
        .duration(750)      
        .attr("transform", function(d) {return "translate(" + x(d.values[d.values.length - 1].date) + "," + y(d.values[d.values.length - 1].status) + ")"; })
        .text(function(d) { return d.name; });

        //update the graph
      svg.selectAll(".line")
        .duration(750)
        .attr("d", function(d,i) { return line(d.values);})
        .style("stroke", function(d) { return color(d.name); });


      svg.selectAll(".circle")
        .duration(750)
      .attr("cx", function(d){ return x(d.date);})
      .attr("cy", function(d){ return y(d.status);})

  } //end of change


});
