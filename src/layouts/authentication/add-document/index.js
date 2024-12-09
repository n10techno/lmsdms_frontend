import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import {
  useCreateDocumentMutation,
  useFetchDocumentTypesQuery,
  useViewTemplateQuery,
  useDepartmentWiseReviewerQuery,
} from "api/auth/documentApi";
import { useFetchWorkflowsQuery } from "api/auth/workflowApi";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [trainingRequired, setTrainingRequired] = useState("No");
  const [template, setTemplate] = useState("");
  const [operations, setOperations] = useState("Create online");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [createDocument] = useCreateDocumentMutation();
  const navigate = useNavigate();

  const { data: documentTypesData } = useFetchDocumentTypesQuery();
  const { data: templateData } = useViewTemplateQuery();
  const {
    data: workflowsData,
    isLoading: workflowsLoading,
    error: workflowsError,
  } = useFetchWorkflowsQuery();

  const {
    data : userdata
  }=useDepartmentWiseReviewerQuery();
  
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Michael Brown" },
  ];

  const validateInputs = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!type || (typeof type === "string" && type.trim() === "")) {
      newErrors.type = "Type is required.";
    }
    if (!documentNumber.trim()) newErrors.documentNumber = "Document number is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!revisionTime.trim() || isNaN(revisionTime) || parseInt(revisionTime, 10) <= 0) {
      newErrors.revisionTime = "Valid revision time is required.";
    }
    if (!workflow || (typeof workflow === "string" && workflow.trim() === "")) {
      newErrors.workflow = "Workflow is required.";
    }
    if (!template || (typeof template === "string" && template.trim() === "")) {
      newErrors.template = "Template is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setOpenSignatureDialog(true);
  };
  const handleChange = (e) => {
    setSelectedUser(e.target.value);
    setErrors({ ...errors, user: "" }); // Clear error if any
  };

  const handleClear = () => {
    setTitle("");
    setType("");
    setDocumentNumber("");
    setDescription("");
    setRevisionTime("");
    setWorkflow("");
    setTemplate("");
    setTrainingRequired("No");
    setOperations("Create online");
    setErrors({});
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);
    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    try {
      const documentData = {
        document_title: title.trim(),
        document_number: documentNumber.trim(),
        document_type: type,
        document_description: description.trim(),
        revision_time: revisionTime.trim(),
        workflow,
        document_operation: operations,
        select_template: template,
        training_required: trainingRequired.toLowerCase() === "yes",
        document_current_status_id: "1",
      };

      const response = await createDocument(documentData).unwrap();
      toast.success("Document added successfully!");
      console.log("API Response:", response);
      setTimeout(() => {
        navigate("/document-listing");
      }, 1500);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to add document. Please try again.");
    }
  };
  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 600, mx: "auto", marginTop: 10, marginBottom: 10 }}>
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
            Add Document
          </MDTypography>
        </MDBox>
        <MDBox mt={2} mb={1} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClear}
            sx={{ marginRight: "20px" }}
          >
            Clear
          </MDButton>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit} sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={Boolean(errors.title)}
                helperText={errors.title}
                fullWidth
              />
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-type-label">Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  input={<OutlinedInput label="Type" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  {documentTypesData?.map((docType) => (
                    <MenuItem key={docType.id} value={docType.id}>
                      {docType.document_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.type}
                  </p>
                )}
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Document Number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                error={Boolean(errors.documentNumber)}
                helperText={errors.documentNumber}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3}>
              <MDInput
                type="text"
                label="Revision Time"
                value={revisionTime}
                onChange={(e) => setRevisionTime(e.target.value)}
                error={Boolean(errors.revisionTime)}
                helperText={errors.revisionTime}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3} display="flex" alignItems="center">
              <FormLabel
                component="legend"
                style={{ fontSize: "0.875rem", color: "black", marginRight: "16px" }}
              >
                Operations
              </FormLabel>
              <RadioGroup row value={operations} onChange={(e) => setOperations(e.target.value)}>
                <FormControlLabel value="Create online" control={<Radio />} label="Create online" />
                <FormControlLabel
                  value="Upload files"
                  control={<Radio />}
                  label="Upload files"
                  disabled
                />
              </RadioGroup>
            </MDBox>

            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-workflow-label">Workflow</InputLabel>
                <Select
                  labelId="select-workflow-label"
                  id="select-workflow"
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value)}
                  input={<OutlinedInput label="Workflow" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  {workflowsLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : workflowsError ? (
                    <MenuItem disabled>Error loading workflows</MenuItem>
                  ) : (
                    workflowsData?.map((flow) => (
                      <MenuItem key={flow.id} value={flow.id}>
                        {flow.workflow_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.workflow && (
                  <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.workflow}
                  </p>
                )}
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-template-label">Select Template</InputLabel>
                <Select
                  labelId="select-template-label"
                  id="select-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  input={<OutlinedInput label="Select Template" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  {templateData?.map((templateItem) => (
                    <MenuItem key={templateItem.id} value={templateItem.id}>
                      {templateItem.template_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.template && (
                  <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.template}
                  </p>
                )}
              </FormControl>
            </MDBox>
            <MDBox mb={3}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="select-user-label">Select User</InputLabel>
                <Select
                  labelId="select-user-label"
                  id="select-user"
                  value={selectedUser}
                  onChange={handleChange}
                  input={<OutlinedInput label="Select User" />}
                  sx={{
                    minWidth: 200,
                    height: "3rem",
                    ".MuiSelect-select": { padding: "0.45rem" },
                  }}
                >
                  {users.map((userdata) => (
                    <MenuItem key={userdata.id} value={userdata.id}>
                      {userdata.first_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.user && (
                  <p style={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}>
                    {errors.user}
                  </p>
                )}
              </FormControl>
            </MDBox>
            <MDBox mb={3} display="flex" alignItems="center">
              <FormLabel
                component="legend"
                style={{ fontSize: "0.875rem", color: "black", marginRight: "16px" }}
              >
                Training Required
              </FormLabel>
              <RadioGroup
                row
                value={trainingRequired}
                onChange={(e) => setTrainingRequired(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </MDBox>

            <MDBox mt={4}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit">
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* E-Signature Dialog */}
        <ESignatureDialog
          open={openSignatureDialog}
          onClose={() => setOpenSignatureDialog(false)}
          onConfirm={handleSignatureComplete}
        />

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Card>
    </BasicLayout>
  );
}

export default AddDocument;
