import React from "react";
import { Table } from "react-bootstrap";

const TableDisplay = ({ headers, data = [] }) => {
  console.log("TableDisplay component ---- render");
  const tableStyles = {
    maxHeight: "400px",
    overflowY: "scroll",
    marginBottom: "20px",
  };
  const dataStyles = {
    resultsRow: {
      textAlign: "left",
    },
  };
  const tableContent = () => {
    return data.length === 0 ? (
      <strong>No Records Found.</strong>
    ) : (
      <div>
        <Table striped bordered condensed="true" hover style={tableStyles}>
          <thead>
            <tr>
              {headers.value.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={`row-${item.hash}`}
                className="tableRow"
                style={dataStyles.resultsRow}
              >
                <td>{item.address}</td>
                <td>{item.value.toString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };
  return tableContent();
};

export default TableDisplay;
