export function getUnassignedPermissions(permissions, userPermissions) {
  let unassigned = [];
  //add all permissions if user has no permission
  if (userPermissions.length === 0) {
    unassigned = permissions.map((perm) => ({
      value: perm.id,
      label: [perm.verb, "   ", perm.path],
    }));
  } else {
    for (let permission of permissions) {
      //check if any match exists
      let match = userPermissions.filter(
        (userPerm) =>
          userPerm.path === permission.path &&
          userPerm.verb === permission.verb,
      );
      //add to unassigned if a matche does not exist
      if (match.length === 0) {
        unassigned.push({
          value: permission.id,
          label: [permission.verb, "   ", permission.path],
        });
      }
    }
  }

  return unassigned;
}

export function getUnassignedRoles(roles, userRoles) {
  let unassigned = [];
  //add all permissions if user has no permission
  if (userRoles.length === 0) {
    unassigned = roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));
  } else {
    for (let role of roles) {
      //check if any match exists
      let match = userRoles.filter((userRole) => userRole.name === role.name);
      //add to unassigned if a match does not exist
      if (match.length === 0) {
        unassigned.push({
          value: role.id,
          label: role.name,
        });
      }
    }
  }

  return unassigned;
}

//Get all ids as values
export function getPermissionIds(selectedOptions) {
  var permissions_id = [];
  selectedOptions.forEach((permission) => {
    permissions_id.push(permission.value);
  });
  return permissions_id;
}

// adds roleId and portfolioId to inital roles -- these come from the API without IDs
export function populateIds(initialRoles, roles, portfolios) {
  if (initialRoles != null) {
    initialRoles.forEach((r) => {
      if (r.name !== "") {
        const role = roles.find((role) => role.name === r.name);
        const portfolio = portfolios.find(
          (portfolio) => portfolio.short_code === r.portfolio,
        );

        if (role) {
          r.roleId = role.id;
        }
        if (portfolio) {
          r.portfolioId = portfolio.id;
        }
      }
    });
    return initialRoles;
  }
}
