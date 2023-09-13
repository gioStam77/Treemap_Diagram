w = 800;
h = 400;
url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

const createTreeMapDiagram = () => {
  d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("Highest Grossing Movies");
  d3.select("body")
    .append("h3")
    .attr("id", "description")
    .text("Top 95 Most sold Movies ");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .text("");

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  let hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });

  const createTreeMap = d3.treemap().size([w, h]);

  createTreeMap(hierarchy);

  const movieTiles = hierarchy.leaves();

  console.log(movieTiles);
  const block = svg
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie["x0"] + "," + movie["y0"] + ")";
    });
  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      let cat = movie["data"]["category"];
      if (cat === "Action") {
        return "red";
      } else if (cat === "Drama") {
        return "orange";
      } else if (cat === "Adventure") {
        return "yellow";
      } else if (cat === "Family") {
        return "steelblue";
      } else if (cat === "Animation") {
        return "pink";
      } else if (cat === "Comedy") {
        return "khaki";
      } else if (cat === "Biography") {
        return "tan";
      }
    })
    .attr("data-name", (movie) => {
      return movie["data"]["name"];
    })
    .attr("data-category", (movie) => {
      return movie["data"]["category"];
    })
    .attr("data-value", (movie) => {
      return movie["data"]["value"];
    })
    .attr("width", (movie) => {
      return movie["x1"] - movie["x0"];
    })
    .attr("height", (movie) => {
      return movie["y1"] - movie["y0"];
    })
    .on("mouseover", (movie) => {
      let name = movie["data"]["name"];
      let cat = movie["data"]["category"];
      let val = movie["data"]["value"];
      tooltip
        .transition()
        .text(`name:${name},category:${cat},value:${val}`)
        .style("left", `${d3.event.x}px`)
        .style("top", `${d3.event.y}px`)
        .duration(300)
        .style("opacity", "1")
        .attr("data-value", `${val}`);
    })
    .on("mouseout", (d) => {
      tooltip.transition().duration(300).style("opacity", "0");
    });

  block
    .append("text")
    .text((movie) => {
      return movie["data"]["name"];
    })
    .attr("x", 5)
    .attr("y", 20);

  const legend = d3.select("body").append("svg").attr("id", "legend");
  legend
    .selectAll("rect")
    .data(movieTiles)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("fill", (d, i) => {
      if (i === 0) {
        return "red";
      } else if (i === 1) {
        return "orange";
      } else if (i === 2) {
        return "yellow";
      } else if (i === 3) {
        return "steelblue";
      } else if (i === 4) {
        return "Animation";
      } else if (i === 5) {
        return "khaki";
      } else if (i === 6) {
        return "tan";
      }
    })
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", (d, i) => {
      return i * 50;
    })
    .attr("y", 15);

  legend
    .append("text")
    .text((d) => {
      return d["data"]["name"];
    })
    .attr("x", 5)
    .attr("y", 50);
};
d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    createTreeMapDiagram();
  }
});
