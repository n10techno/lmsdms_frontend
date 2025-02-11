import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useUserListQuery } from "api/auth/userApi";
import { useFetchPermissionsByGroupIdQuery } from "api/auth/permissionApi";
import { useAuth } from "hooks/use-auth";
import { hasPermission } from "utils/hasPermission";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignDepartmentDialog from "./assign-dep";
import AssignmentIcon from "@mui/icons-material/Assignment";
import JobDescriptionDialog from "./job- description";
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskDescriptionDialog from "./approve-description";

const UsersListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, error, isLoading } = useUserListQuery();
  const [selectedUser, setSelectedUser] = useState(null);
  const group = user?.user_permissions?.group || {};
  const groupId = group.id;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isJDDialogOpen, setIsJDDialogOpen] = useState(false);
  const [selectedUserIdForJD, setSelectedUserIdForJD] = useState(null);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState("");  
  const [isTaskDescriptionDialogOpen, setIsTaskDescriptionDialogOpen] = useState(false);
  const { data: userPermissions = [], isError: permissionError } =
    useFetchPermissionsByGroupIdQuery(groupId?.toString(), {
      skip: !groupId, // Ensure it skips if groupId is missing
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  const formattedData = Array.isArray(data?.data)
    ? data.data.map((item, index) => ({
        id: item.id,
        serial_number: index + 1,
        full_name: item.first_name ? `${item.first_name} ${item.last_name || ""}`.trim() : "N/A",
        email: item.email || "N/A",
        username: item.username || "N/A",
        created_at: new Date(item.created_at).toLocaleDateString(),
        UserRole: item.groups_list?.map((group) => group.name).join(", ") || "N/A", // Join role names into a single string
      }))
    : [];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate("/add-user");
  };
  const handleAssignDepartmentClick = (user) => {
    setSelectedUser(user); // Set selected user for the dialog
    setIsDialogOpen(true); // Open the dialog
  };

  const handleAssignJDClick = (user) => {
    setSelectedUserIdForJD(user.id); // Set selected user for JD assignment
    setIsJDDialogOpen(true); // Open the JD dialog
  };

  const handleTaskDescriptionClick = (user) => {
    setIsTaskDescriptionDialogOpen(true);
    setSelectedUserIdForJD(user.id); // Set selected user for JD assignment
    setSelectedTaskDescription(user.task_description || "");
  };
  const handleSaveJobDescription = (userId, jobDescription) => {
    console.log("Job Description for User:", userId, "Job Description:", jobDescription);
    // You can call an API or update state here for the job description
  };
  const handleSaveTaskDescription = (userId, taskDescription, status) => {
    console.log("User ID:", userId, "Task Description:", taskDescription, "Status:", status);
    // Call API or update state based on the action taken (Approve/Send Back)
  };
  const filteredData = formattedData.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Conditionally render columns based on the groupId
  const columns = [
    { field: "serial_number", headerName: "Sr. No.", flex: 0.5, headerAlign: "center" },
    { field: "full_name", headerName: "Full Name", flex: 1, headerAlign: "center" },
    { field: "email", headerName: "Email", flex: 1, headerAlign: "center" },
    { field: "username", headerName: "Username", flex: 0.75, headerAlign: "center" },
    { field: "UserRole", headerName: "Role", flex: 1, headerAlign: "center" },
    { field: "created_at", headerName: "Date", flex: 0.75, headerAlign: "center" },
    ...(groupId === 7
      ? [
          {
            field: "action",
            headerName: "Assign",
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) =>
              hasPermission(userPermissions, "customuser", "isChange") ? (
                <IconButton color="success" onClick={() => handleAssignDepartmentClick(params.row)}
                disabled={params.row.is_description}>
                  <AssignmentIndIcon />
                </IconButton>
              ) : null,
          },
        ]
      : []),
    ...(groupId === 7
      ? [
          {
            field: "action 2",
            headerName: "JD Assign",
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) =>
              hasPermission(userPermissions, "customuser", "isChange") ? (
                <IconButton color="warning" onClick={() => handleAssignJDClick(params.row)}>
                  <AssignmentIcon />
                </IconButton>
              ) : null,
          },
        ]
      : []),
    ...(groupId === 6
      ? [
          {
            field: "action 3",
            headerName: "JD Approve",
            flex: 0.5,
            headerAlign: "center",
            renderCell: (params) =>
              hasPermission(userPermissions, "customuser", "isChange") ? (
                <IconButton color="inherit" onClick={() => handleTaskDescriptionClick(params.row)}>
                  <AddTaskIcon />
                </IconButton>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <MDBox p={3}>
      <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 0 }}>
        <MDBox p={3} display="flex" alignItems="center">
          <MDInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "250px", mr: 2 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
            Users Listing
          </MDTypography>
          {hasPermission(userPermissions, "customuser", "isAdd") && (
            <MDButton variant="contained" color="primary" onClick={handleAddUser} sx={{ ml: 2 }}>
              Add User
            </MDButton>
          )}
        </MDBox>
        <MDBox display="flex" justifyContent="center" p={2}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                "& .MuiDataGrid-columnHeaders": {
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                },
              }}
            />
          </div>
        </MDBox>
      </Card>
      {selectedUser && (
        <AssignDepartmentDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullName={selectedUser.full_name}
          selectedUserid={selectedUser.id}
        />
      )}
      <JobDescriptionDialog
        open={isJDDialogOpen}
        onClose={() => setIsJDDialogOpen(false)}
        onSave={handleSaveJobDescription}
        userId={selectedUserIdForJD}
      />
      <TaskDescriptionDialog
        open={isTaskDescriptionDialogOpen}
        onClose={() => setIsTaskDescriptionDialogOpen(false)}
        description={selectedTaskDescription}
        onSave={handleSaveTaskDescription}
        userId={selectedUserIdForJD}
      />
    </MDBox>
  );
};

export default UsersListing;
