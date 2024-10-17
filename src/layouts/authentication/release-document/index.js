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
const actions = ["Release", "Send Back"];
const versions = ["Effective", "Master Copy", "User"];

function ReleaseDocument() {
  const [document, setDocument] = useState("");
  const [action, setAction] = useState("");
  const [releaseVersion, setReleaseVersion] = useState("");

  const userRole = "Doc_Admin"; // Example role, this can be dynamically fetched from user data
  const releasedAt = new Date().toLocaleDateString(); // Auto-filled date

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Release Document Submitted:", {
      document,
      userRole,
      action,
      releaseVersion,
      releasedAt,
    });
    // Navigate to a different page if needed
    navigate("/dashboard");
  };

  // Function to clear all input fields
  const handleClear = () => {
    setDocument("");
    setAction("");
    setReleaseVersion("");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto" }}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Release Document
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-document-label">Document</InputLabel>
                <Select
                  labelId="select-document-label"
                  id="select-document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  input={<OutlinedInput label="Document" />}
                  sx={{ minWidth: 200 }}
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
                type="text"
                label="Doc Admin"
                fullWidth
                value={userRole}
                disabled // This field is auto-filled based on user role
              />
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-action-label">Action</InputLabel>
                <Select
                  labelId="select-action-label"
                  id="select-action"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  input={<OutlinedInput label="Action" />}
                  sx={{ minWidth: 200 }}
                >
                  {actions.map((act) => (
                    <MenuItem key={act} value={act}>
                      {act}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-version-label">Release Version</InputLabel>
                <Select
                  labelId="select-version-label"
                  id="select-version"
                  value={releaseVersion}
                  onChange={(e) => setReleaseVersion(e.target.value)}
                  input={<OutlinedInput label="Release Version" />}
                  sx={{ minWidth: 200 }}
                >
                  {versions.map((version) => (
                    <MenuItem key={version} value={version}>
                      {version}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Released At"
                fullWidth
                value={releasedAt}
                disabled // This field is auto-filled with the current date
              />
            </MDBox>

            <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClear}
                sx={{ alignSelf: 'flex-end' }}
              >
                Clear
              </MDButton>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ReleaseDocument;
