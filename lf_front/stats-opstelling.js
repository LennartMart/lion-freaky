//Window.console.log not available in IE9 when developper tools are not activated
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

(function(ko, $, undefined) {


	function myViewModel() {
		var self = this;
		self.totalSelectAndPrintCmdPerTeam = ko.observable();
		$.get("opstelling/totalSelectAndPrintCmdPerTeam", function(data) {
			self.totalSelectAndPrintCmdPerTeam(data);
		});
		
	}
	var vm = new myViewModel();	
	ko.applyBindings(vm);

	<!-- D3 graph -->
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;


	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
		
	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#graphX").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	d3.json("opstelling/totalSelectAndPrintCmdPerWeek", function(error, data) {
	//d3.json("json.data", function(error, data) {

		var statNames = ["select","print","combined","totalMatchesX2"];
		data.forEach(function(d) {
			d.stats = statNames.map(function(name) { 
				if (name == 'combined') {
					return {name: name, value: +d[name], percentage:Math.round((+d[name]/+d['totalMatchesX2'])*100)};
				} else {
					return {name: name, value: +d[name]};				
				}
				});
		});		
		//console.log(data);

		x0.domain(data.map(function(d) { return d.week; }));
		x1.domain(statNames).rangeRoundBands([0, x0.rangeBand()]);	  
		y.domain([0, d3.max(data, function(d) { return d3.max(d.stats, function(d) { return d.value; }); })]);
		  
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .attr("y", 20)
		  .attr("x", 20)
		  .style("text-anchor", "begin")
		  .text("Week");

		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Aantal");


		var bar = svg.selectAll(".bar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "g")
		  .attr("transform", function(d) { return "translate(" + x0(d.week) + ",0)"; });


		var gBar = bar.selectAll("rect")
		  .data(function(d) { return d.stats; })
		.enter().append("g");
		
		gBar.append("rect")
			  .attr("width", x1.rangeBand())
			  .attr("x", function(d) { return x1(d.name); })
			  .attr("y", function(d) { return y(d.value); })
			  .attr("height", function(d) { return height - y(d.value); })
			  .style("fill", function(d) { return color(d.name); });
				 
		gBar.append("text")
   		    .attr("x", function(d) { return x1(d.name) +x1.rangeBand()/2 +5; })
		    .attr("y", function(d) { return height -5; })
		    .attr("transform",function(d) { return "rotate(-90,"+(x1(d.name) +x1.rangeBand()/2 +5)+","+(height -5)+")";})
			.text(function(d) { return d.name =='combined' ? d.percentage+'%':d.value});
		  
		var legend = svg.selectAll(".legend")
		  .data(statNames.slice())
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

		legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { return d; });
		
		
		
	});



})(ko, jQuery);




function loadD3Stat(data) {
	console.log(data);
}			
		
		
		
			
$( document ).ready(function() {
	
		//$.get("api/stat/totalSelectAndPrintCmdPerWeek", function(data) {
		//loadD3Stat(data);
		//});

});
