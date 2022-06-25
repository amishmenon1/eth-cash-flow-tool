import React, { useState, useRef } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const BlockInput = ({ onSubmit, fetchDisabled = false }) => {
  const NUMBERS_PATTERN = /^[0-9\b]+$/;
  const [error, setError] = useState(null);
  const startRef = useRef();
  const endRef = useRef();

  const numbersOnly = (val) =>
    !val || NUMBERS_PATTERN.test(val) ? null : "Numbers only";

  function onStartBlockChange(e) {
    setError(numbersOnly(e.target.value));
  }

  function onEndBlockChange(e) {
    if (e.target.value !== null) {
      setError(numbersOnly(e.target.value));
    }
  }

  function handleSubmit(e) {
    onSubmit(parseInt(startRef.current.value), parseInt(endRef.current.value));
  }

  const styles = {
    fetchData: {
      marginBottom: "10px",
      marginTop: "10px",
    },

    requiredField: { color: "red" },
  };

  return (
    <form
      className="mb-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <Row>
        <Col md={12}>
          <label htmlFor="start-block-input" className="float-left text-muted">
            <b>Start Block</b> <b style={styles.requiredFieldStyle}>*</b>
          </label>
          <input
            id="start-block-input"
            ref={startRef}
            type="number"
            onChange={onStartBlockChange}
            className="form-control form-control-lg"
            placeholder="10305800"
            required
            disabled={false}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <label htmlFor="end-block-input" className="float-left text-muted">
            <b>End Block (Optional)</b>
          </label>
          <input
            id="end-block-input"
            ref={endRef}
            type="number"
            onChange={onEndBlockChange}
            className="form-control form-control-lg"
            placeholder="10305827"
            required={false}
            disabled={false}
          />
        </Col>
      </Row>
      <Row>
        <div role="alert" style={styles.requiredField}>
          {error}
        </div>
      </Row>

      <button
        type="submit"
        disabled={fetchDisabled}
        style={styles.fetchData}
        className="btn btn-primary btn-block btn-lg"
      >
        Fetch Data!
      </button>
    </form>
  );
};

export default BlockInput;
