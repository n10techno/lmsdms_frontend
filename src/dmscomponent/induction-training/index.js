import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ESignatureDialog from "layouts/authentication/ESignatureDialog";
import { useCreateGetInductionMutation } from "apilms/InductionApi"; // Adjust the path to your API slice

const AddInductionTraining = () => {
  const [inductionTitle, setInductionTitle] = useState("");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [createInduction, { isLoading }] = useCreateGetInductionMutation();
  const navigate = useNavigate();

  // Validation function
  const validateInputs = () => {
    const newErrors = {};
    if (!inductionTitle.trim()) newErrors.inductionTitle = "Induction Title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setOpenSignatureDialog(true); // Open signature dialog
  };

  const handleClear = () => {
    setInductionTitle("");
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false); // Close signature dialog

    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    try {
      const response = await createInduction({
        induction_name: inductionTitle.trim(),
      }).unwrap();

      if (response.status) {
        toast.success("Induction Training added successfully!");
        setTimeout(() => {
          navigate("/induction-listing"); // Navigate after successful submission
        }, 1500);
      } else {
        toast.error(response.message || "Failed to add Induction Training. Please try again.");
      }
    } catch (error) {
      console.error("Error adding induction training:", error);
      toast.error("An error occurred while adding the Induction Training.");
    }
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
            Add Induction Set Name
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
                label={<><span style={{ color: "red" }}>*</span> Induction Set Name</>}
                fullWidth
                value={inductionTitle}
                onChange={(e) => setInductionTitle(e.target.value)}
                error={!!errors.inductionTitle}
                helperText={errors.inductionTitle}
              />
            </MDBox>
            
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="submit" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* E-Signature Dialog */}
      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
};

export default AddInductionTraining;
