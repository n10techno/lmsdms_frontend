// Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from "@mui/material/Switch"; 
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import bplogo from "assets/images/logo-removebg-preview.png";
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
  Box,
  Alert,
} from "@mui/material";
import { login, groupList } from '../../../api/auth/auth';
import { useAuth } from "hooks/use-auth";

function Login() {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState("");
  const { updateUser, updateRole } = useAuth();

  const handleLogin = async () => {
    if (!userId || !password) {
      setError("Both User ID and Password are required.");
      return;
    }
  
    try {
      const response = await groupList({ username: userId, password });
  
      console.log("---GROUP LIST RESPONSE---", response.data);
  
      if (response && response.data && response.data.status) {
        const rolesList = response.data.data;
  
        if (rolesList && Array.isArray(rolesList)) {
          setRoles(rolesList);
          setDialogOpen(true);
          setError("");
        } else {
          setError("No roles available or invalid response structure.");
        }
      } else {
        setError("Incorrect User ID or Password.");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Group list failed:", error);
      setError("Incorrect User ID or Password.");
      setDialogOpen(false);
    }
  };
  
  const handleOk = async () => {
    if (!selectedRole) return;
  
    // Find the group_id based on the selected role
    const selectedRoleObj = roles.find(role => role.name === selectedRole);
    const group_id = selectedRoleObj ? selectedRoleObj.id : null;
  
    if (!group_id) {
      setError("Role selection is invalid.");
      return;
    }
  
    try {
      const response = await login({
        username: userId,
        password,
        group_id,
      });
  
  
      if (response && response.data && response.data.status === true) {
        const token = response.data.data?.token;
        const userFirstName = response.data.data?.first_name;
  
        if (token && userFirstName) {
          sessionStorage.setItem("token", token);
          updateUser(response.data.data, token);
          updateRole(selectedRole);
          setFirstName(userFirstName);
          setDialogOpen(false);
          setError(""); 
          navigate("/dashboard"); 
        } else {
          setError("Login successful, but missing required information.");
        }
      } else {
        setError("Failed to login. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Failed to login. Please try again.");
    }
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <BasicLayout image={bgImage} showNavbarFooter={false}>
      <Card sx={{ width: 400, mx: "auto" }}>
        <MDBox
          variant="gradient"
          borderRadius="lg"
          coloredShadow="#344767"
          sx={{
            background: "linear-gradient(212deg, #d5b282, #f5e0c3)", 
            borderRadius: "lg",
            boxShadow: "#344767", 
            mx: 2,
            mt: -3,
            p: 2,
            mb: 1,
            textAlign: "center",
          }}
        >
          <MDTypography variant="h3" fontWeight="medium" mt={1}>
            <MDBox
              component="img"
              src={bplogo} 
              alt="Logo"
              sx={{ height: "28px", width: "250px", display: "block", margin: "0 auto" }} 
            />
          </MDTypography>
        </MDBox>
        <MDBox mt={1} display="flex" justifyContent="center" alignItems="center">
          <MDTypography variant="h3" fontWeight="medium" textAlign="center">
            Login
          </MDTypography>
        </MDBox>
        <MDBox pb={3} px={3}>
          <MDBox component="form" role="form" sx={{ padding: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" mb={3}>
              <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <MDTypography variant="button" fontWeight="regular" ml={1}>
                Remember Me
              </MDTypography>
            </MDBox>

            <MDTypography
              variant="button"
              fontWeight="medium"
              textAlign="center"
              sx={{
                color: "#00008B", 
                cursor: "pointer", 
                "&:hover": {
                  textDecoration: "underline", 
                },
              }}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </MDTypography>

            <MDBox mt={4} mb={1} sx={{ backgroundColor: "#F5E0C3" }}>
              <MDButton
                variant="gradient"
                sx={{
                  backgroundColor: "#2F1B14",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#2F1B14", 
                    color: "#fff",
                  },
                }}
                fullWidth
                onClick={handleLogin} 
              >
                Login
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "40vw", 
            height: "45vh", 
            borderRadius: "10px", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
            backgroundColor: "#fff", 
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center" }}>Select Role</DialogTitle>
        <DialogContent sx={{ padding: "16px 24px" }}>
          <Typography variant="body1" sx={{ marginBottom: "8px" }}>
            User Id: {userId}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "24px" }}>
            User Name: {firstName || "N/A"}
          </Typography>

          <FormControl fullWidth margin="dense">
            <InputLabel id="select-role-label" sx={{ height: "2.5rem" }}>
              Select Role
            </InputLabel>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={selectedRole}
              onChange={handleRoleChange}
              input={<OutlinedInput label="Select Role" />}
              sx={{
                height: "3rem", 
                ".MuiSelect-select": {
                  padding: "0.75rem", 
                },
                minWidth: "450px", 
                borderRadius: "10px", 
                backgroundColor: "#fff", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: "#ccc", 
              color: "#fff", 
              fontSize: "15px", 
              borderRadius: "8px", 
              margin: "1px 2.2vw",
              "&:hover": {
                backgroundColor: "black",
              },
            }}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: "#4CAF50", 
              color: "#fff", 
              fontSize: "15px",
              borderRadius: "8px", 
              "&:hover": {
                backgroundColor: "#3E8E41", 
              },
            }}
            onClick={handleOk}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </BasicLayout>
  );
}

export default Login;
