import React from "react";
import Row from "react-bootstrap/Row";

const Disclaimer = ({ message }) => {
  return (
    <Row className="centeralign">
      <div className="h3">Disclaimer</div>
      <Row>
        <p>{message}</p>
      </Row>
    </Row>
  );
};

export default Disclaimer;
