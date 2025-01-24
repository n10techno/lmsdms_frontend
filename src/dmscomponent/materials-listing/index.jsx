  import React, { useEffect, useRef, useState } from 'react'
  import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
  import Divider from '@mui/material/Divider';
  import Card from "@mui/material/Card";
  import MDButton from "components/MDButton";
  import MDTypography from 'components/MDTypography'; 
  import AddSectionModal from './AddSectionModal';
  import AddMaterialModal from './AddMaterialModal';
  import CollapsibleTable from './collapsableContent.jsx';
  import { useAuth } from "hooks/use-auth";
  import { data } from './constant';
  import axios from 'axios';
  import { useLocation } from 'react-router-dom';
import apiService from 'services/apiService';

  function MaterialListing() {
      const [open, setOpen] = useState(false);
      // const [materialType, setMaterialType] = useState("");
      // const materialNameRef = useRef(null);
      // const minReadingTimeRef = useRef(null);
      // const fileRef = useRef(null);
      const sectionNameRef = useRef(null);
      const descriptionRef = useRef(null);
      const [status, setStatus] = useState("");
      const [openSectionModal, setOpenSectionModal] = useState(false);
      const [sectionData,setSectionData] = useState([]);
      const { user, role } = useAuth();
      const location = useLocation();
      const [trainingTitle, setTrainingTitle] = useState("");
      const [trainingIdState, setTrainingIdState] = useState(1)


  useEffect(() => {
    // Extract training_id from the current path
    const pathParts = location.pathname.split('/');
    const trainingId = pathParts[pathParts.length - 1]; // The last part is the training_id
    setTrainingIdState(trainingId)
    // Fetch training section data using the extracted training_id
    const fetchTrainingSection = async (trainingId) => {
        try {
            const response = await apiService.get(`/lms_module/create_training_section`, {
                params: {
                    training_id: trainingId,
                },
            });
            console.log('Training Section Data:', response?.data);
            setSectionData(response?.data);
            const trainingTitle = response?.data?.training_title;
            setTrainingTitle(trainingTitle || "Default Training Title");
        } catch (error) {
            console.error('Error fetching training section:', error);
        }
    };

    if (trainingId) {
        fetchTrainingSection(trainingId); // Make the GET request with training_id
    }
}, [location.pathname]);

      const handleFileChange = (e) => {
        setUploadedFile(e?.target?.files[0]);
      };

        const handleClickOpen = () => {
          setOpen(true);
        };
        const handleClose = () => {
          setOpen(false);
        };

        const handleOpenSectionModal = () => {
          setOpenSectionModal(true);
        };
        
        const handleCloseSectionModal = () => {
          setOpenSectionModal(false);
        };

      // const handleAddMaterial=async (event)=>{
      //     event.preventDefault();
      //     let hasError = false;
      //     let errorMessage = "";
      //     console.log("okokko")
      //     // Validations
      //     if (!materialNameRef.current.value) {
      //       hasError = true;
      //       errorMessage = "Material Name is required";
      //     }
        
      //     if (!minReadingTimeRef.current.value) {
      //       hasError = true;
      //       errorMessage = "Min Reading Time is required";
      //     }
        
      //     if (!materialType) {
      //       hasError = true;
      //       errorMessage = "Material Type is required";
      //     }
        
      //     if (fileRef.current.files.length === 0) {
      //       hasError = true;
      //       errorMessage = "Please select a file";
      //     }
        
      //     if (hasError) {
      //       return;
      //     }
        
      //     // Preparing FormData for the POST request
      //     const formData = new FormData();
      //     formData.append("material_name", materialNameRef.current.value);
      //     formData.append("min_reading_time", minReadingTimeRef.current.value);
      //     formData.append("material_type", materialType);
      //     formData.append("file", fileRef.current.files[0]); // File object
        
      //     try {
      //       const response =await apiService.post(
      //         "/lms_module/create_training_material",
      //         formData,
      //         {
      //           headers: {
      //             "Authorization": `Bearer ${user.token}`,
      //             "Content-Type": "multipart/form-data",
      //           },
      //         }
      //       );
        
      //       if (response?.data?.status) {
      //         console.log("Material added successfully:", response.data);
        
      //         materialNameRef.current.value = "";
      //         minReadingTimeRef.current.value = "";
      //         fileRef.current.value = null;
      //         setMaterialType("");
      //         handleClose();
      //       } else {
      //         throw new Error(response?.data?.message || "Failed to add material");
      //       }
      //     } catch (error) {
      //       console.error("Error adding material:", error);
      //     }
      //   };
   

        const handleAddSection = async () => {
          // Create a FormData object
          const formData = new FormData();
          formData.append("training_id", trainingIdState); // Make sure trainingId is extracted correctly
          formData.append("section_name", sectionNameRef.current.value);
          formData.append("section_description", descriptionRef.current.value);
          formData.append("section_order", "1.0"); // Adjust dynamically if needed
          console.log(formData)
          try {
              const response = await apiService.post(
                  "/lms_module/create_training_section",
                  formData,
                  {
                      headers: {
                          "Content-Type": "multipart/form-data", // Override default JSON header for FormData
                      },
                  }
              );
              
              if (response?.data?.status) {
                const fetchTrainingSection = async () => {
                  try {
                    const response = await apiService.get(`/lms_module/create_training_section`, {
                      params: {
                        training_id: trainingIdState,
                      },
                    });
                    setSectionData(response?.data);
                  } catch (error) {
                    console.error('Error refetching training section:', error);
                  }
                };
          
                fetchTrainingSection();
          
                sectionNameRef.current.value = "";
                descriptionRef.current.value = "";
          
                // Close the modal
                handleCloseSectionModal();
              } else {
                  console.error("Failed to add section:", response?.data?.message);
              }
          } catch (error) {
              console.error("Error adding section:", error);
          }
      };
      
    return (
      <div>
        <Card sx={{ maxWidth: "80%", mx: "auto", mt: 3, marginLeft: "auto", marginRight: 4 }}>
          <Box sx={{
                      borderRadius: '4px',
                      padding: 2,
          }}>
              <MDTypography variant="h4" fontWeight="medium" sx={{ flexGrow: 1, textAlign: "center" }}>
                  Manage Sections
              </MDTypography>
              <Divider sx={{ marginBottom: 2 }} />
              <Grid container spacing={1} sx={{
                  mr:2,
                  ml:2
              }}>
                  <Grid item xs={2}>
                      <MDTypography variant="h5" color="textSecondary">
                          Training No.:
                      </MDTypography>
                      <Typography variant="h5">--</Typography>
                  </Grid>
                  <Grid item xs={2}>
                      <MDTypography variant="h5" color="textSecondary">
                          Version:
                      </MDTypography>
                      <Typography variant="h5">--</Typography>
                  </Grid>
                  <Grid item xs={3}>
                      <MDTypography variant="h5" color="textSecondary">
                      Reading Time:
                      </MDTypography>
                      <Typography variant="h5">--</Typography>
                  {/*  */}
                  </Grid>
                  <Grid item xs={4}>
                      {/*  */}
                      <MDTypography variant="h5" color="textSecondary">
                      Training Title:                    
                      </MDTypography>
                      <Typography variant="h6">
                      {trainingTitle}
                      </Typography>
                  </Grid>
              </Grid>
          </Box>
        <hr
            style={{
              width: '95%',
              margin: '20px auto',
              border: 'none',
              borderTop: '2px solid rgb(231, 179, 197)',
            }}
          />
          <Box
          sx={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              px:4,
              py:2
          }}
          >
              <Typography variant="h6" fontWeight="medium">
                  Section & Material List
              </Typography>   
              <div>
              <Box sx={{ display: "flex", gap: 1 }}>
                  <MDButton variant="contained" color="primary" onClick={handleOpenSectionModal} sx={{ ml: 1 }}>
                      + Add Section
                  </MDButton>
                  <MDButton variant="contained" color="secondary" onClick={()=>{}} sx={{ ml: 1 }}>
                      Publish
                  </MDButton>
              </Box>
              </div>
          </Box>
        <CollapsibleTable open={open} setOpen={setOpen} data={sectionData?.data}/>
        </Card>
            {/* <AddMaterialModal 
            open={open}
            setOpen={setOpen}
            handleClose={handleClose}
            materialNameRef={materialNameRef}
            minReadingTimeRef={minReadingTimeRef}
            fileRef={fileRef}
            materialType={materialType}
            setMaterialType={setMaterialType}
            handleSubmit={handleAddMaterial}
            /> */}
            <AddSectionModal
            open={openSectionModal}
            handleClose={handleCloseSectionModal}
            sectionNameRef={sectionNameRef}
            descriptionRef={descriptionRef}
            status={status}
            setStatus={setStatus}
            // handleSubmit={() => {
            //   console.log("Section Name:", sectionNameRef.current.value);
            //   console.log("Description:", descriptionRef.current.value);
            //   console.log("Status:", status);
            //   handleCloseSectionModal();
            // }}
            handleSubmit={handleAddSection}
          />
      </div>
    )
  }

  export default MaterialListing