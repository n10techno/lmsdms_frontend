// AddArea.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog"; // Ensure correct import

function AddArea() {
  const [areaName, setAreaName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpenSignatureDialog(true); // Open dialog on form submission
    console.log("Area Details Submitted:", { areaName, departmentName, description });
  };

  const handleClear = () => {
    setAreaName("");
    setDepartmentName("");
    setDescription("");
  };

  const handleCloseSignatureDialog = () => {
    setOpenSignatureDialog(false); // Close the dialog
    navigate("/dashboard"); // Navigate after closing
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          borderRadius="lg"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)",
            borderRadius: "lg",
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Add Area
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginLeft: "10px", marginRight: "10px" }}
          >
            Clear
          </MDButton>
        </MDBox>

        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Area Name"
                fullWidth
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                select
                label="Department Name"
                fullWidth
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              >
                {/* Replace with actual department options */}
                <MenuItem value="Department 1">Department 1</MenuItem>
                <MenuItem value="Department 2">Department 2</MenuItem>
                <MenuItem value="Department 3">Department 3</MenuItem>
              </MDInput>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        handleClose={handleCloseSignatureDialog}
      />
    </BasicLayout>
  );
}

export default AddArea;
