/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Profile from "layouts/profile";
import Login from "layouts/authentication/log-in";
import ResetPassword from "layouts/authentication/forgot-password";
import ReviewDocument from "layouts/authentication/Review";
// @mui icons
import Icon from "@mui/material/Icon";
import ReleaseDocument from "layouts/authentication/release-document";
import PrintDocument from "layouts/authentication/print-document";
import Watermark from "layouts/authentication/watermark";

const routes = [
  // {
  //   type: "collapse",
  //   name: "DocEditor",
  //   key: "DocEditor",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/DocEditor",
  //   component: <DocEditor />,
  // },
  
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Watermark",
    key: "watermark",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/authentication/watermark",
    component: <Watermark />,
  },
 
 
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "ReleaseDocument",
    key: "release-document",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/release-document",
    component: <ReleaseDocument />,
  },
  {
    type: "collapse",
    name: "Login",
    key: "log-in",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/log-in",
    component: <Login/>,
  },
  {
    type: "collapse",
    name: "PrintDocument",
    key: "print-document",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/print-document",
    component: <PrintDocument />,
  },
  // {
  //   type: "collapse",
  //   name: "ResetPassword",
  //   key: "forgot-password",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/forgot-password",
  //   component: <ResetPassword/>,
  // },
  // {
  //   type: "collapse",
  //   name: "AddUser",
  //   key: "add-user",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/add-user",
  //   component: <AddUser/>,
  // },
  // {
  //   type: "collapse",
  //   name: "AddDepartment",
  //   key: "add-department",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/add-department",
  //   component: <AddDepartment />,
  // },
  // {
  //   type: "collapse",
  //   name: "AddDocument",
  //   key: "add-document",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/add-document",
  //   component: <AddDocument />,
  // },
  // {
  //   type: "collapse",
  //   name: "AddApproval",
  //   key: "add-approval",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/add-approval",
  //   component: <AddApproval />,
  // },
  {
    type:"collapse",
    name: "ReviewDocument",
    key: "Review",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/Review",
    component: <ReviewDocument/>, 
  },
  
];

export default routes;
