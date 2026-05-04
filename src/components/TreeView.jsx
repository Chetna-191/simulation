import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeView = ({ root, roots, activeNodes = [], codes = {} }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const currentRoots = roots || (root ? [root] : []);
    if (currentRoots.length === 0) return;

    const width = svgRef.current.clientWidth || 950;
    const height = svgRef.current.clientHeight || 600;
    const svg = d3.select(svgRef.current);
    
    let g = svg.select("g.main-container");
    if (g.empty()) {
      g = svg.append("g").attr("class", "main-container");
    }

    const t = svg.transition().duration(800).ease(d3.easeQuadOut);

    // Calculate layouts for all trees in the forest
    let allNodes = [];
    let allLinks = [];
    let currentXOffset = 50;
    const GAP = 20;
    const AVAILABLE_WIDTH = width - 100;
    
    currentRoots.forEach((r, i) => {
      const segmentWidth = AVAILABLE_WIDTH / currentRoots.length;
      const treeLayout = d3.tree().size([segmentWidth - GAP, height - 200]);
      const hierarchy = d3.hierarchy(r, d => [d.left, d.right].filter(n => n));
      const treeData = treeLayout(hierarchy);

      const getDepth = (n) => {
        if (!n.left && !n.right) return 0;
        return 1 + Math.max(getDepth(n.left || {}), getDepth(n.right || {}));
      };
      const maxTreeDepth = getDepth(r);
      const LEVEL_HEIGHT = 80;
      const BOTTOM_PADDING = 100;

      treeData.descendants().forEach(d => {
        d.x += currentXOffset;
        const depthFromBottom = maxTreeDepth - d.depth;
        d.y = height - BOTTOM_PADDING - (depthFromBottom * LEVEL_HEIGHT);
      });

      allNodes.push(...treeData.descendants());
      allLinks.push(...treeData.links());
      currentXOffset += segmentWidth;
    });

    // 1. Links
    const links = g.selectAll(".link")
      .data(allLinks, d => d.target.data.id);

    links.enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0)
      .merge(links)
      .transition(t)
      .attr("opacity", 1)
      .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));

    links.exit().transition(t).attr("opacity", 0).remove();

    // 2. Link Labels
    const linkLabels = g.selectAll(".link-label")
      .data(allLinks, d => d.target.data.id);

    linkLabels.enter()
      .append("text")
      .attr("class", "link-label")
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", "9px")
      .attr("opacity", 0)
      .merge(linkLabels)
      .transition(t)
      .attr("opacity", 1)
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2 - 5)
      .text(d => d.target.x < d.source.x ? "0" : "1");

    linkLabels.exit().remove();

    // 3. Nodes
    const nodes = g.selectAll(".node")
      .data(allNodes, d => d.data.id);

    const nodeEnter = nodes.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("opacity", 0);

    nodeEnter.each(function(d) {
      const el = d3.select(this);
      const color = d.data.color || "#7c4dff";
      if (d.data.isLeaf()) {
        el.append("rect")
          .attr("x", -18).attr("y", -18)
          .attr("width", 36).attr("height", 36)
          .attr("rx", 8)
          .attr("fill", color)
          .attr("fill-opacity", 0.15)
          .attr("stroke", color)
          .attr("stroke-width", 2);
      } else {
        const isRoot = !d.parent;
        el.append("circle")
          .attr("r", isRoot ? 24 : 20)
          .attr("fill", "rgba(255,255,255,0.05)")
          .attr("stroke", isRoot ? "gold" : "rgba(255,255,255,0.4)")
          .attr("stroke-width", 2)
          .style("filter", isRoot ? "drop-shadow(0 0 10px gold)" : "none");
      }
    });

    nodeEnter.append("text").attr("class", "main-text");
    nodeEnter.append("text").attr("class", "freq-text");

    const nodeUpdate = nodeEnter.merge(nodes);

    nodeUpdate.transition(t)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("opacity", 1);

    nodeUpdate.select(".main-text")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", d => d.data.isLeaf() ? "12px" : "10px")
      .attr("font-weight", "600")
      .attr("dy", 4)
      .text(d => d.data.char === ' ' ? 'SPC' : (d.data.char || d.data.freq));

    nodeUpdate.select(".freq-text")
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", "9px")
      .attr("dy", 32)
      .style("display", d => d.data.isLeaf() ? "block" : "none")
      .text(d => d.data.isLeaf() ? d.data.freq : "");

    // Pulse for active
    nodeUpdate.selectAll("rect, circle")
      .style("stroke", d => activeNodes.includes(d.data.id) ? "#00ff88" : (d.data.isLeaf() ? (d.data.color || "#7c4dff") : (d.parent ? "rgba(255,255,255,0.4)" : "gold")))
      .style("stroke-width", d => activeNodes.includes(d.data.id) ? 4 : 2)
      .style("filter", d => activeNodes.includes(d.data.id) ? "drop-shadow(0 0 10px #00ff88)" : "none");

    nodes.exit().transition(t).style("opacity", 0).remove();
  }, [root, roots, activeNodes, codes]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TreeView;
