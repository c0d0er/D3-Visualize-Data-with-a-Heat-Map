class HeatMap extends React.Component {
  componentDidMount () {
    $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',(data)=>{
      let heatData = data.monthlyVariance;
      console.log(heatData)
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
      const margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70
      };
      let years=d3.extent(heatData, d=>d.year)
      //let months1=d3.extent(heatData, d=>d.month)
      let w=1200-margin.right-margin.left;
      let h=600-margin.top-margin.bottom;
      let xScale=d3.scaleLinear()
                   .domain(years)
                   .range([0,w]);

      let yScale=d3.scaleTime()
                   .domain([new Date(2016,0,1), new Date(2016,11,31)])
                   .range([0,h]);

      let xAxis=d3.axisBottom(xScale);   
      let yAxis=d3.axisLeft(yScale);

      let svg=d3.select('.heatmap')
                .append('svg')
                .attr('width', w+margin.right+margin.left)
                .attr('height', h+margin.top+margin.bottom)
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll('rect')
         .data(heatData)
         .enter()
         .append('rect');

      svg.append('g')
        .attr('class', 'axis')
           .attr('transform', 'translate(0,0)')
           //.style('font-size', '15px')
           .call(d3.axisLeft(yScale)
                   .ticks(d3.timeMonth)
                   .tickSize(16, 0)
                   .tickFormat(d3.timeFormat("%B"))
                   );
      svg.append('g')
         .attr('class', 'axis')
           .attr('transform', 'translate(0,'+h+')')
           .call(d3.axisBottom(xScale)
                  .ticks(19)
            );



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
