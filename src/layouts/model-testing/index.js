/* eslint-disable react/jsx-key */
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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
// Argon Dashboard 2 MUI base styles
import breakpoints from "assets/theme/base/breakpoints";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";
import Header from "examples/Header";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Argon Dashboard 2 MUI components
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import Select from "react-select";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
//import dlv_utils
import * as Utils from "utils/dlv_utils";
import * as statsUtils from "utils/statsUtils";
// Argon Dashboard 2 MUI context
import {
  useArgonController,
  // setOpenConfigurator,
  // setDarkSidenav,
  // setMiniSidenav,
  // setFixedNavbar,
  // setSidenavColor,
  // setDarkMode,
  setModel,
  setTestData,
} from "context";
import DataTable from "examples/Tables/DataTable";
import PivotTable from "examples/Tables/PivotTable";
import CompareMeans from "examples/Tables/CompareMeans";
import DragList from "components/draganddrop/DragList";
import * as Stats from "utils/stats";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { CleaningServices } from "../../../node_modules/@mui/icons-material/index";
import { setMaxAdjPrice } from "context/index";
const bgImage = process.env.PUBLIC_URL + "/images/model-testing.jpg";

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

function ModelTesting() {
  const [controller, dispatch] = useArgonController();
  const hiddenFileInput = useRef(null);
  const jsonHiddenFileInput = useRef(null);
  const weightsHiddenFileInput = useRef(null);
  const {
    openConfigurator,
    darkSidenav,
    miniSidenav,
    fixedNavbar,
    sidenavColor,
    darkMode,
    testData,
    model,
    modelConfig,
    minAdjPrice,
    maxAdjPrice,
  } = controller;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [dndColumns, setDndColumns] = useState({});
  const [displayFeatureLabel, setDisplayFeatureLabel] = useState(false);
  const [featureTensor, setFeatureTensor] = useState(null);
  const [labelTensor, setLabelTensor] = useState(null);
  const [jsonUpload, setJsonUpload] = useState(null);
  const [weightsUpload, setWeightsUpload] = useState(null);
  const [testLoss, setTestLoss] = useState(null);

  const { loss, optimizer, learningRate, metrics } = modelConfig;

  useEffect(() => {
    if (testData) {
      if (testData.columns.length > 0) createDndColumns(testData.columns);
    }
  }, [testData]);

  useEffect(() => {
    if (Object.keys(dndColumns).length > 0) setDisplayFeatureLabel(true);
  }, [dndColumns]);

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

  useEffect(() => {
    if (model) tfvis.show.modelSummary({ name: "Model Summary" }, model);
  }, [model]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const createDndColumns = (cols, tab = 0) => {
    let newColumns = {};

    if (Array.isArray(cols)) {
      if (cols.length > 0) {
        newColumns = {
          ...newColumns,
          featureCols: createFeatureItems(cols),
          labelCols: [],
        };
      }
    } else {
      alert("Failed to load Columns.", "danger");
    }

    setDndColumns(newColumns);
  };

  const handleHiddenClick = (e) => {
    hiddenFileInput.current.click();
  };
  const handleJsonHiddenClick = (e) => {
    jsonHiddenFileInput.current.click();
  };
  const handleWeightHiddenClick = (e) => {
    weightsHiddenFileInput.current.click();
  };

  const handleLoadTestingData = (e) => {
    let file = e.target.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
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
        setTestData(dispatch, { columns: cols, rows: rows });
      }
    });
  };

  const createFeatureItems = (cols) => {
    let featureItems = [];

    for (const col of cols) {
      featureItems.push({
        id: col.field,
        prefix: "features",
        content: col.field,
      });
    }

    return featureItems;
  };

  const assignFeaturesLabels = (cols) => {
    if (cols.labelCols.length < 1 || cols.featureCols.length < 1) {
      alert("Label Columns and Feature Columns are REQUIRED for this operation.");
    } else {
      const sourceData = { ...testData };
      //Extract feature values from testing data set
      const fValues = sourceData.rows.map((row) => {
        const newArr = [];
        for (let col of cols.featureCols) newArr.push(row[col.content]);
        return newArr;
      });
      const fTensor = tf.tensor2d(fValues);
      setFeatureTensor(fTensor);

      //Extract label values from testing data set
      let lValues = [];
      let lTensor;
      for (let i = 0; i < sourceData.rows.length; i++) {
        if (cols.labelCols.lentgh === 1) {
          lValues.push(sourceData.rows[i][cols.labelCols[0].content]);
        } else {
          const newArr = [];
          for (let col of cols.labelCols) newArr.push(sourceData.rows[i][col.content]);
          lValues.push(newArr);
        }
      }
      const dim = statsUtils.getArrDims(lValues);
      if (dim.length === 1) {
        lTensor = tf.tensor1d(lValues);
      } else if (dim.length > 1) {
        lTensor = tf.tensor2d(lValues, [lValues.length, 1]).reshape([-1]);
      }

      setLabelTensor(lTensor);
      setDndColumns(cols);
      alert("Feature Testing Tensors and Label Testing Tensors Successfully Created!");
    }
  };

  const onChangeJsonUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    setJsonUpload(e.target.files[0]);
  };

  const onChangeWeightsUpload = (e) => {
    if (!e.target.files) {
      return;
    }
    setWeightsUpload(e.target.files[0]);
  };

  const testModel = async () => {
    if (!model) {
      alert("No model loaded for testing purpose.");
      return;
    } else {
      let testingLoss;
      if (!featureTensor || !labelTensor) {
        alert("No features or labels assigned in testing data.");
        return;
      } else {
        const lossTensor = model.evaluate(featureTensor, labelTensor);
        testingLoss = await lossTensor[0].dataSync();
        setTestLoss(testingLoss[0]);
      }
    }
  };

  const loadModel = async () => {
    if (!jsonUpload || !weightsUpload) {
      alert("Both Json file and Weights file are required to load existing models");
    } else {
      if (loss && optimizer && learningRate && metrics.length > 0) {
        const mdl = await tf.loadLayersModel(tf.io.browserFiles([jsonUpload, weightsUpload]));
        setCreatedFlag(false);
        const optmz = getOptimizer(optimizer, learningRate);
        const mtrcs = getMetrics(metrics);
        if (optmz && mtrcs) {
          mdl.compile({
            loss: loss,
            optimizer: optmz,
            metrics: [mtrcs],
          });
        }
        setModel(dispatch, mdl);
        setModelLoadedFlag(true);
      } else {
        alert("Model Compilers missing, cannot test the model.");
      }
    }
  };

  const getOptimizer = (op, lr) => {
    switch (op) {
      case "adadelta":
        return tf.train.adadelta(lr);
      case "adagrad":
        return tf.train.adagrad(lr);
      case "adam":
        return tf.train.adam(lr);
      case "adamax":
        return tf.train.adamax(lr);
      case "momentum":
        return tf.train.momentum(lr);
      case "rmsprop":
        return tf.train.rmsprop(lr);
      case "sgd":
        return tf.train.sgd(lr);
      default:
        return null;
    }
  };
  const getMetrics = (mt) => {
    switch (mt) {
      case "binaryAccuracy":
        return tf.metrics.binaryAccuracy;
      case "binaryCrossEntropy":
        return tf.metrics.binaryCrossentropy;
      case "categoricalAccuracy":
        return tf.metrics.categoricalAccuracy;
      case "categoricalCrossEntropy":
        return tf.metrics.categoricalCrossentropy;
      case "cosineProximity":
        return tf.metrics.cosineProximity;
      case "meanAbsoluteError":
        return tf.metrics.meanAbsoluteError;
      case "meanAbsolutePercentageError":
        return tf.metrics.meanAbsolutePercentageError;
      case "meanSquaredError":
        return tf.metrics.meanSquaredError;
      case "precision":
        return tf.metrics.precision;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.info.main, 0.5),
            rgba(gradients.info.state, 0.5)
          )}, url(${bgImage})`,
        backgroundPositionY: "65%",
      }}
    >
      <Header />
      <ArgonBox sx={{ mb: 2 }}>
        <ArgonButton
          color={darkMode ? "dark" : "white"}
          component="label"
          // variant={darkSidenav ? "outlined" : "gradient"}
          variant="gradient"
          onClick={handleHiddenClick}
          fullWidth
        >
          Load Testing Data{"   "}
          {testData && (
            <span>
              <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
            </span>
          )}
        </ArgonButton>
        <input
          ref={hiddenFileInput}
          onChange={handleLoadTestingData}
          accept=".xlsx"
          type="file"
          style={{ display: "none" }}
        />
      </ArgonBox>

      {!testData ? (
        <ArgonBox height="60px" />
      ) : (
        <ArgonBox mt={5} mb={3}>
          <Grid container mb={3}>
            <Grid item xl={12}>
              <Card>
                <ArgonBox m={3}>
                  <DataTable
                    columns={testData.columns}
                    rows={testData.rows}
                    title="Testing Data Set"
                  />
                </ArgonBox>
              </Card>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} lg={6}>
              <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ bgcolor: "#C1D2DA" }}
                >
                  <Tab label="Features-Labels" {...a11yProps(0)} />
                  <Tab label="Test-Model" {...a11yProps(1)} />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <TabPanel value={tabValue} index={0}>
            {displayFeatureLabel && (
              <Grid container>
                <Grid item xl={12}>
                  <DragList
                    onChildClick={assignFeaturesLabels}
                    initColumns={dndColumns}
                    buttonName="Assign Features and Labels"
                  ></DragList>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Card>
              {!model && (
                <ArgonBox pt={2} pl={2} pr={2}>
                  <ArgonBox pl={3} mt={2} mb={0}>
                    <ArgonTypography variant="h4" fontWeight="bold">
                      Load Saved Model
                    </ArgonTypography>
                  </ArgonBox>
                  <Card sx={{ m: 2, p: 2 }}>
                    <ArgonBox
                      minHeight="150px"
                      pr={2}
                      mr={3}
                      sx={{ overflowX: "hidden", overflowY: "auto" }}
                    >
                      {featureTensor && labelTensor && (
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                            <ArgonButton
                              variant="outlined"
                              color="info"
                              onClick={handleJsonHiddenClick}
                            >
                              <Icon>uploadFile</Icon>JSON File
                              <input
                                ref={jsonHiddenFileInput}
                                type="file"
                                accept=".json"
                                hidden
                                onChange={onChangeJsonUpload}
                              />
                            </ArgonButton>
                            {jsonUpload ? (
                              <span style={{ fontSize: "0.7em" }}>
                                &nbsp;&nbsp;{jsonUpload.name}
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.7em" }}>
                                &nbsp;&nbsp;No&nbsp;&nbsp;JSON&nbsp;&nbsp;File&nbsp;&nbsp;Loaded
                              </span>
                            )}
                          </Grid>
                          <Grid item xs={12} md={4} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                            <ArgonButton
                              variant="outlined"
                              color="info"
                              onClick={handleWeightHiddenClick}
                            >
                              <Icon>uploadFile</Icon>Weights File
                              <input
                                ref={weightsHiddenFileInput}
                                type="file"
                                accept=".bin"
                                hidden
                                onChange={onChangeWeightsUpload}
                              />
                            </ArgonButton>
                            {weightsUpload ? (
                              <span style={{ fontSize: "0.7em" }}>
                                &nbsp;&nbsp;{weightsUpload.name}
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.7em" }}>
                                &nbsp;&nbsp;No&nbsp;&nbsp;Weights&nbsp;&nbsp;File&nbsp;&nbsp;Loaded
                              </span>
                            )}
                          </Grid>
                          <Grid item xs={12} md={2} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                            <ArgonButton variant="gradient" color="primary" onClick={loadModel}>
                              Load Existing Model
                            </ArgonButton>
                          </Grid>
                        </Grid>
                      )}
                    </ArgonBox>
                  </Card>
                </ArgonBox>
              )}
              {model && (
                <ArgonBox mt={3}>
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                      <ArgonButton variant="gradient" color="primary" onClick={testModel}>
                        Testing Loaded Model
                      </ArgonButton>
                    </Grid>
                  </Grid>
                </ArgonBox>
              )}
              {testLoss && (
                <ArgonBox>
                  <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                      <ArgonBox pl={3} mt={2} mb={0}>
                        <ArgonTypography variant="h5" fontWeight="bold">
                          Test Data Loss Calculated at: {testLoss}
                        </ArgonTypography>
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </ArgonBox>
              )}
            </Card>
          </TabPanel>
        </ArgonBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default ModelTesting;
