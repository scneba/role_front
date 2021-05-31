import React, { useState, useEffect, useCallback } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as adminApi from "../../services/admin";
import { Table, Form, Col, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Permissions() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(adminApi.PAGES_PATH);
  const [permissions, setPermissions] = useState([]);

  async function fetchPermissions() {
    try {
      const resp = await adminApi.getPermissions();
      setPermissions(
        resp.data.data.sort((a, b) => a.path.localeCompare(b.path)),
      );
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (!canView) {
    return <Unauthorized />;
  }
  if (permissions.length === 0) {
    return "Loading";
  }
  return (
    <React.Fragment>
      <Row className="mb-3">
        <h3 className="text-primary d-inline mr-3 col">{t("permissions")}</h3>
      </Row>
      <CreatePermissionForm fetchPermissions={fetchPermissions} />
      <PermissionsTable
        permissions={permissions}
        fetchPermissions={fetchPermissions}
      />
    </React.Fragment>
  );
}

export function CreatePermissionForm({ fetchPermissions }) {
  const { t } = useTranslation(["admin", "shared"]);
  const [verb, setVerb] = useState("GET");
  const [path, setPath] = useState("");
  const canCreate = usePermissions(adminApi.PAGES_PATH, "POST");

  if (!canCreate) {
    return <React.Fragment />;
  }

  const verbs = ["GET", "POST", "PATCH", "PUT", "DELETE"];

  const createPermission = (e) => {
    e.preventDefault();
    var data = { verb, path };
    adminApi
      .createPermission(data)
      .then((resp) => {
        fetchPermissions();
        alert(t("shared:success"));
      })
      .catch((e) => {
        console.log(e);
        alert(e);
        alert(t("shared:internalError"));
      });
    setPath("");
    setVerb("GET");
  };
  return (
    <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
      <Form.Row>
        <Col sm={3} lg={2}>
          <Form.Control
            as="select"
            name="verb"
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
          >
            {verbs.map((v, i) => {
              return (
                <option key={i} value={v}>
                  {v}
                </option>
              );
            })}
          </Form.Control>
        </Col>
        <Col sm={6} lg={4}>
          <Form.Control
            type="text"
            name="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder={t("path")}
          />
        </Col>
        <Col>
          <Button
            variant="primary"
            style={{ marginLeft: "auto" }}
            onClick={createPermission}
          >
            {t("add")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export function PermissionsTable({ permissions, fetchPermissions }) {
  const { t } = useTranslation(["permissions"]);
  const [search, setSearch] = useState("");
  const [filteredPermissions, setFilteredPermissions] = useState(permissions);
  const canDelete = usePermissions(adminApi.PAGES_PATH, "POST");

  useEffect(() => {
    setFilteredPermissions(
      permissions.filter(
        (permission) =>
          permission.verb.toLowerCase().includes(search.toLowerCase()) ||
          permission.path.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, permissions]);

  return (
    <>
      <Row>
        <Col lg={7}>
          <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              name="Search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search")}
            ></Form.Control>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("verb")}</th>
                <th>{t("path")}</th>
                <th>{t("del")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.map((permission) => (
                <PermissionsRow
                  permission={permission}
                  key={permission.id}
                  fetchPermissions={fetchPermissions}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
  function PermissionsRow({ permission, fetchPermissions }) {
    return (
      <tr>
        <td>{permission.verb}</td>
        <td>{permission.path}</td>
        <td>
          <DeletePermission
            id={permission.id}
            canDelete={canDelete}
            fetchPermissions={fetchPermissions}
          />
        </td>
      </tr>
    );
  }
}

function DeletePermission({ id, canDelete, fetchPermissions }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deletePermission = () => {
    let result = window.confirm(t("confirmDel"));
    if (result === true) {
      adminApi
        .deletePermission(id)
        .then((response) => {
          fetchPermissions();
          alert(t("shared:success"));
        })
        .catch((e) => {
          console.error(e);
          alert(t("shared:internalError"));
        });
    }
  };

  return (
    <Button onClick={deletePermission} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}
