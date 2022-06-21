import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Disclaimer = ({ message }) => {
  return (
    <Col md={12}>
      <Row className="centeralign">
        {/* <Panel.Heading> */}
        {/* <Panel.Title componentClass="h3">Disclaimer</Panel.Title> */}
        <div className="h3">Disclaimer</div>
        {/* </Panel.Heading> */}
        {/* <Panel.Body> */}
        <Row>
          <p>{message}</p>
        </Row>
        {/* </Panel.Body> */}
      </Row>
    </Col>
  );
};

export default Disclaimer;
