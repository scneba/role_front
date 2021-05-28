import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getArts } from "../../services/arts";

export default function Arts() {
  return <ArtsTable></ArtsTable>;
}

export function ArtsTable() {
  const [arts, setArts] = useState([]);
  const { t } = useTranslation(["shared"]);

  useEffect(() => {
    async function fetchArts() {
      try {
        const resp = await getArts();
        setArts(resp.data);
        console.log(resp.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchArts();
  }, []);

  return (
    <Table striped bordered hover size="l">
      <thead>
        <tr>
          <th>#</th>
          <th>{t("name")}</th>
          <th>{t("length")}</th>
          <th>{t("pictures")}</th>
          <th>{t("price")}</th>
          <th>{t("thickness")}</th>
          <th>{t("width")}</th>
          <th>{t("woodType")}</th>
          <th>{t("createdAt")}</th>
          <th>{t("updatedAt")}</th>
        </tr>
      </thead>
      <tbody>
        {arts ? (
          arts.map((art, index) => {
            return <ArtRow key={art.id} art={art} />;
          })
        ) : (
          <tr></tr>
        )}
      </tbody>
    </Table>
  );

  function ArtRow({ art }) {
    return (
      <tr>
        <td>{art.id}</td>
        <td>{art.name}</td>
        <td>{art.length}</td>
        <td>{art.picture}</td>
        <td>{art.price}</td>
        <td>{art.thickness}</td>
        <td>{art.width}</td>
        <td>{art.woodType}</td>
        <td>{art.createdAt}</td>
        <td>{art.updatedAt}</td>
      </tr>
    );
  }
}
