import React from "react";
import { Row, Form, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// FormField is custom component that renders an input text or date
export function FormField(props) {
  return (
    <Col
      md={props.md ? props.md : 6}
      lg={props.lg ? props.lg : 4}
      xs={props.xs ? props.xs : 12}
    >
      <Form.Group controlId={props.controlId}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          readOnly={props.readOnly === "true"}
          required={props.required === "true"}
          ref={props.register}
          type={props.type}
          name={props.name}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          as={props.as}
          step={props.step}
          min={props.min}
          max={props.max}
        ></Form.Control>
      </Form.Group>
    </Col>
  );
}

//InlineFormField is custom component that renders an input text or date
export function InlineFormField(props) {
  return (
    <Form.Group
      className={props.className}
      as={Row}
      controlId={props.controlId}
    >
      <Form.Label
        column
        md={props.lmd ? props.md : 4}
        lg={props.llg ? props.lg : 4}
        xs={props.lxs ? props.xs : 6}
        style={{ textAlign: "right" }}
      >
        {props.label}
      </Form.Label>
      <Col
        md={props.lmd ? props.md : 8}
        lg={props.llg ? props.lg : 8}
        xs={props.lxs ? props.xs : 6}
      >
        <Form.Control
          readOnly={props.readOnly === "true"}
          disabled={props.disabled}
          required={props.required === "true"}
          ref={props.register}
          type={props.type}
          name={props.name}
          defaultValue={props.defaultValue}
          test-id={props.test_id}
          min={props.minVal}
          max={props.maxVal}
          step={props.step}
        />
      </Col>
    </Form.Group>
  );
}

//InlineFormSelect is custom component that renders an input text or date
// TODO add default value functionality
export function InlineFormSelect(props) {
  return (
    <Form.Group
      className={props.className}
      as={Row}
      controlId={props.controlId}
    >
      <Form.Label
        column
        md={props.lmd ? props.md : 4}
        lg={props.llg ? props.lg : 4}
        xs={props.lxs ? props.xs : 6}
        style={{ textAlign: "right" }}
      >
        {props.label}
      </Form.Label>
      <Col
        md={props.lmd ? props.md : 8}
        lg={props.llg ? props.lg : 8}
        xs={props.lxs ? props.xs : 6}
      >
        <Form.Control
          disabled={props.disabled}
          required={props.required === "true"}
          ref={props.register}
          as={props.type}
          name={props.name}
          test-id={props.test_id}
          defaultValue={props.defaultValue}
        >
          {props.nullValue ? (
            <option value={null}>{props.nullValue}</option>
          ) : null}
          {props.options.length
            ? props.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.name}
                </option>
              ))
            : null}
        </Form.Control>
      </Col>
    </Form.Group>
  );
}

// FormSelect is custom component that renders a selection field with options
export function FormSelect(props) {
  const options = props.options || [];
  return (
    <Col
      md={props.md ? props.md : 6}
      lg={props.lg ? props.lg : 4}
      xs={props.xs ? props.xs : 12}
    >
      <Form.Group controlId={props.controlId}>
        <Form.Label>{props.label}</Form.Label>
        <Form.Control
          required={props.required === "true"}
          ref={props.register}
          as={props.type}
          name={props.name}
          data-testid="control-form"
          defaultValue={props.defaultValue}
          onChange={props.onChange}
        >
          {props.nullText ? (
            <option value={null}>{props.nullText}</option>
          ) : null}
          {options.map((option) => {
            return (
              <option value={option.value} key={option.value}>
                {option.name}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
    </Col>
  );
}

// FormCheck is custom component that renders a checkbox or switch field
export function FormCheck(props) {
  return (
    <Col
      md={props.md ? props.md : 6}
      lg={props.lg ? props.lg : 4}
      xs={props.xs ? props.xs : 12}
    >
      <Form.Group controlId={props.controlId}>
        <Form.Check
          key={props.key}
          className="pt-4 pl-5"
          ref={props.register}
          type={props.type}
          name={props.name}
          label={props.label}
          onChange={props.onChange}
          defaultChecked={props.defaultValue === "true"}
        ></Form.Check>
      </Form.Group>
    </Col>
  );
}

// getFormProps returns an object that can be read easily by <Form.Control>
export function getFormProps(
  name,
  label,
  type = "text",
  required = "true",
  defaultValue = "",
  nullValue = "",
  options = [],
  readOnly = "false",
  placeholder = "",
  step = "",
  min = "",
  max = "",
) {
  const controlId = name;
  return {
    name,
    label,
    type,
    required,
    controlId,
    defaultValue,
    nullValue,
    options,
    readOnly,
    placeholder,
    step,
    min,
    max,
  };
}

export function CardFieldSelect(props) {
  return (
    <Form.Group as={Row} controlId={props.name}>
      <Form.Label
        column
        md={props.md ? props.md : 6}
        lg={props.lg ? props.lg : 4}
        xs={props.xs ? props.xs : 12}
      >
        {props.label}
      </Form.Label>
      <Col
        md={props.md ? props.md : 6}
        lg={props.lg ? props.lg : 4}
        xs={props.xs ? props.xs : 12}
      >
        <Form.Control
          ref={props.register}
          name={props.name}
          as="select"
          readOnly={props.readOnly}
          plaintext={props.plaintext}
          defaultValue={props.defaultValue}
          onChange={props.onChange}
        >
          {props.options.length
            ? props.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.name}
                </option>
              ))
            : null}
        </Form.Control>
      </Col>
    </Form.Group>
  );
}

export function FormErrors({ errors }) {
  if (errors && errors.length > 0) {
    return (
      <Col md={12}>
        <div className="ml-3 mt-3 mb-3" style={{ color: "red" }}>
          {errors.length > 0 ? errors : <br />}
        </div>
      </Col>
    );
  } else {
    return <br />;
  }
}

/**
 * Show Loading Errors
 * TODO: could add a picture
 * @returns
 */
export function LoadingErrors() {
  const { t } = useTranslation(["shared"]);
  return (
    <Row>
      <h1 className=" text-primary">{t("loadingFailed")}</h1>
    </Row>
  );
}
