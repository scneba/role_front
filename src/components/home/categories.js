import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getCategories } from "../../services/categories";

export default function Categories() {
  return <CategoryTable></CategoryTable>;
}

export function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation(["shared"]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const resp = await getCategories();
        setCategories(resp.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <Table striped bordered hover size="l">
      <thead>
        <tr>
          <th>#</th>
          <th>{t("name")}</th>
          <th>{t("createdAt")}</th>
          <th>{t("updatedAt")}</th>
        </tr>
      </thead>
      <tbody>
        {categories ? (
          categories.map((category, index) => {
            return <CategoryRow key={category.id} category={category} />;
          })
        ) : (
          <tr></tr>
        )}
      </tbody>
    </Table>
  );

  function CategoryRow({ category }) {
    return (
      <tr>
        <td>{category.id}</td>
        <td>{category.name}</td>
        <td>{category.createdAt}</td>
        <td>{category.updatedAt}</td>
      </tr>
    );
  }
}
