import React from "react";
import { Link } from "react-router-dom";
import { Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// RegisterButton is a custom form field for submission
export function RegisterButton(props) {
  return (
    <Col
      md={props.md ? props.md : 3}
      lg={props.lg ? props.lg : 2}
      xs={props.xs ? props.xs : 4}
    >
      <Button type="submit" variant="danger" className="mt-4 mb-1 p-3">
        <FontAwesomeIcon icon="plus"></FontAwesomeIcon> {props.label}
      </Button>
    </Col>
  );
}

// SaveButton is a custom form field for submission
export function SaveButton(props) {
  return (
    <Col
      md={props.md ? props.md : 6}
      lg={props.lg ? props.lg : 4}
      xs={props.xs ? props.xs : 12}
    >
      <Button type="submit" variant="primary" className="mt-4 mb-1 pull-right">
        <FontAwesomeIcon icon="save"></FontAwesomeIcon> {props.label}
      </Button>
    </Col>
  );
}
