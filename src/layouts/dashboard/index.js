/* eslint-disable no-unused-vars */
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

import { useState, useRef, useEffect } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Button from "@mui/material/Button";

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

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "examples/Header";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import { CleaningServices, SubdirectoryArrowLeftOutlined } from "@mui/icons-material";

//Images
import timeadjustment from "assets/images/time-adj.jpg";
import datapreparation from "assets/images/data-prepare.jpg";
import modelbuilding from "assets/images/model-building.jpg";
import modeltesting from "assets/images/model-testing.jpg";
import valueprediction from "assets/images/value-prediction.jpg";
import assessmentquality from "assets/images/assessment-quality.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import StickyHeaderTable from "examples/Tables/StickyHeaderTable";
import DataTable from "examples/Tables/DataTable";
const bgImage = process.env.PUBLIC_URL + "/images/dashboard-back.jpg";

//import dlv_utils
import * as Utils from "utils/dlv_utils";

function Default() {
  const [controller, dispatch] = useArgonController();

  const { openConfigurator, darkSidenav, miniSidenav, fixedNavbar, sidenavColor, darkMode, data } =
    controller;
  const hiddenFileInput = useRef(null);
  // const [saleData, setSaleData] = useState(null);

  const { size } = typography;

  // useEffect(() => {
  //   if (saleData) console.log(saleData);
  // }, [saleData]);

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

      {/*   <ArgonBox mt={5} mb={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} xl={4}>
          <PlatformSettings />
        </Grid>
        <Grid item xs={12} md={6} xl={4}>
          <ProfileInfoCard
            title="profile information"
            description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
            info={{
              fullName: "Alec M. Thompson",
              mobile: "(44) 123 1234 123",
              email: "alecthompson@mail.com",
              location: "USA",
            }}
            social={[
              {
                link: "https://www.facebook.com/CreativeTim/",
                icon: <FacebookIcon />,
                color: "facebook",
              },
              {
                link: "https://twitter.com/creativetim",
                icon: <TwitterIcon />,
                color: "twitter",
              },
              {
                link: "https://www.instagram.com/creativetimofficial/",
                icon: <InstagramIcon />,
                color: "instagram",
              },
            ]}
            action={{ route: "", tooltip: "Edit Profile" }}
          />
        </Grid>
        <Grid item xs={12} xl={4}>
          <ProfilesList title="conversations" profiles={profilesListData} />
        </Grid>
      </Grid>
    </ArgonBox> */}
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
        <ArgonBox height="70px" />
      ) : (
        // <StickyHeaderTable columns={data.columns} rows={data.rows} />
        <Grid container mb={3}>
          <Grid item xl={12}>
            <Card>
              <ArgonBox m={3}>
                <DataTable columns={data.columns} rows={data.rows} title="Sales Table" />
              </ArgonBox>
            </Card>
          </Grid>
        </Grid>
      )}
      <ArgonBox mt={5} mb={3}>
        <Card>
          <ArgonBox pt={4} pl={5} pr={2}>
            <ArgonBox mb={0.5}>
              <ArgonTypography variant="h5" fontWeight="medium">
                Deep Learning Application in Preparing Property Assessments
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox mb={1}>
              <ArgonTypography variant="button" fontWeight="regular" color="text">
                Steps for Mass Appraisal
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>
          <ArgonBox p={2}>
            <Grid container spacing={5} pl={3}>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={timeadjustment}
                  label="Step #1"
                  title="Time Adjustment Analysis"
                  description="Apply time adjustment analysis for sales to arrive at adjusted sale prices."
                  action={{
                    type: "internal",
                    route: "/time-adjustment",
                    color: "info",
                    label: "Time Adjustment",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={datapreparation}
                  label="Step #2"
                  title="Data Preparation"
                  description="Prepare adjusted data for deep learning neural network model purposes."
                  action={{
                    type: "internal",
                    route: "/data-preparation",
                    color: "info",
                    label: "Data Preparation",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={modelbuilding}
                  label="Step #3"
                  title="Model Building"
                  description="Build deep learning neural network model for property assessments."
                  action={{
                    type: "internal",
                    route: "/model-building",
                    color: "info",
                    label: "Model Building",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={valueprediction}
                  label="Step #4"
                  title="Value Prediction"
                  description="Predict the values for selected properties using built  DL models."
                  action={{
                    type: "internal",
                    route: "/value-prediction",
                    color: "info",
                    label: "Value Prediction",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={assessmentquality}
                  label="Under Construction..."
                  title="Assessment Quality"
                  description="A whole new web application used for assessment quality control in the Province of Alberta. It is currently under construction..."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Assessment Quality",
                  }}
                />
              </Grid>
            </Grid>
          </ArgonBox>
        </Card>
      </ArgonBox>

      <Footer />
    </DashboardLayout>

    // <DashboardLayout>
    //   {/* <DashboardNavbar /> */}
    //   <ArgonBox mt={3} lineHeight={1}>
    //     <ArgonBox sx={{ mb: 2 }}>
    //       <ArgonButton
    //         color="warning"
    //         component="label"
    //         // variant={darkSidenav ? "outlined" : "gradient"}
    //         variant="gradient"
    //         onClick={handleHiddenClick}
    //         fullWidth
    //       >
    //         Load Sales Data{"   "}
    //         {data && (
    //           <span>
    //             <FileOpenIcon sx={{ color: "white", mt: 0.5, ml: 1 }} />
    //           </span>
    //         )}
    //       </ArgonButton>
    //       <input
    //         ref={hiddenFileInput}
    //         onChange={handleLoadSalesData}
    //         accept=".xlsx"
    //         type="file"
    //         style={{ display: "none" }}
    //       />
    //     </ArgonBox>
    //   </ArgonBox>
    //   <ArgonBox py={3}>
    //     {data && (
    //       <Grid container spacing={3} mb={3}>
    //         <Grid item lg={12}>
    //           {/* <OutTable
    //             data={saleData.rows}
    //             columns={saleData.cols}
    //             tableClassName="Sales Data"
    //             tableHeaderRowClass="heading"
    //           /> */}
    //           <DetailedStatisticsCard
    //             title="today's money"
    //             count="$53,000"
    //             icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
    //             percentage={{ color: "success", count: "+55%", text: "since yesterday" }}
    //           />
    //         </Grid>
    //       </Grid>
    //     )}
    //   </ArgonBox>
    //   <ArgonBox py={3}>
    //     <Grid container spacing={3} mb={3}>
    //       <Grid item xs={12} md={6} lg={3}>
    //         <DetailedStatisticsCard
    //           title="today's money"
    //           count="$53,000"
    //           icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
    //           percentage={{ color: "success", count: "+55%", text: "since yesterday" }}
    //         />
    //       </Grid>
    //       <Grid item xs={12} md={6} lg={3}>
    //         <DetailedStatisticsCard
    //           title="today's users"
    //           count="2,300"
    //           icon={{ color: "error", component: <i className="ni ni-world" /> }}
    //           percentage={{ color: "success", count: "+3%", text: "since last week" }}
    //         />
    //       </Grid>
    //       <Grid item xs={12} md={6} lg={3}>
    //         <DetailedStatisticsCard
    //           title="new clients"
    //           count="+3,462"
    //           icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
    //           percentage={{ color: "error", count: "-2%", text: "since last quarter" }}
    //         />
    //       </Grid>
    //       <Grid item xs={12} md={6} lg={3}>
    //         <DetailedStatisticsCard
    //           title="sales"
    //           count="$103,430"
    //           icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
    //           percentage={{ color: "success", count: "+5%", text: "than last month" }}
    //         />
    //       </Grid>
    //     </Grid>
    //     <Grid container spacing={3} mb={3}>
    //       <Grid item xs={12} lg={7}>
    //         <GradientLineChart
    //           title="Sales Overview"
    //           description={
    //             <ArgonBox display="flex" alignItems="center">
    //               <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
    //                 <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
    //               </ArgonBox>
    //               <ArgonTypography variant="button" color="text" fontWeight="medium">
    //                 4% more{" "}
    //                 <ArgonTypography variant="button" color="text" fontWeight="regular">
    //                   in 2022
    //                 </ArgonTypography>
    //               </ArgonTypography>
    //             </ArgonBox>
    //           }
    //           chart={gradientLineChartData}
    //         />
    //       </Grid>
    //       <Grid item xs={12} lg={5}>
    //         <Slider />
    //       </Grid>
    //     </Grid>
    //     <Grid container spacing={3}>
    //       <Grid item xs={12} md={8}>
    //         <SalesTable title="Sales by Country" rows={salesTableData} />
    //       </Grid>
    //       <Grid item xs={12} md={4}>
    //         <CategoriesList title="categories" categories={categoriesListData} />
    //       </Grid>
    //     </Grid>
    //   </ArgonBox>
    //   <Footer />
    // </DashboardLayout>
  );
}

export default Default;
