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

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "examples/Header";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

//Images
import assessmentaudits from "assets/images/assessment-audits.jpg";
import compliancereviews from "assets/images/compliance-reviews.jpg";
import marketanalyses from "assets/images/market-analyses.jpg";
import provincialreports from "assets/images/provincial-reports.jpg";
import qualitymeasurementtools from "assets/images/quality-measurement-tools.jpg";

const bgImage = process.env.PUBLIC_URL + "/images/assessment-quality.jpg";

//import dlv_utils
import * as Utils from "utils/dlv_utils";

function AssessmentQuality() {
  const [controller, dispatch] = useArgonController();

  const { openConfigurator, darkSidenav, miniSidenav, fixedNavbar, sidenavColor, darkMode, data } =
    controller;

  const { size } = typography;

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.8),
            rgba(gradients.info.state, 0.8)
          )}, url(${bgImage})`,
        backgroundPositionY: "60%",
      }}
    >
      <Header />

      <ArgonBox mt={5} mb={3}>
        <Card>
          <ArgonBox pt={4} pl={5} pr={2}>
            <ArgonBox mb={0.5}>
              <ArgonTypography variant="h5" fontWeight="medium">
                Alberta Assessment Quality Control System
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox mb={1}>
              <ArgonTypography variant="button" fontWeight="regular" color="text">
                Under Construction...
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>
          <ArgonBox p={2}>
            <Grid container spacing={5} pl={3}>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={assessmentaudits}
                  label="Assessment Audits"
                  title="Assessment Audits"
                  description="Assessment Annual/Detailed Audits are the main functions of the Assessment Audit Unit to ensure the quality of property assessments in Alberta meets legislation requirements."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Assessment Audits",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={qualitymeasurementtools}
                  label="Quality Test Tools"
                  title="Quality Test Tools"
                  description="Research and develop quantitative quality measurement tools for use in the Assessment Audits to improve the accuracy and consistency in the audit results. Quantifying the audit results is a big challenge."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Quality Test Tools",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={compliancereviews}
                  label="Compliance Reviews"
                  title="Compliance Reviews"
                  description="Compliance Reviews for the public or stakeholders challenging the municipalities' compliance level in response to their formal requests for Assessment Information."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Compliance Reviews",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={marketanalyses}
                  label="Market Analyses"
                  title="Market Analyses"
                  description="Conducting municipal, regional, and provincial level market research to gain the up-to-date market knowledge for the annually assigned list of municipalities."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Market Analyses",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} p={3}>
                <DefaultProjectCard
                  image={provincialreports}
                  label="Provincial Reports"
                  title="Provincial Reports"
                  description="Generating ad hoc provincial reports on the assessment quality, market research, compliance reviews, and status of innovating and developing of the quality measurements."
                  action={{
                    type: "internal",
                    route: "/assessment-quality",
                    color: "info",
                    label: "Provincial Reports",
                  }}
                />
              </Grid>
            </Grid>
          </ArgonBox>
        </Card>
      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default AssessmentQuality;
