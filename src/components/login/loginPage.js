import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Row, Form, Col } from "react-bootstrap";
import { getFormProps, FormField } from "../generics/forms";
import { RegisterButton } from "../generics/buttons";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as authApi from "../../services/auth";
import { showPopup } from "../generics/alerts";
export default function LoginPage({ setUser }) {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation(["login"]);
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const email = getFormProps("email", t("email"), "email");
  const password = getFormProps("password", t("password"), "password");

  const onSubmit = async (data) => {
    setDisable(true);
    //setErrors([]);
    try {
      let user = await authApi.login(data);
      setUser(user.data.data);
      history.push("/");
    } catch (err) {
      // showErrors(err, setErrors);
      showPopup(t("shared:fail"), "danger");
      console.log(err);
    }
  };
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="m-4">
        <Row>
          {/* <FormErrors errors={errors}></FormErrors> */}
          <FormField register={register} {...email}></FormField>
          <FormField register={register} {...password}></FormField>
          <RegisterButton
            disabled={disable}
            label={t("shared:register")}
          ></RegisterButton>
        </Row>
      </Form>
    </div>
  );
}
