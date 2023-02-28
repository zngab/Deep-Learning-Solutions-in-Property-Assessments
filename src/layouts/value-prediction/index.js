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
  setMinAdjPrice,
  setMaxAdjPrice,
  setFeatureColumns,
  setTestData,
} from "context";
import DataTable from "examples/Tables/DataTable";
import PivotTable from "examples/Tables/PivotTable";
import CompareMeans from "examples/Tables/CompareMeans";
import DragList from "components/draganddrop/DragList";
import * as Stats from "utils/stats";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

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

function ValuePrediction() {
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
    model,
    minAdjPrice,
    maxAdjPrice,
    featureColumns,
  } = controller;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [dndColumns, setDndColumns] = useState({});
  const [featureTensorCreated, setFeatureTensorCreated] = useState(false);
  const [featureTensor, setFeatureTensor] = useState(null);
  const [jsonUpload, setJsonUpload] = useState(null);
  const [weightsUpload, setWeightsUpload] = useState(null);
  const [predData, setPredData] = useState(null);
  const [minLabelValue, setMinLabelValue] = useState(-99999999);
  const [maxLabelValue, setMaxLabelValue] = useState(-99999999);

  useEffect(() => {
    if (minAdjPrice) setMinLabelValue(minAdjPrice);
  }, [minAdjPrice]);

  useEffect(() => {
    if (maxAdjPrice) setMaxLabelValue(maxAdjPrice);
  }, [maxAdjPrice]);

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
    if (predData) {
      if (predData.columns.length > 0) {
        if (!featureColumns) {
          createDndColumns(predData.columns);
        } else {
          if (!featureTensorCreated) createPredFeatureTensor(featureColumns);
        }
      }
    }
  }, [predData, featureColumns]);

  useEffect(() => {
    if (Object.keys(dndColumns).length > 0) console.log(dndColumns);
  }, [dndColumns]);

  useEffect(() => {
    console.log(featureTensor);
  }, [featureTensor]);

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

  const handleLoadPredictData = (e) => {
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
        setPredData({ columns: cols, rows: rows });
      }
    });
  };

  const createFeatureItems = (cols) => {
    let featureItems = [];
    for (const col of cols) {
      if (col.field.indexOf("_") >= 0 && col.field.indexOf("_Recoded") < 0) {
        featureItems.push({
          id: col.field,
          prefix: "features",
          content: col.field,
        });
      }
    }

    return featureItems;
  };

  const createPredFeatureTensor = (fCols) => {
    if (!predData) {
      alert("Prediction Data are REQUIRED for this operation.");
    } else {
      const sourceData = { ...predData };
      //Extract feature values from prediction data set
      if (fCols.length > 0) {
        const fValues = sourceData.rows.map((row) => {
          const newArr = [];
          for (let col of fCols) newArr.push(row[col.content]);
          return newArr;
        });

        const fTensor = tf.tensor2d(fValues);

        setFeatureTensor(fTensor);
        setFeatureTensorCreated(true);
        alert("Feature Prediction Tensors Successfully Created!");
      }
    }
  };
  const assignFeatures = (cols) => {
    if (!cols.featureCols) {
      alert("Feature Columns is REQUIRED for this operation.");
    } else {
      //Extract feature values from prediction data set
      if (cols.featureCols.length > 0) {
        createPredFeatureTensor(cols.featureCols);
        setFeatureColumns(dispatch, cols.featureCols);
      }
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

  const onChangeMinLabelValue = (e) => {
    setMinLabelValue(e.target.value);
  };

  const onChangeMaxLabelValue = (e) => {
    setMaxLabelValue(e.target.value);
  };

  const loadModel = async () => {
    if (!jsonUpload || !weightsUpload) {
      alert("Both Json file and Weights file are required to load existing models");
    } else {
      const mdl = await tf.loadLayersModel(tf.io.browserFiles([jsonUpload, weightsUpload]));
      setModel(dispatch, mdl);
    }
  };

  const valuePrediction = async () => {
    // tf.tidy(() => {
    if (model && minLabelValue > -99999999 && maxLabelValue > -99999999) {
      const normalizedOutputTensor = model.predict(featureTensor);

      const normOutputValues = await normalizedOutputTensor.dataSync();
      console.log(normOutputValues);
      let newRows = [];
      for (let i = 0; i < predData.rows.length; i++) {
        const denormOutput = normOutputValues[i] * (maxLabelValue - minLabelValue) + minLabelValue;

        const newRow = {
          ...predData.rows[i],
          predictedValue: denormOutput,
        };
        newRows.push(newRow);
      }

      setPredData({
        ...predData,
        rows: newRows,
      });
      alert("Values successfully predicted!");
    } else {
      alert("No model or min-max label values are available for Predictions!");
    }
    // });
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
          Load Prediction Data{"   "}
          {predData && (
            <span>
              <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
            </span>
          )}
        </ArgonButton>
        <input
          ref={hiddenFileInput}
          onChange={handleLoadPredictData}
          accept=".xlsx"
          type="file"
          style={{ display: "none" }}
        />
      </ArgonBox>

      {!predData ? (
        <ArgonBox height="60px" />
      ) : (
        <ArgonBox mt={5} mb={3}>
          <Grid container mb={3}>
            <Grid item xl={12}>
              <Card>
                <ArgonBox m={3}>
                  <DataTable
                    columns={predData.columns}
                    rows={predData.rows}
                    title="Prediction Data Set"
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
                  <Tab
                    label={featureColumns ? "Features-Assigned" : "Assign-Prediction-Features"}
                    {...a11yProps(0)}
                  />
                  <Tab label="Value-Prediction" {...a11yProps(1)} />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <TabPanel value={tabValue} index={0}>
            {!featureColumns && (
              <Grid container>
                <Grid item xl={12}>
                  <DragList
                    onChildClick={assignFeatures}
                    initColumns={dndColumns}
                    buttonName="Assign Features"
                  ></DragList>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Card>
              {!model ? (
                <ArgonBox pt={2} pl={2} pr={2}>
                  <ArgonBox pl={3} mt={2} mb={0}>
                    <ArgonTypography variant="h4" fontWeight="bold">
                      {featureTensorCreated
                        ? "Load Saved Model"
                        : "Assing Features Before Loading Model"}
                    </ArgonTypography>
                  </ArgonBox>
                  <Card sx={{ m: 2, p: 2 }}>
                    <ArgonBox
                      minHeight="150px"
                      pr={2}
                      mr={3}
                      sx={{ overflowX: "hidden", overflowY: "auto" }}
                    >
                      {featureTensorCreated ? (
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
                              Load&nbsp;&nbsp;Existing&nbsp;&nbsp;Model
                            </ArgonButton>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={3} mb={3}>
                          <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                            <ArgonTypography variant="h5" fontWeight="bold">
                              No feature tensors loaded. Assign prediction features first.
                            </ArgonTypography>
                          </Grid>
                        </Grid>
                      )}
                    </ArgonBox>
                  </Card>
                </ArgonBox>
              ) : (
                <ArgonBox mt={3}>
                  {featureTensorCreated ? (
                    <ArgonBox>
                      {(minLabelValue === -99999999 || maxLabelValue === -99999999) && (
                        <Grid container spaceing={3} mb={3}>
                          <Grid item xs={12} md={3}></Grid>
                          <Grid item xs={12} md={3} sx={{ textAlign: "center", p: 2, m: 2 }}>
                            <ArgonBox m={1}>
                              <ArgonTypography display="flex" alignItems="center" variant="button">
                                Min&nbsp;Label&nbsp;Value&nbsp;
                                <ArgonInput
                                  type="number"
                                  name="minLabelValue"
                                  size="medium"
                                  value={minLabelValue}
                                  onChange={onChangeMinLabelValue}
                                />
                              </ArgonTypography>
                            </ArgonBox>
                          </Grid>
                          <Grid item xs={12} md={3} sx={{ textAlign: "center", p: 2, m: 2 }}>
                            <ArgonBox m={1}>
                              <ArgonTypography display="flex" alignItems="center" variant="button">
                                Max&nbsp;Label&nbsp;Value&nbsp;
                                <ArgonInput
                                  type="number"
                                  name="maxLabelValue"
                                  size="medium"
                                  value={maxLabelValue}
                                  onChange={onChangeMaxLabelValue}
                                />
                              </ArgonTypography>
                            </ArgonBox>
                          </Grid>
                        </Grid>
                      )}
                      <Grid container spacing={3} mb={3}>
                        <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                          <ArgonButton variant="gradient" color="primary" onClick={valuePrediction}>
                            Predict Assessments
                          </ArgonButton>
                        </Grid>
                      </Grid>
                    </ArgonBox>
                  ) : (
                    <Grid container spacing={3} mb={3}>
                      <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                        <ArgonTypography variant="h5" fontWeight="bold">
                          No deature tensors loaded. Load the prediction data.
                        </ArgonTypography>
                      </Grid>
                    </Grid>
                  )}
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

export default ValuePrediction;
