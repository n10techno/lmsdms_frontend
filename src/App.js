import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Brandlogo from "assets/images/bp-logo.png";
import Login from "./layouts/authentication/log-in/index.js";
import DocumentView from "layouts/authentication/text- editor/index.js";
import AddUser from "layouts/authentication/add-user";
import AddDepartment from "layouts/authentication/add-department";
import AddDocument from "layouts/authentication/add-document";
import ResetPassword from "layouts/authentication/forgot-password/index.js";
import ESignatureDialog from "layouts/authentication/ESignatureDialog/index.js";
import ReviewDocument from "layouts/authentication/Review";
import ReleaseDocument from "layouts/authentication/release-document";
import PrintDocument from "layouts/authentication/print-document";
import Watermark from "layouts/authentication/watermark";
import RolesPermissionsPopup from "layouts/authentication/roles-permission";
import InventoryListing from "layouts/authentication/inventory-handle";
import UpdatePassword from "layouts/authentication/update-password";
import AddWorkflow from "layouts/authentication/add-workflow/index.js";
import UsersListing from "layouts/authentication/user-listing/index.js";
import DocumentListing from "layouts/authentication/document-listing/index.js";
import WorkflowListing from "layouts/authentication/workflow-listing/index.js";
import StatusListing from "layouts/authentication/status-handle/index.js";
import DocumentTypesListing from "layouts/authentication/document-typelisting/index.js";
import AddDocumentType from "layouts/add-documenttype/index.js";
import UpdateWorkflow from "layouts/authentication/add-workflow/updateworkflow.js";
import TemplateListing from "layouts/authentication/template-listing/index.js";
import AddTemplate from "layouts/authentication/add-template/index.js";
import DepartmentListing from "layouts/authentication/department-listing/index.js";
import UpdateDepartment from "layouts/authentication/add-department/updatedepartment.js";
import RolesPermissionsListing from "layouts/authentication/roles-listing/index.js";
import PermissionsTable from "layouts/authentication/add-permissions/index.js";
import EditDocument from "layouts/authentication/edit-document/index.js";
import PrintApprovalListing from "layouts/authentication/approval-lisitng/index.js";
import UpdatePermissionsTable from "layouts/authentication/add-permissions/update-permissions.js";
import DocumentViewer from "layouts/authentication/doc-example/index.js";
import UpdateTemplate from "layouts/authentication/add-template/updatetemplate.js";
import EditDocumentType from "layouts/edit-documenttype/index.js";
import PrinterListing from "layouts/authentication/printer-listing/index.js";
import AddPrinter from "layouts/authentication/add-printer/index.js";
import EditPrinter from "layouts/authentication/edit-printer/index.js";
import ResettPassword from "layouts/authentication/reset-passwordlog/index.js";
import ReviseApprovalList from "layouts/authentication/revise-Listing/index.js";
import PrintRetrievalListing from "layouts/retrieval-listing/index.js";
import ApprovedDocument from "layouts/authentication/document-listing/approve-document/index.js";
import RejectedDocument from "layouts/authentication/document-listing/rejected-document/index.js";
import SavedraftDocument from "layouts/authentication/document-listing/saved-draft-document/index.js";
import UnderReviewDocument from "layouts/authentication/document-listing/under-review-document/index.js";
import PDFPreview from "layouts/authentication/document-listing/pdf-preview/index.js";
import ArchivedListing from "layouts/authentication/archived-listing/index.js";
//Lms components
import AddArea from "dmscomponent/add-area/index.js";
import AddDepartments from "dmscomponent/add-departments/index.js";
import AddPlant from "dmscomponent/add-plant/index.js";
import AddJobRole from "dmscomponent/job-listing/add-jobrole/index.js";
import AddTrainingType from "dmscomponent/trainingType-Listing/addTraining-type/index.js";
import AddInductionTraining from "dmscomponent/induction-training/index.js";
import AddTraining from "dmscomponent/Training-listing/add-training/index.js";
import AddMaterial from "dmscomponent/add-material/index.js";
import AddQuestion from "dmscomponent/question-listing/add-questions/index.js";
import CreateQuiz from "dmscomponent/add-quiz/index.js";
import QuizListing from "dmscomponent/add-quiz/list.js";
import TrainingMapping from "dmscomponent/training-mappping/index.js";
import ClassroomTraining from "dmscomponent/classroom-training/index.js";
import TrainingMatrix from "dmscomponent/training-matrix/index.js";
import TrainingProgressReport from "dmscomponent/training-progressreport/index.js";
import ExamResultsReport from "dmscomponent/exam-result/index.js";
import PlantListing from "dmscomponent/plant-listing/index.js";
import EditPlant from "dmscomponent/plant-listing/edit-plant/index.js";
import AreaListing from "dmscomponent/area-listing/index.js";
import EditArea from "dmscomponent/area-listing/edit-area/index.js";
import MethodologyListing from "dmscomponent/methodology-listing/index.js";
import EditMethodology from "dmscomponent/methodology-listing/edit-methodology/index.js";
import AddMethodology from "dmscomponent/methodology-listing/add-methodology/index.js";
import TrainingTypeListing from "dmscomponent/trainingType-Listing/index.js";
import InductionListing from "dmscomponent/induction-training/induction-listing/index.js";
import AddInductionDesignation from 'dmscomponent/induction-designation/index.js';
import DocView from "layouts/authentication/document-listing/doc-view/index.js";
import EditTrainingType from "dmscomponent/trainingType-Listing/editTraining-Type/index.js";
import TrainingListing from "dmscomponent/Training-listing/index.js";
import EditTraining from "dmscomponent/Training-listing/edit-training/index.js";
import LMSDocument from "dmscomponent/Training-listing/document-view/index.js";
import QuestionListing from "dmscomponent/question-listing/index.js";
import EditQuestion from "dmscomponent/question-listing/edit-question/index.js";
import JobroleListing from "dmscomponent/job-listing/index.js";
import EditJobRole from "dmscomponent/job-listing/edit-jobrole/index.js";
import JobRoleMapping from "dmscomponent/jobrole-mapping/index.js";
import ExamModule from "dmscomponent/exam-module/index.js";
import MultiChoiceQuesionsSection from "dmscomponent/mcq-module/index.js";
import MaterialListing from "dmscomponent/materials-listing/index.jsx";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const isTextEditor = pathname === "/document-view";

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Set background image conditionally
  useEffect(() => {
    if (!isTextEditor) {
      document.body.style.backgroundImage = "url('/dmsbg.png')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "none"; // Remove background image
    }
  }, [pathname, !isTextEditor]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <div>
          {layout === "dashboard" && !isTextEditor && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? Brandlogo : Brandlogo}
                brandName="Material"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                style={{ position: "fixed", zIndex: 2 }}
              />
              <Configurator />
              {/* {configsButton} */}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            
          </Routes>
        </div>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
  <CssBaseline />
  <div>
    {/* Always render Sidenav */}
    {window.location.pathname !== "/login" && !/^\/document-view\/\d+$/.test(pathname) && window.location.pathname !== "/forgotpassword" && (
      <Sidenav
        color={sidenavColor}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? Brandlogo : Brandlogo}
        brandName="Bharat parenterals"
        routes={routes}
        // onMouseEnter={handleOnMouseEnter}
        // onMouseLeave={handleOnMouseLeave}
        style={{ position: "fixed", zIndex: 3 }}
      />
    )}
    
    <Configurator />
    {/* Layout-based conditional rendering */}
    {layout === "vr" && <Configurator />}

    <Routes>
      {getRoutes(routes)}
      <Route path="/login" element={<Login />} />
      <Route path="/document-view/:id" element={<DocumentView />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/add-document" element={<AddDocument />} />
      <Route path="/edit-document" element={<EditDocument />} />
      <Route path="/add-department" element={<AddDepartment />} />
      <Route path="/forgotpassword" element={<ResetPassword />} />
      <Route path="/e-sign" element={<ESignatureDialog />} />
      <Route path="/print-document/:id" element={<PrintDocument />} />
      <Route path="/release-document" element={<ReleaseDocument />} />
      <Route path="/Review" element={<ReviewDocument />} />
      <Route path="/watermark" element={<Watermark />} />
      <Route path="/roles-permission" element={<RolesPermissionsPopup />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/add-workflow" element={<AddWorkflow />} />
      <Route path="/user-listing" element={<UsersListing />} />
      <Route path="/document-listing" element={<DocumentListing />} />
      <Route path="/workflow-listing" element={<WorkflowListing />} />
      <Route path="/status-list" element={<StatusListing />} />
      <Route path="/document-typelisting" element={<DocumentTypesListing />} />
      <Route path="/add-documenttype" element={<AddDocumentType />} />
      <Route path="/update-workflow" element={<UpdateWorkflow />} />
      <Route path="/template-listing" element={<TemplateListing />} />
      <Route path="/add-template" element={<AddTemplate />} />
      <Route path="/inventory-list" element={<InventoryListing />} />
      <Route path="/roles-listing" element={<RolesPermissionsListing />} />
      <Route path="/department-listing" element={<DepartmentListing />} />
      <Route path="/update-department" element={<UpdateDepartment />} />
      <Route path="/add-permissions" element={<PermissionsTable />} />
      <Route path="/approval-listing" element={<PrintApprovalListing />} />
      <Route path="/update-permissions" element={<UpdatePermissionsTable/>} />
      <Route path="/update-template" element={<UpdateTemplate/>} />
      <Route path="/doc-example" element={<DocumentViewer />} /> 
      <Route path="/edit-documenttype" element={<EditDocumentType />} /> 
      <Route path="/printer-listing" element={<PrinterListing />} /> 
      <Route path="/add-printer" element={<AddPrinter />} /> 
      <Route path="/update-printer" element={<EditPrinter />} />
      <Route path="/resett-password" element={<ResettPassword />} />
      <Route path="/revise-listing" element={<ReviseApprovalList/>}/>
      <Route path="/retrieval-listing" element={<PrintRetrievalListing/>}/>
      <Route path="/PreView" element={<DocView/>}/>
      <Route path="/approve-document" element={<ApprovedDocument/>}/>
      <Route path="/reject-document" element={<RejectedDocument/>}/>
      <Route path="/draft-document" element={<SavedraftDocument/>}/>
      <Route path="/review-document" element={<UnderReviewDocument/>}/>
      <Route path="/PDFPreview" element={<PDFPreview/>}/>
      <Route path="/archived-listing" element={<ArchivedListing/>}/>
      {/* Lms components */}
      <Route path="/add-area" element={<AddArea />} />
      <Route path="/add-departments" element={<AddDepartments />} />
      <Route path="/add-plant" element={<AddPlant />} />
      <Route path="/add-jobrole" element={<AddJobRole />} />
      <Route path="/training-type" element={<AddTrainingType />} />
      <Route path="/induction-training" element={<AddInductionTraining />} />
      <Route path="/add-training" element={<AddTraining />} />
      <Route path="/add-material" element={<AddMaterial />} />
      <Route path="/add-question" element={<AddQuestion />} />
      <Route path="/add-quiz" element={<CreateQuiz />} />
      <Route path="/quiz-list" element={<QuizListing />} />
      <Route path="/classroom-training" element={<ClassroomTraining />} />
      <Route path="/training-matrix" element={<TrainingMatrix />} />
      <Route path="/exam-result" element={<ExamResultsReport />} />
      <Route path="/training-progressreport" element={<TrainingProgressReport />} />
      <Route path="/plant-listing " element={<PlantListing />} />
      <Route path="/edit-plant" element={<EditPlant />} />
      <Route path="/area-listing" element={<AreaListing />} />
      <Route path="/edit-area" element={<EditArea />} />
      <Route path="/methodology-listing" element={<MethodologyListing />} />
      <Route path="/edit-methodology" element={<EditMethodology />} />
      <Route path="/add-methodology" element={<AddMethodology />} />
      <Route path="/trainingType-Listing" element={<TrainingTypeListing />} />
      <Route path= "/induction-listing" element ={<InductionListing/>}/>
      <Route path="/induction-designation" element ={<AddInductionDesignation/>}/>
      <Route path="/edit-trainingtype" element={<EditTrainingType />} />
      <Route path="/trainingListing" element={<TrainingListing />} />
      <Route path="/edit-training" element={<EditTraining />} />
      <Route path="/LMS-Document" element={<LMSDocument />} />
      <Route path="/questions" element={<QuestionListing />} />
      <Route path="/edit-question" element={<EditQuestion />} />
      <Route path="/jobRole-listing" element={<JobroleListing />} />
      <Route path="/edit-jobrole" element={<EditJobRole />} />
      <Route path="/training-mapping" element={<TrainingMapping />} />
      <Route path="/jobrole-mapping" element={<JobRoleMapping/>}/>
      <Route path="/exam-module" element={<ExamModule/>}/>
      <Route path="/mcq-module" element={<MultiChoiceQuesionsSection/>}/>
      <Route path="/training-material/:trainingNumber" element={<MaterialListing/>}/>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </div>
</ThemeProvider>
  );
}