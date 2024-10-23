// Import necessary components
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";

// Example document options (Replace with actual options)
const documents = ["Document 1", "Document 2", "Document 3"];
const statuses = ["Pending", "Approved", "Rejected"];

function PrintDocument() {
  const [document, setDocument] = useState("");
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [requestStatus, setRequestStatus] = useState("Pending");
  const [adminApprovedCopies, setAdminApprovedCopies] = useState(0);

  const user = "Logged In User"; // Example logged-in user, dynamically fetched
  const adminApproval = "Doc_Admin"; // Example admin approval, dynamically fetched
  const requestedAt = new Date().toLocaleDateString(); // Auto-filled date

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Print Document Request Submitted:", {
      user,
      document,
      numberOfCopies,
      requestStatus,
      adminApproval,
      adminApprovedCopies,
      requestedAt,
    });
    // Navigate to a different page if needed
    navigate("/dashboard");
  };

  // Function to clear all input fields
  const handleClear = () => {
    setDocument("");
    setNumberOfCopies(1);
    setRequestStatus("Pending");
    setAdminApprovedCopies(0);
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto",mt:10,mb:10 }}>
        <MDBox
         borderRadius="lg"
         sx={{
          background: "linear-gradient(212deg, #d5b282, #f5e0c3)", // Custom color gradient
          borderRadius: "lg",
          // boxShadow: "0 4px 20px 0 rgba(213, 178, 130, 0.5)", // Custom colored shadow
          mx: 2,
          mt: -3,
          p: 2,
          mb: 1,
          textAlign: "center",
        }}
        >
          <MDTypography variant="h3" fontWeight="medium" color="#344767" mt={1}>
            Print Document
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small" // Set the button size to small
            onClick={handleClear}
            sx={{ marginRight: '20px' }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="User"
                fullWidth
                value={user}
                disabled // This field is auto-filled based on logged-in user
              />
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-document-label">Document</InputLabel>
                <Select
                  labelId="select-document-label"
                  id="select-document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  input={<OutlinedInput label="Document" />}
                  sx={{ minWidth: 200, height: "3rem", // Adjust the height here
                    ".MuiSelect-select": {
                      padding: "0.45rem", // Adjust padding for the select input text
                    }, }}
                >
                  {documents.map((doc) => (
                    <MenuItem key={doc} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Number of Copies"
                fullWidth
                value={numberOfCopies}
                onChange={(e) => setNumberOfCopies(e.target.value)}
                inputProps={{ min: 1 }} // Minimum 1 copy
              />
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-status-label">Request Status</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  value={requestStatus}
                  onChange={(e) => setRequestStatus(e.target.value)}
                  input={<OutlinedInput label="Request Status" />}
                  sx={{ minWidth: 200,
                    height: "3rem", // Adjust the height here
                    ".MuiSelect-select": {
                      padding: "0.45rem", // Adjust padding for the select input text
                    },
                   }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Admin Approval"
                fullWidth
                value={adminApproval}
                disabled // Auto-filled based on Doc_Admin
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="number"
                label="Admin Approved Copies"
                fullWidth
                value={adminApprovedCopies}
                onChange={(e) => setAdminApprovedCopies(e.target.value)}
                inputProps={{ min: 0 }} // Minimum 0 approved copies
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Requested At"
                fullWidth
                value={requestedAt}
                disabled 
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
    </BasicLayout>
  );
}

export default PrintDocument;
