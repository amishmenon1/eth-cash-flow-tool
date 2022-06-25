import React from "react";
import { Table } from "react-bootstrap";

const TableDisplay = ({ headers, data = [] }) => {
  console.log("TableDisplay ---- render");
  const tableContent = () => {
    return data.length === 0 ? (
      <strong>No Records Found.</strong>
    ) : (
      <Table striped bordered condensed="true" hover>
        <thead>
          <tr>
            {headers.value.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`row-${item.hash}`} className="tableRow results-row">
              <td>{item.address}</td>
              <td>{item.value.toString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  return tableContent();
};

export default TableDisplay;
