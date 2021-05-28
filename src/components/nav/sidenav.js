import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../login/userContext";
import { usePermissions } from "../permissions";
import { ROLES_PATH, PAGES_PATH } from "../../services/auth";
import { Row, Col } from "react-bootstrap";

export default function SideBar() {
  const { t } = useTranslation(["nav"]);
  const user = useContext(UserContext);
  const canView = usePermissions(PAGES_PATH);
  if (!user || !canView) {
    return null;
  }
  return (
    <ProSidebar>
      <Menu iconShape="square">
        <SubMenu
          title={t("user_permissions")}
          icon={<FontAwesomeIcon icon="user" />}
          defaultOpen
        >
          <MenuItem>
            {t("permissions")}
            <Link to="/admin/permissions" />
          </MenuItem>
          <MenuItem>
            {t("roles")}
            <Link to="/admin/roles" />
          </MenuItem>
          <MenuItem>
            {t("users")}
            <Link to="/admin/users" />
          </MenuItem>
        </SubMenu>
        <SubMenu
          title={t("questions_dashboard")}
          icon={<FontAwesomeIcon icon="edit" />}
          defaultOpen
        >
          <MenuItem>
            {t("questions")}
            <Link to="/admin/questions" />
          </MenuItem>
          <MenuItem>
            {t("answers")}
            <Link to="/admin/answers" />
          </MenuItem>
          <MenuItem>
            {t("categories")}
            <Link to="/admin/categories" />
          </MenuItem>
        </SubMenu>
      </Menu>
    </ProSidebar>
  );
}
