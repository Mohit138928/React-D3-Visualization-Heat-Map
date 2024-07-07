import React from "react";
import * as d3 from "d3";

let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let req = new XMLHttpRequest();

let baseTemp;
let values = [];

let xScale;
let yScale;

let minYear;
let maxYear;

let width = 1200;
let height = 600;
let padding = 60;

let canvas = d3.select("#canvas");
canvas.attr("width", width);
canvas.attr("height", height);

let tooltip = d3.select("#tooltip");

let generateScales = () => {
  minYear = d3.min(values, (item) => {
    return item["year"];
  });

  maxYear = d3.max(values, (item) => {
    return item["year"];
  });

  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

let drawCells = () => {
  canvas
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (item) => {
      if (item["variance"] <= -1) {
        return "SteelBlue";
      } else if (item["variance"] <= 0) {
        return "LightSteelBlue";
      } else if (item["variance"] < 1) {
        return "Orange";
      } else {
        return "Crimson";
      }
    })
    .attr("data-month", (item) => {
      return item["month"] - 1;
    })
    .attr("data-year", (item) => {
      return item["year"];
    })
    .attr("data-temp", (item) => {
      return baseTemp + item["variance"];
    })
    .attr("height", (item) => {
      let hpad = 2 * padding;
      return (height - hpad) / 12;
    })
    .attr("y", (item) => {
      return yScale(new Date(0, item["month"] - 1, 0, 0, 0, 0, 0));
    })
    .attr("width", (item) => {
      let numberOfYears = maxYear - minYear;
      let wpad = 2 * padding;
      return (width - wpad) / numberOfYears;
    })
    .attr("x", (item) => {
      return xScale(item["year"]);
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");

      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      tooltip.text(
        item["year"] +
          " " +
          monthNames[item["month"] - 1] +
          " : " +
          (baseTemp + item["variance"]) +
          "(" +
          item["variance"] +
          ")"
      );
      tooltip.attr("data-year", item["year"]);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

let drawAxis = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  canvas
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  canvas
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + " ,0)");
};

req.open("GET", url, true);
req.onload = () => {
  let object = JSON.parse(req.responseText);
  baseTemp = object["baseTemperature"];
  values = object["monthlyVariance"];
  generateScales();
  drawCells();
  drawAxis();
};

req.send();

const HeatMap = () => {
  return (
    <>
      <h1 id="title">Monthly Global Land-Surface Temperature</h1>
      <h4 id="description">Temperatures from 1753 to 2015. Average is 8.66C</h4>
      <div id="tooltip"></div>
      <svg id="canvas"></svg>
      <svg id="legend">
        <g>
          <rect x="10" y="0" width="40" height="40" fill="SteelBlue"></rect>
          <text x="60" y="20" fill="#000">
            Variance of -1 or less
          </text>
        </g>
        <g>
          <rect
            x="10"
            y="40"
            width="40"
            height="40"
            fill="LightSteelBlue"
          ></rect>
          <text x="60" y="60" fill="#000">
            On or Below Average
          </text>
        </g>
        <g>
          <rect x="10" y="80" width="40" height="40" fill="Orange"></rect>
          <text x="60" y="100" fill="#000">
            Above Average
          </text>
        </g>
        <g>
          <rect x="10" y="120" width="40" height="40" fill="Crimson"></rect>
          <text x="60" y="140" fill="#000">
            Variance of +1 or more
          </text>
        </g>
      </svg>
      <div className="footer">
        Created by{" "}
        <a href="https://www.linkedin.com/in/mohit-maurya-76a282204/">
          Mohit Maurya
        </a>
      </div>
    </>
  );
};

export default HeatMap;
