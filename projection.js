var countries = [];
var option = "total";
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.csv("eurostat_2014_ds.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        
        var geo = data[i].GEO;
        var alreadyExists = -1;
        
        for(var j = 0; j < countries.length; j++){  
            if(countries[j].GEO === geo){
            alreadyExists = j;
            };
        }
        
        if((alreadyExists === -1)){
            var country = {GEO:"",GEO_LABEL:"",TOTAL_VALUE:"",FEMALES_VALUE:"",MALES_VALUE:""};
            country.GEO = data[i].GEO;
            country.GEO_LABEL = data[i].GEO_LABEL;
            if (data[i].SEX === "Total") {
                country.TOTAL_VALUE = data[i].Value;
            } else if (data[i].SEX === "Females"){
                country.FEMALES_VALUE = data[i].Value;
            } else if (data[i].SEX === "Males"){
            country.MALES_VALUE = data[i].Value;
            };
        
            countries.push(country);
    } else {
    
            if (data[i].SEX === "Total") {
                countries[alreadyExists].TOTAL_VALUE = data[i].Value;
            } else if (data[i].SEX === "Females"){
                 
                countries[alreadyExists].FEMALES_VALUE = data[i].Value;
            } else if (data[i].SEX === "Males"){
                countries[alreadyExists].MALES_VALUE = data[i].Value;
            };
    
    };
 };
});


function getValue(obj){
    var name = obj.properties.name;
    var value = 0;
    for(var i = 0; i < countries.length; i++){
            var geo_label = countries[i].GEO_LABEL.toLowerCase();
            if(geo_label == name.toLowerCase()){
              switch(option){
                case "total":
                    value = countries[i].TOTAL_VALUE;
                    break;
                case "females":
                    value = countries[i].FEMALES_VALUE;
                    break;
                case "males":
                    value = countries[i].MALES_VALUE;
                    break;
                default:
                    value = 0;
                    };
              break;
            };
        }
        
    return value;

}; 



function show() {
  var center, countries, height, path, projection, scale, colorScale, svg, width;
  width = 500;
  height = 350;
  center = [10, 70];
  scale = 300;
  d3.select("svg").remove();
  colorScale = d3.scale.quantize().domain([4,13]).range(colorbrewer.OrRd[9]);
  projection = d3.geo.mercator().scale(scale).translate([width / 2, 0]).center(center);
  path = d3.geo.path().projection(projection);
  svg = d3.select("#div1").append("svg").attr("height", height).attr("width", width);
  countries = svg.append("g");
  d3.json("europe_1_110.topo.json", function(data) {
    countries.selectAll('.country')
    .data(topojson.feature(data, data.objects.europe).features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('iso',function(d){ return d.properties.iso_a3;})
    .attr('name',function(d){ return d.properties.name;})
    .attr('d', path)
    .style('fill',function(d){
        return(colorScale(getValue(d)));
    })
    .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);	
            var dValue = function(){
              var t = getValue(d); 
              if(t > 0){ return (t + "%"); }
              else{ return "N/A";};
            };
            div.html(d.properties.name + "<br/>" + dValue())	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
  });
};


d3.selectAll("button")
    .on("click", function() {
        if (d3.select(this).attr("id") == "b_total") 
        {
            d3.select("#b_total").style("background", "#b0c4de");
            d3.select("#b_females").style("background", "#cccccc");
            d3.select("#b_males").style("background", "#cccccc");
            option = "total";
          }
        else if (d3.select(this).attr("id") == "b_females")
        {
            d3.select("#b_total").style("background", "#cccccc");
            d3.select("#b_females").style("background", "#b0c4de");
            d3.select("#b_males").style("background", "#cccccc");
            option = "females";
          }
        else if (d3.select(this).attr("id") == "b_males")
        {
            d3.select("#b_total").style("background", "#cccccc");
            d3.select("#b_females").style("background", "#cccccc");
            d3.select("#b_males").style("background", "#b0c4de");
            option = "males";
          }
          
 show(); 
        });
 
 function main(){
 d3.select("#b_total").style("background", "#b0c4de");
 show();
 };
 
 


