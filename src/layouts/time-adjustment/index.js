/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// Argon Dashboard 2 MUI base styles
import breakpoints from "assets/theme/base/breakpoints";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Header from "examples/Header";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Argon Dashboard 2 MUI components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Time Adjustment analysis modules
import LinearRegressionTimeAnalysis from "./components/Tests/LinearRegressionTimeAnalysis";
import MultiTrendRegressionTimeAnalysis from "./components/Tests/MultiTrendRegressionTimeAnalysis";

import ArgonButton from "components/ArgonButton/index";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import FileOpenIcon from "@mui/icons-material/FileOpen";
//import dlv_utils
import * as Utils from "utils/dlv_utils";
// Argon Dashboard 2 MUI context
import {
  useArgonController,
  // setOpenConfigurator,
  // setDarkSidenav,
  // setMiniSidenav,
  // setFixedNavbar,
  // setSidenavColor,
  // setDarkMode,
  setData,
} from "context";
const bgImage = process.env.PUBLIC_URL + "/images/time-adjustment.jpg";

// TimeAdjustment page components
// import BaseLayout from "layouts/time-adjustment/components/BaseLayout";
// import PaymentMethod from "layouts/time-adjustment/components/PaymentMethod";
// import Invoices from "layouts/time-adjustment/components/Invoices";
// import TimeAdjustmentInformation from "layouts/time-adjustment/components/TimeAdjustmentInformation";
// import Transactions from "layouts/time-adjustment/components/Transactions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <ArgonBox sx={{ pt: 3 }}>{children}</ArgonBox>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TimeAdjustment() {
  const [controller, dispatch] = useArgonController();
  const hiddenFileInput = useRef(null);
  const { openConfigurator, darkSidenav, miniSidenav, fixedNavbar, sidenavColor, darkMode, data } =
    controller;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  // useEffect(() => {
  //   console.log(tabValue);
  // }, [tabValue]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleHiddenClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handleLoadSalesData = (e) => {
    let file = e.target.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        /* Sale data columns: 
		id,assessment,saleDate,months,assrTaPct,salePrice,assrAdjPrice,
		totalImps,modelCode,quality,condition,age,bsmtAreaSF,lotSizeSF,
		nbhd,marketArea,prevAsmt,sar,floorAreaSF,audTaPct,audAdjPrice.
		****
		Output columns is an array of objects with below structure: (example)
		****
		 [
			{
				field: "id",
				headerName: "Id", could be pure string or unicode like "***\u00a0***"
				width: 120,
				align: "center",
				valueGetter: (params)=>params.row.id.toLocaleString("en-US"),
			},
			{
				field: "age",
				headerName: "Age", could be pure string or unicode like "***\u00a0***"
				width: 50,
				align: "center",
				valueGetter: (params)=>params.row.age.toFixed(0),
			},
			...
		 ]
	*/
        let cols = Utils.defineSalesTableColumns(resp.rows[0]);
        let rows = [];
        for (let i = 1; i < resp.rows.length; i++) {
          let row = {};
          for (let j = 0; j < resp.rows[0].length; j++) {
            Object.assign(row, { [resp.rows[0][j]]: resp.rows[i][j] });
            // row[cols[j].id] = resp.rows[i][j];
          }

          rows.push(row);
        }
        setData(dispatch, { columns: cols, rows: rows });
      }
    });
  };

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.5),
            rgba(gradients.info.state, 0.5)
          )}, url(${bgImage})`,
        backgroundPositionY: "45%",
      }}
    >
      <Header />
      <ArgonBox mt={3} lineHeight={1}>
        <ArgonBox sx={{ mb: 2 }}>
          <ArgonButton
            color={darkMode ? "dark" : "white"}
            component="label"
            // variant={darkSidenav ? "outlined" : "gradient"}
            variant="gradient"
            onClick={handleHiddenClick}
            fullWidth
          >
            Load Sales Data{"   "}
            {data && (
              <span>
                <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
              </span>
            )}
          </ArgonButton>
          <input
            ref={hiddenFileInput}
            onChange={handleLoadSalesData}
            accept=".xlsx"
            type="file"
            style={{ display: "none" }}
          />
        </ArgonBox>
      </ArgonBox>
      {!data ? (
        <ArgonBox height="150px" />
      ) : (
        <ArgonBox mt={5}>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ bgcolor: "#C1D2DA" }}
                >
                  <Tab label="SAR-Linear" {...a11yProps(0)} />
                  <Tab label="SAR-MultiTrend" {...a11yProps(1)} />
                  <Tab label="UnitValue-Linear" {...a11yProps(2)} />
                  <Tab label="UnitValue-MultiTrend" {...a11yProps(3)} />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <TabPanel value={tabValue} index={0}>
            {/* <ArgonTypography>SAR Linear Regression Analysis</ArgonTypography> */}
            <Grid container>
              <Grid item xl={12}>
                {/* <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" /> */}
                <LinearRegressionTimeAnalysis numberofXTicks={36} dependant="SAR" />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid container>
              <Grid item xl={12}>
                {/* <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" /> */}
                <MultiTrendRegressionTimeAnalysis numberofXTicks={36} dependant="SAR" />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Grid container>
              <Grid item xl={12}>
                {/* <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" /> */}
                <LinearRegressionTimeAnalysis numberofXTicks={36} dependant="UnitValue" />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Grid container>
              <Grid item xl={12}>
                {/* <MasterCard number={4562112245947852} holder="jack peterson" expires="11/22" /> */}
                <MultiTrendRegressionTimeAnalysis numberofXTicks={36} dependant="UnitValue" />
              </Grid>
            </Grid>
          </TabPanel>
        </ArgonBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default TimeAdjustment;
