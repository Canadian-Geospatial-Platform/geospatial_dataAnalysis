
var CustomDataAnalisys= (function (){
  var height,width,margin, $divChart
    function _initializitation($div_){
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
      $divChart=$div_;
      }

      function _barChart(){
        // set the ranges

        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin

        var svg = d3.select("#myChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        // get the data
        d3.json("https://api.myjson.com/bins/p4nha", function(error, data) {
          console.log(error);
          if (error) throw error;
          // format the data

          data.forEach(function(d) {
            d.sales = +d.sales;
           console.log(d);
          });
          // Scale the range of the data in the domains
          x.domain(data.map(function(d) { return d.salesperson; }));
          y.domain([0, d3.max(data, function(d) { return d.sales; })]);
          // append the rectangles for the bar chart
          svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.salesperson); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.sales); })
              .attr("height", function(d) { return height - y(d.sales); });
          // add the x Axis
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));
          // add the y Axis
             svg.append("g")
              .call(d3.axisLeft(y));
              // text label for the y axis
            svg.append("text")
            .attr('class', 'title')
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("% Sales");
              svg.append("text")
                    .attr('class', 'title')
                    .attr("transform",
                        "translate(" + (width/2) + " ," +
                                       (height + margin.top + 10) + ")")
                  .style("text-anchor", "middle")
                  .text("Sales Person");
        });
      }
      function _pieChart(){
        var data = [
        {name: "USA", value: 60},
        {name: "UK", value: 20},
        {name: "Canada", value: 30},
        {name: "Maxico", value: 15},
        {name: "Japan", value: 10},
        ];
        var text = "";

        // var width = 300;
        // var height = 400;
        var thickness = 40;
        var duration = 750;
        var padding = 10;
        var opacity = .8;
        var opacityHover = 1;
        var otherOpacityOnHover = .8;
        var tooltipMargin = 13;
        var radius = Math.min(width-padding, height-padding) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        console.log($divChart);
        var svg = d3.select("#myChart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);
        var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
        var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
        var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);
         var path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .append('path')
        .attr('d', arc)
        .attr('fill', (d,i) => color(i))
        .style('opacity', opacity)
        .style('stroke', 'white')
        .on("mouseover", function(d) {
        d3.selectAll('path')
          .style("opacity", otherOpacityOnHover);
        d3.select(this)
          .style("opacity", opacityHover);
        let g = d3.select("svg")
          .style("cursor", "pointer")
          .append("g")
          .attr("class", "tooltip")
          .style("opacity", 0);
        g.append("text")
          .attr("class", "name-text")
          .text(`${d.data.name} (${d.data.value})`)
          .attr('text-anchor', 'middle');
        let text = g.select("text");
        let bbox = text.node().getBBox();
        let padding = 2;
        g.insert("rect", "text")
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + (padding*2))
          .attr("height", bbox.height + (padding*2))
          .style("fill", "white")
          .style("opacity", 0.75);
        })
        .on("mousemove", function(d) {
          let mousePosition = d3.mouse(this);
          let x = mousePosition[0] + width/2;
          let y = mousePosition[1] + height/2 - tooltipMargin;

          let text = d3.select('.tooltip text');
          let bbox = text.node().getBBox();
          if(x - bbox.width/2 < 0) {
            x = bbox.width/2;
          }
          else if(width - x - bbox.width/2 < 0) {
            x = width - bbox.width/2;
          }

          if(y - bbox.height/2 < 0) {
            y = bbox.height + tooltipMargin * 2;
          }
          else if(height - y - bbox.height/2 < 0) {
            y = height - bbox.height/2;
          }

          d3.select('.tooltip')
            .style("opacity", 1)
            .attr('transform',`translate(${x}, ${y})`);
        })
        .on("mouseout", function(d) {
        d3.select("svg")
          .style("cursor", "none")
          .select(".tooltip").remove();
        d3.selectAll('path')
          .style("opacity", opacity);
        })
        .on("touchstart", function(d) {
        d3.select("svg")
          .style("cursor", "none");
        })
        .each(function(d, i) { this._current = i; });

        let legend = d3.select("#myChart").append('div')
        .attr('class', 'legend')
        .style('margin-top', '30px');

        let keys = legend.selectAll('.key')
        .data(data)
        .enter().append('div')
        .attr('class', 'key')
        .style('display', 'flex')
        .style('overflow', 'auto')
        .style('float', 'right')
        .style('align-items', 'center')
        .style('margin-right', '20px');
        keys.append('div')
        .attr('class', 'symbol')
        .style('height', '10px')
        .style('width', '10px')
        .style('margin', '5px 5px')
        .style('background-color', (d, i) => color(i));
        keys.append('div')
        .attr('class', 'name')
        .text(d => `${d.name} (${d.value})`);
        keys.exit().remove();
      }//_pieChart

      function _histogram(){
        var margin = {top: 40, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
          })

        var svg = d3.select("#myChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.call(tip);
        d3.json("https://api.myjson.com/bins/z1abc", function(error, data) {
         //console.log(data);
        //d3.tsv("Data/datatooltips.csv", type, function(error, data) {
          if (error) throw error
          x.domain(data.map(function(d) { return d.letter; }));
          y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
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
              .text("Frequency");
          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.letter); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.frequency); })
              .attr("height", function(d) { return height - y(d.frequency); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide)
        });

        function type(d) {
          d.frequency = +d.frequency;
          return d;
        }

      }//_histogram function
      function _linearChart(){
    //     var margin = {top: 10, right: 30, bottom: 30, left: 60},
    // width = 560 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#myChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

})
      }//lenearChart
      function _showChart(radioValue){
        console.log($divChart);
        $("#myChart").empty();
         if (radioValue==3) _barChart();
         if (radioValue==1) _pieChart();
          if (radioValue==2) _linearChart();
         if (radioValue==4) _histogram();
      }

 return {
   initialization:_initializitation,
   showChart:_showChart
    };
})();//end
