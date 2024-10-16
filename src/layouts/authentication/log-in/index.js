// Import necessary components
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon
import Switch from "@mui/material/Switch"; // Import Switch for Remember Me
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
} from "@mui/material";

const roles = ["Author", "Reviewer", "Approver", "Admin", "Doc Admin"];

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Add state for Remember Me switch
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLogin = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleOk = () => {
    console.log("Selected Role:", selectedRole);
    setDialogOpen(false);
    navigate("/dashboard"); // Navigate to the dashboard on submit
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 400, mx: "auto" }}>
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
            Login
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" sx={{ padding: 3 }}>
            <MDBox mb={3}>
              <MDInput
                type="text"
                label="User ID"
                fullWidth
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </MDBox>
            <MDBox mb={3}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            {/* Remember Me Switch */}
            <MDBox display="flex" alignItems="center" mb={3}>
              <Switch
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <MDTypography variant="button" fontWeight="regular" ml={1}>
                Remember Me
              </MDTypography>
            </MDBox>

            {/* Forgot Password Link */}
            <Link to="/forgot-password" style={{ textDecoration: "none" }}>
              <MDTypography variant="button" color="info" fontWeight="medium" textAlign="center">
                Forgot Password?
              </MDTypography>
            </Link>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                Login
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* Role Selection Popup */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            minWidth: "600px", // Adjust width for a larger dialog
            maxWidth: "700px",
            borderRadius: "20px", // Smooth rounded corners
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)", // Classy shadow
            backgroundColor: "#fafafa", // Light background for a classy feel
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#4a4a4a", // Darker gray color for the title
            color: "#ffffff", // White text for better contrast
            padding: "16px 24px",
            fontSize: "1.5rem", // Larger font size for a stylish look
            display: "flex", // Align close button to the right
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Select Role
          <IconButton onClick={handleCloseDialog} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            User Id: {userId}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "24px" }}>
            User Name: Vasu Patel
          </Typography>

          <FormControl fullWidth margin="dense">
            <InputLabel id="select-role-label">Select Role</InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              onChange={handleRoleChange}
              input={<OutlinedInput label="Select Role" />}
              sx={{
                minWidth: "450px", // Increased width for the select box
                padding: "12px", // Added padding for the input
                borderRadius: "10px", // Rounded corners
                backgroundColor: "#fff", // White background for clean look
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for input
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 24px",
          }}
        >
          <Button
            onClick={handleOk}
            variant="contained"
            sx={{
              backgroundColor: "#6d4c41", // Earthy color for the button
              color: "#fff",
              "&:hover": { backgroundColor: "#5d4037" }, // Darker shade on hover
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </BasicLayout>
  );
}

export default Login;
