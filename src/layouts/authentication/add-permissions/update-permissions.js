import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  useFetchPermissionsQuery,
  useFetchPermissionsByGroupIdQuery,
  useUpdateGroupPermissionsMutation,
} from "api/auth/permissionApi";
import { Card, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const UpdatePermissionsTable = ({ groupId }) => {
  const location = useLocation();
  const { role } = location.state || {};
  console.log("Received Role:", role);

  const { data: permissions = [], isLoading: isPermissionsLoading, error } = useFetchPermissionsQuery();
  const { data: groupPermissions, isLoading: isGroupLoading } = useFetchPermissionsByGroupIdQuery(role?.id);
  const [updateGroupPermissions] = useUpdateGroupPermissionsMutation();

  const [permissionState, setPermissionState] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState(role?.role || "");
  const [selectAll, setSelectAll] = useState(false);

  // Initialize permissions state
  useEffect(() => {
    if (permissions.length > 0) {
      const initialState = {};
      permissions.forEach((perm) => {
        initialState[perm.name] = {
          isAdd: false,
          isView: false,
          isChange: false,
          isDelete: false,
        };
      });
      setPermissionState(initialState);
    }
  }, [permissions]);

  // Prepopulate permissions state if groupPermissions is available
  useEffect(() => {
    if (groupPermissions) {
      const updatedState = {};
      groupPermissions.forEach((perm) => {
        if (perm.name) {
          updatedState[perm.name] = {
            isAdd: perm.isAdd || false,
            isView: perm.isView || false,
            isChange: perm.isChange || false,
            isDelete: perm.isDelete || false,
          };
        }
      });
      setPermissionState((prevState) => ({ ...prevState, ...updatedState }));
    }
  }, [groupPermissions]);

  const handleCheckboxChange = (role, action) => {
    setPermissionState((prevState) => {
      const rolePermissions = prevState[role] || {
        isAdd: false,
        isView: false,
        isChange: false,
        isDelete: false,
      };

      return {
        ...prevState,
        [role]: {
          ...rolePermissions,
          [action]: !rolePermissions[action],
        },
      };
    });
  };

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll;
    setSelectAll(newSelectAllState);

    setPermissionState((prevState) => {
      const updatedState = {};
      Object.keys(prevState).forEach((role) => {
        updatedState[role] = {
          isAdd: newSelectAllState,
          isView: newSelectAllState,
          isChange: newSelectAllState,
          isDelete: newSelectAllState,
        };
      });
      return updatedState;
    });
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required.");
      return;
    }

    const permissionsPayload = Object.keys(permissionState).flatMap((role) => {
      const permissionDetails = groupPermissions.find((perm) => perm.name === role);

      return [
        permissionDetails?.isAdd ? permissionDetails?.add : null,
        permissionDetails?.isChange ? permissionDetails?.change : null,
        permissionDetails?.isDelete ? permissionDetails?.delete : null,
        permissionDetails?.isView ? permissionDetails?.view : null,
      ].filter((id) => id !== null && id !== false && id !== undefined);
    });

    console.log("permissionsPayload: ", permissionsPayload);

    try {
      const message = await updateGroupPermissions({
        name: groupName,
        group_id: role?.id,
        permissions: permissionsPayload,
      }).unwrap();

      toast.success(message);
    } catch (err) {
      toast.error(err.message || "Failed to update group permissions.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPermissions = permissions.filter((perm) =>
    perm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "srNo", headerName: "Sr. No.", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "role", headerName: "Role", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "add",
      headerName: "Add",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isAdd || false}
          onChange={() => handleCheckboxChange(params.row.role, "isAdd")}
        />
      ),
      align: "center",
    },
    {
      field: "view",
      headerName: "View",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isView || false}
          onChange={() => handleCheckboxChange(params.row.role, "isView")}
        />
      ),
      align: "center",
    },
    {
      field: "update",
      headerName: "Update",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isChange || false}
          onChange={() => handleCheckboxChange(params.row.role, "isChange")}
        />
      ),
      align: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={permissionState[params.row.role]?.isDelete || false}
          onChange={() => handleCheckboxChange(params.row.role, "isDelete")}
        />
      ),
      align: "center",
    },
  ];

  const rows = filteredPermissions.map((permission, index) => ({
    id: index,
    srNo: index + 1,
    role: permission.name,
  }));

  if (isPermissionsLoading || isGroupLoading) return <div>Loading permissions...</div>;
  if (error) return <div>Error loading permissions: {error.message}</div>;

  return (
    <MDBox p={3}>
    <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search Permissions"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Update Roles & Permissions
          </MDTypography>
          <MDButton variant="contained" color="primary" onClick={handleSelectAll} sx={{ ml: 2 }}>
            {selectAll ? "Deselect All" : "Select All"}
          </MDButton>
          <MDButton variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
            Submit
          </MDButton>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-start" sx={{ mt: 2, mb: 2, ml: 3 }}>
          <MDInput
            label="Group Name"
            variant="outlined"
            size="small"
            sx={{ width: "250px" }}
            value={groupName}
            disabled
          />
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </MDBox>
  );
};

// Define PropTypes
UpdatePermissionsTable.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default UpdatePermissionsTable;
