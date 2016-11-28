var w = 500;
var h = 500;
var colors = d3.scale.category10();
var force = d3.layout.force()
              .size([w, h]);

var rawData;
var dataset;

var svg = d3.select("#graph")
            .append("svg")
            .attr('width', w)
            .attr('height', h);

d3.csv("out.csv", function(data) {
    rawData = data;
    //populate the year dropdown
    d3.select("#year").selectAll("option")
        .data(d3.map(data, function(d){return d.year;}).keys())
        .enter()
        .append("option")
        .text(function(d){return d;})
        .attr("value",function(d){return d;});
    filterData({id: "year", value: 1990});
});

var filterData = function(filter) {
    dataset = rawData.filter(function(d) { return d[filter.id] == filter.value; });
    var maxAmount = d3.max(dataset, function (d) { return +d.mean; });
    var radiusScale = d3.scale.linear()
        .domain([0, maxAmount])
        .range([2, 45]);
    dataset = dataset.map(function(d, i) {
         return {
             id: i,
             location_name: d.location_name,
             radius: radiusScale(+d.mean),
             year: +d.year,
             sex: d.sex,
             mean: +d.mean
         };
     });
 generateNodes();

}

var generateNodes = function() {

    var nodes = svg.selectAll("circle")
                   .data(dataset, function(d) { return d.id;});

      // add in the enter selection of nodes
      nodes.enter()
          .append("circle")
          .attr("r", function(d){ return +d.radius; })
          .style("fill", function(d, i) {
                  return colors(i);
          })
          .call(force.drag);

      force.on("tick", function() {
          nodes.attr("cx", function(d) { return d.x; })
               .attr("cy", function(d) { return d.y; });
      });
      force.nodes(dataset)
           .charge( function(d) { return -Math.pow(d.radius, 2.0) / 9; })
           .start();

       // add the tooltips
       nodes.on("mouseover", function(d) {
            var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy")) + 20;
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#label_location")
                .text(d.location_name)
            console.log(yPosition)
            d3.select("#tooltip").select("#label_value")
              .text(parseFloat(Math.round(d.mean * 10000) / 100).toFixed(2))
            d3.select("#tooltip").classed("hidden", false);
        })
       .on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
        });
    }
