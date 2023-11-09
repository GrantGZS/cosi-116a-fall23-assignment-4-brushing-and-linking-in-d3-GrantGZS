/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher,
    mouseDown=false
    selectedRows=[];

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
    
    // YOUR CODE HERE
    let tr = table.append('thead').append('tr')
    tr.selectAll('th').data(tableHeaders).enter().append('th').text((d) => d)
    
    // Then, you add a row for each row of the data.  Within each row, you
    // add a cell for each piece of data in the row.
    // HINTS: For each piece of data, you should add a table row.
    // Then, for each table row, you add a table cell.  You can do this with
    // two different calls to enter() and data(), or with two different loops.
    
    // YOUR CODE HERE
    console.log('databody creation')
    let tbody=table.append('tbody');
    let rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .classed('data-row', true);
    // Create a cell in each row for each column
    let cells = rows.selectAll('td')
    .data(function(row) {
    // Map the row object values to an array
    return tableHeaders.map(function(column) {
      return {column: column, value: row[column]};
    });
    })
    .enter()
    .append('td')
    .text(function(d) {
       return d.value;
    });


   
    // Then, add code to allow for brushing.  Note, this is handled differently
    // than the line chart and scatter plot because we are not using an SVG.
    // Look at the readme of the assignment for hints.
    // Note: you'll also have to implement linking in the updateSelection function
    // at the bottom of this function.
    // Remember that you have to dispatch that an object was highlighted.  Look
    // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

    // HINT for brushing on the table: keep track of whether the mouse is down or up, 
    // and when the mouse is down, keep track of any rows that have been mouseover'd

    // YOUR CODE HERE
    // Handle mouseover events to highlight rows
   

    tbody.selectAll('tr')
    .on("mouseover", function() {
      // Only brush if the mouse is down.
      if (mouseDown) {
        let currentRow = d3.select(this);
        currentRow.classed("selected", !isSelected);
        updateSelectedRows(d3.select(this.datum(),!isSelected))
      }
    })
    .on("mousedown", function() {
      mouseDown = true;
      let isSelected = d3.select(this).classed("selected");
      d3.select(this).classed("selected", !isSelected);
      updateSelectedRows(d3.select(this).datum(), !isSelected);
      d3.event.preventDefault(); // Prevent text selection
    });

  // Change: Added a global mouseup listener to handle when the mouse is released.
  d3.select('body').on("mouseup", function() {
    mouseDown = false;
  });
  function updateSelectedRows(rowData, isSelected) {
    if (isSelected) {
      selectedRows.push(rowData);
    } else {
      selectedRows = selectedRows.filter(row => row !== rowData);
    }
    if (dispatcher) {
      dispatcher.call("selectionUpdated", null, selectedRows);
    }
  }
    return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
   
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    d3.selectAll('tbody tr').classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}