import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useUpdateDeleteInductionMutation } from "apilms/inductionApi"; // Adjust import for your mutation

const EditInduction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [inductionTitle, setInductionTitle] = useState(state?.induction?.induction_name || "");
  const [openSignatureDialog, setOpenSignatureDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const [updateInduction, { isLoading }] = useUpdateDeleteInductionMutation();

  const validateInputs = () => {
    const newErrors = {};
    if (!inductionTitle.trim()) newErrors.inductionTitle = "Induction Title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    setOpenSignatureDialog(true);
  };

  const handleClear = () => {
    setInductionTitle("");
    setErrors({});
  };

  const handleSignatureComplete = async (password) => {
    setOpenSignatureDialog(false);

    if (!password) {
      toast.error("E-Signature is required to proceed.");
      return;
    }

    try {
      const response = await updateInduction({
        induction_id: state?.induction?.id,
        induction_name: inductionTitle.trim(),
      }).unwrap();

      if (response.status) {
        toast.success("Induction updated successfully!");
        setTimeout(() => {
          navigate("/induction-listing");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to update induction. Please try again.");
      }
    } catch (error) {
      console.error("Error updating induction:", error);
      toast.error("An error occurred while updating the induction.");
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
            Edit Induction Set
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
                {isLoading ? "Updating..." : "Save Changes"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <ESignatureDialog
        open={openSignatureDialog}
        onClose={() => setOpenSignatureDialog(false)}
        onConfirm={handleSignatureComplete}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </BasicLayout>
  );
};

export default EditInduction;
