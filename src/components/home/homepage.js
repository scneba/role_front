import { Row, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { getFormProps, FormField } from "../generics/forms";
import { RegisterButton } from "../generics/buttons";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getCategories } from "../../services/categories";

export default function HomePage() {
  const { t } = useTranslation(["shared"]);
  let simpleform = getFormProps("first_name", "First Name");
  const { register, handleSubmit } = useForm({
    defaultValues: { first_name: "The stk" },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const resp = await getCategories();
        console.log(resp);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategories();
  }, []);

  const onSubmit = (data) => {
    const d = [{ ...data }];
    console.log(d);
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="m-4">
      <Row>
        <FormField register={register} {...simpleform}></FormField>
        <RegisterButton label={t("save")}></RegisterButton>
      </Row>
    </Form>
  );
}
