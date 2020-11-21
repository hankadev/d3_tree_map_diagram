/* global d3 */
(function () {
  'use strict';
  const categories = {
    Action: '#ad1f8e',
    Drama: '#a267e6',
    Adventure: '#486bdb',
    Family: '#48db8f',
    Animation: '#bedb48',
    Comedy: '#d17219',
    Biography: '#d13819'
  };

  function getColor(movie) {
    const category = movie.data.category;
    if (categories[category]) {
      return categories[category];
    }
    return '#f5e5fc';
  }

  function showTooltip(movie) {
    const value = Number(movie.data.value);
    return movie.data.name + '<br />' + 'category: ' + movie.data.category + '<br />' + value.toLocaleString();
  }

  const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
  d3.json(url).then(function (data) {
    if (data) {
      const width = 1100;
      const height = 600;

      const hierarchy =
        d3.hierarchy(data, item => item.children)
          .sum(item => item.value)
          .sort((a, b) => b.value - a.value);

      const tiles = hierarchy.leaves();

      const createTreeMap =
        d3.treemap()
          .size([width, height])
          .paddingInner(0.5);

      createTreeMap(hierarchy);

      const svg =
        d3.select('#canvas')
          .append('svg')
          .attr('width', width)
          .attr('height', height);

      const tooltip =
        d3.select('#canvas')
          .append('div')
          .attr('id', 'tooltip');

      const block =
        svg.selectAll('g')
          .data(tiles)
          .enter()
          .append('g')
          .attr('transform', movie => 'translate(' + movie.x0 + ',' + movie.y0 + ')')
          .on('mouseover', movie => {
            tooltip
              .attr('data-value', movie.data.value)
              .html(showTooltip(movie))
              .style('top', (d3.event.pageY) + 'px')
              .style('left', (d3.event.pageX) + 'px')
              .style('visibility', 'visible');
          })
          .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
          });

      block.append('rect')
        .attr('class', 'tile')
        .attr('width', movie => movie.x1 - movie.x0)
        .attr('height', movie => movie.y1 - movie.y0)
        .attr('data-name', movie => movie.data.name)
        .attr('data-category', movie => movie.data.category)
        .attr('data-value', d => d.value)
        .attr('fill', movie => getColor(movie))

      block.append('text')
        .selectAll('tspan')
        .data(function (d) {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append('tspan')
        .attr('x', 5)
        .attr('y', (d, i) => 10 + i * 10)
        .text(d => d);

      // add legend
      const legend = d3
        .select('#legend')
        .append('svg')
        .attr('width', 150)
        .attr('height', height)

      legend
        .append('text')
        .attr('x', 20)
        .attr('y', 90)
        .style('text-anchor', 'start')
        .text('Categories');

      let i = 0;
      for (const [key, value] of Object.entries(categories)) {
        console.log(i)
        legend.append('rect')
          .attr('class', 'legend-item')
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', 20)
          .attr('y', 100 + i * 25)
          .attr('fill', value);
        legend.append('text')
          .attr('x', 45)
          .attr('y', 115 + i * 25)
          .style('text-anchor', 'start')
          .text(key);
        i++;
      }
    }
  })
}());
