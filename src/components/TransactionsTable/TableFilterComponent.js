import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import TableFilter from "../../enum/TableFilter";

const { SENDER, RECIPIENT } = TableFilter;

const TableFilterComponent = ({ toggleCallback }) => {
  const filters = [SENDER, RECIPIENT];
  const filterGroup = useRef();
  useEffect(() => {
    if (!filterGroup) {
      return;
    }
    setDefaultFilterSelection(filterGroup);
  }, [filterGroup]);

  function setDefaultFilterSelection(filterGroupElement) {
    const recipientFilter = filterGroupElement.current.children[1];
    recipientFilter.classList.toggle("btn-primary");
  }
  function toggleFilterClasses(target) {
    if (target.classList.contains("btn-primary")) {
      // button has already been selected - do nothing
      return;
    }
    target.classList.toggle("btn-primary");
    const sibling = getSibling(target);
    sibling.classList.toggle("btn-primary");
  }

  function getSibling(element) {
    return element.nextSibling ? element.nextSibling : element.previousSibling;
  }

  function toggleFilter(element) {
    const target = element.target;
    toggleFilterClasses(target);
    toggleCallback(target.value);
  }

  return (
    <ButtonGroup
      style={{ paddingTop: "10px", paddingBottom: "20px" }}
      justified="true"
      size="lg"
      className="mb-2"
      ref={filterGroup}
    >
      {filters.map((filter) => (
        <Button
          id={filter.value}
          style={{ height: "35px", fontSize: "inherit" }}
          onClick={toggleFilter}
          value={filter.value}
          key={filter.value}
        >
          {filter.text}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default TableFilterComponent;
