class HeatMap extends React.Component {
  componentDidMount () {
    $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',(data)=>{
      let heatData = data.monthlyVariance;
      let heatData1=heatData.slice();

      
      heatData1.forEach((e,i)=>{
  var c=e.variance;
  e.variance=c*1.8+32;
})
      console.log(heatData1)
      const baseTemp=data.baseTemperature;
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
      const margin = {
        top: 70,
        right: 70,
        bottom: 100,
        left: 70
      };
      let years=d3.extent(heatData, d=>d.year);//[1753, 2015];
      let temp=d3.extent(heatData, d=>d.variance);//[-6.976, 5.228];

      let w=1200-margin.right-margin.left;
      let h=600-margin.top-margin.bottom;
      let rectXwidth=w/(years[1]-years[0]+1);

      let colorScale = d3.scaleQuantile()
                         .domain([temp[0]+baseTemp,temp[1]+baseTemp])
                         .range(colors);
                         console.log(colorScale.quantiles());
      let xScale=d3.scaleLinear()
                   .domain(years)
                   .range([0,w]);

      let yScale=d3.scaleTime()
                   .domain([new Date(2016,0,1), new Date(2016,11,31)])
                   .range([0,h]);

      let div=d3.select('.heatmap').append('div');

      let svg=d3.select('.heatmap')
                .append('svg')
                .attr('width', w+margin.right+margin.left)
                .attr('height', h+margin.top+margin.bottom)
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll('rect')
         .data(heatData)
         .enter()
         .append('rect')
         .attr('x',d=>(d.year-years[0])*rectXwidth)
         .attr('y',d=>(d.month-1)*(h/12))
         .attr('width', rectXwidth)
         .attr('height', h/12)
         .attr('fill', d=>colorScale(d.variance+baseTemp))
         .on('mouseover', function(d){
            div.html('<div class="tooltip1"><span class="year">'+d.year+' - '+months[d.month-1]+
                      '</span><br><span class="currentTemp">'
                      +(baseTemp+d.variance).toFixed(3)+' &#8451</span><br><span class="variance">'
                      +d.variance.toFixed(3)+' &#8451</span></div>')
              .style('left', (d3.event.clientX+5) + 'px')
               .style('top', (d3.event.clientY-50) + 'px')
               .style('position', 'absolute');
            })
         .on('mouseout', function(){
            d3.select('.tooltip1')
              .classed('hidden', 'true')
         })

      svg.append('g')//add y axis
        .attr('class', 'y axis')
           .attr('transform', 'translate(0,0)')
         .style('font-size', '12px')
           .call(d3.axisLeft(yScale)
                   .ticks(d3.timeMonth)
                   .tickSize(16, 0)
                   .tickFormat(d3.timeFormat("%B"))
                   )
           .selectAll("text")//change y axis text
           .attr("y", 20)
           .attr("x", -5)
         //.attr("dy", ".35em")
         //.attr("transform", "rotate(90)")
           .style("text-anchor", "beginning");

      svg.append('g')//add x axis;
         .attr('class', 'x axis')
           .attr('transform', 'translate(0,'+h+')')
           .style('font-size', '12px')
           .call(d3.axisBottom(xScale)
                  .ticks(19)
            );
           //setup legend data;
      let legendArr=[0].concat(colorScale.quantiles())
      // setup legend;
      let legend= svg.selectAll('.legend')
                     .data(legendArr)
                     .enter()
                     .append('g')
                     .attr('class', 'legend');
      //add colors of legend;   
         legend.append('rect')
         .attr('x', (d,i)=>40*i+(w-40*colors.length))
         .attr('y', h+30)
         .attr('width', 40)
         .attr('height', 20)
         .style('fill', (d,i)=>colors[i]);
      //add text of legend;
         legend.append('text')
         .text(d=>d.toFixed(1))
         .attr('x', (d,i)=>40*i+(w-40*colors.length)+8)
         .attr('y', h+70);
    })
  }

  render () {
    return (
      <div className='heatmap'>
      </div>
    )
  }
}

ReactDOM.render(<HeatMap/>,
 document.getElementById('app'));
