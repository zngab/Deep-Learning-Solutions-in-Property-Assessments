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
  setFeatureColumns,
  setLabelColumns,
  setTrainData,
  setTestData,
} from "context";
import DataTable from "examples/Tables/DataTable";
import PivotTable from "examples/Tables/PivotTable";
import CompareMeans from "examples/Tables/CompareMeans";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import DragList from "components/draganddrop/DragList";
import * as Stats from "utils/stats";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { CleaningServices } from "../../../node_modules/@mui/icons-material/index";
import { setMaxAdjPrice } from "context/index";
const bgImage = process.env.PUBLIC_URL + "/images/model-building.jpg";

// ModelBuilding page components
// import BaseLayout from "layouts/time-adjustment/components/BaseLayout";
// import PaymentMethod from "layouts/time-adjustment/components/PaymentMethod";
// import Invoices from "layouts/time-adjustment/components/Invoices";
// import ModelBuildingInformation from "layouts/time-adjustment/components/ModelBuildingInformation";
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

function ModelBuilding() {
  const [controller, dispatch] = useArgonController();
  const hiddenTrainFileInput = useRef(null);
  const hiddenTestFileInput = useRef(null);
  const {
    openConfigurator,
    darkSidenav,
    miniSidenav,
    fixedNavbar,
    sidenavColor,
    darkMode,
    trainData,
    testData,
    model,
    featureColumns,
    labelColumns,
    minAdjPrice,
    maxAdjPrice,
  } = controller;
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [dndColumns, setDndColumns] = useState({});
  const [displayFeatureLabel, setDisplayFeatureLabel] = useState(false);
  const [featureTrainTensor, setFeatureTrainTensor] = useState(null);
  const [labelTrainTensor, setLabelTrainTensor] = useState(null);
  const [featureTestTensor, setFeatureTestTensor] = useState(null);
  const [labelTestTensor, setLabelTestTensor] = useState(null);
  const [numLayers, setNumLayers] = useState(1);
  const [trainedFlag, setTrainedFlag] = useState(false);
  const [testedFlag, setTestedFlag] = useState(false);
  const [createdFlag, setCreatedFlag] = useState(false);
  const [trainLoss, setTrainLoss] = useState(null);
  const [testLoss, setTestLoss] = useState(null);

  const initLayer = {
    units: 0,
    useBias: true,
    activation: "linear",
    inputDim: 1,
  };

  const [modelConfiguration, setModelConfiguration] = useState({
    layers: [initLayer],
    loss: "",
    optimizer: "",
    learningRate: 0.01,
    metrics: "",
    batchSize: 32,
    epochs: 1,
    validationSplit: 0.1,
  });

  const Activations = [
    { value: "Reset", label: "Reset" },
    { value: "elu", label: "elu" },
    { value: "hardSigmoid", label: "hardSigmoid" },
    { value: "linear", label: "linear" },
    { value: "mish", label: "mish" },
    { value: "relu", label: "relu" },
    { value: "relu6", label: "relu6" },
    { value: "selu", label: "selu" },
    { value: "sigmoid", label: "sigmoid" },
    { value: "softmax", label: "softmax" },
    { value: "softplus", label: "softplus" },
    { value: "softsign", label: "softsign" },
    { value: "tanh", label: "tanh" },
    { value: "swish", label: "swish" },
  ];
  const Losses = [
    { value: "Reset", label: "Reset" },
    { value: "absoluteDifference", label: "absoluteDifference" },
    { value: "binaryCrossentropy", label: "binaryCrossentropy" },
    { value: "meanAbsoluteError", label: "meanAbsoluteError" },
    { value: "meanSquaredError", label: "meanSquaredError" },
    { value: "hingeLoss", label: "hingeLoss" },
    { value: "huberLoss", label: "huberLoss" },
    { value: "logLoss", label: "logLoss" },
  ];
  const Metrics = [
    { value: "Reset", label: "Reset" },
    { value: "binaryAccuracy", label: "binaryAccuracy" },
    { value: "binaryCrossEntropy", label: "binaryCrossEntropy" },
    { value: "categoricalAccuracy", label: "categoricalAccuracy" },
    { value: "categoricalCrossEntropy", label: "categoricalCrossEntropy" },
    { value: "cosineProximity", label: "cosineProximity" },
    { value: "meanAbsoluteError", label: "meanAbsoluteError" },
    { value: "meanAbsolutePercentageError", label: "meanAbsolutePercentageError" },
    { value: "meanSquaredError", label: "meanSquaredError" },
    { value: "precision", label: "precision" },
  ];

  const Optimizers = [
    { value: "Reset", label: "Reset" },
    { value: "adadelta", label: "adadelta" },
    { value: "adagrad", label: "adagrad" },
    { value: "adam", label: "adam" },
    { value: "adamax", label: "adamax" },
    { value: "momentum", label: "momentum" },
    { value: "rmsprop", label: "rmsprop" },
    { value: "sgd", label: "sgd" },
  ];

  const ModelID = "DeepLearningModel_1";

  const { layers, loss, optimizer, learningRate, metrics, batchSize, epochs, validationSplit } =
    modelConfiguration;

  useEffect(() => {
    if (trainData) {
      if (trainData.columns.length > 0) createDndColumns(trainData.columns);
    }
  }, [trainData]);

  useEffect(() => {
    if (Object.keys(dndColumns).length > 0) {
      if (!featureColumns && !labelColumns) {
        setDisplayFeatureLabel(true);
      } else {
        setDisplayFeatureLabel(false);
      }
    }
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
    setNumLayers(layers.length);
  }, [modelConfiguration.layers]);

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

  const handleTrainHiddenClick = (e) => {
    hiddenTrainFileInput.current.click();
  };

  const handleTestHiddenClick = (e) => {
    hiddenTestFileInput.current.click();
  };

  const handleLoadTrainingData = (e) => {
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
        setTrainData(dispatch, { columns: cols, rows: rows });
      }
    });
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

  const assignFeaturesLabels = (cols) => {
    if (cols.labelCols.length < 1 || cols.featureCols.length < 1) {
      alert("Label Columns and Feature Columns are REQUIRED for this operation.");
    } else {
      //assign Train features and labels
      const sourceTrainData = { ...trainData };
      //Extract feature values from training data set
      const fTrainValues = sourceTrainData.rows.map((row) => {
        const newArr = [];
        for (let col of cols.featureCols) newArr.push(row[col.content]);
        return newArr;
      });
      const fTrainTensor = tf.tensor2d(fTrainValues);
      setFeatureTrainTensor(fTrainTensor);

      //Extract label values from training data set
      let lTrainValues = [];
      let lTrainTensor;
      for (let i = 0; i < sourceTrainData.rows.length; i++) {
        if (cols.labelCols.lentgh === 1) {
          lTrainValues.push(sourceTrainData.rows[i][cols.labelCols[0].content]);
        } else {
          const newArr = [];
          for (let col of cols.labelCols) newArr.push(sourceTrainData.rows[i][col.content]);
          lTrainValues.push(newArr);
        }
      }
      let dim = statsUtils.getArrDims(lTrainValues);
      if (dim.length === 1) {
        lTrainTensor = tf.tensor1d(lTrainValues);
      } else if (dim.length > 1) {
        lTrainTensor = tf.tensor2d(lTrainValues, [lTrainValues.length, 1]).reshape([-1]);
      }

      setLabelTrainTensor(lTrainTensor);

      //assign Test features and labels
      const sourceTestData = { ...testData };
      //Extract feature values from testing data set
      const fTestValues = sourceTestData.rows.map((row) => {
        const newArr = [];
        for (let col of cols.featureCols) newArr.push(row[col.content]);
        return newArr;
      });
      const fTestTensor = tf.tensor2d(fTestValues);
      setFeatureTestTensor(fTestTensor);

      //Extract label values from testing data set
      let lTestValues = [];
      let lTestTensor;
      for (let i = 0; i < sourceTestData.rows.length; i++) {
        if (cols.labelCols.lentgh === 1) {
          lTestValues.push(sourceTestData.rows[i][cols.labelCols[0].content]);
        } else {
          const newArr = [];
          for (let col of cols.labelCols) newArr.push(sourceTestData.rows[i][col.content]);
          lTestValues.push(newArr);
        }
      }
      dim = statsUtils.getArrDims(lTestValues);
      if (dim.length === 1) {
        lTestTensor = tf.tensor1d(lTestValues);
      } else if (dim.length > 1) {
        lTestTensor = tf.tensor2d(lTestValues, [lTestValues.length, 1]).reshape([-1]);
      }

      setLabelTestTensor(lTestTensor);
      //set feature columns and label columns for later use
      setFeatureColumns(dispatch, cols.featureCols);
      setLabelColumns(dispatch, cols.labelCols);
      //set dnd columns
      setDndColumns(cols);
      alert(
        "Feature Training/Testing Tensors and Label Training/Testing Tensors Successfully Created!"
      );
    }
  };

  //   const splitDatasets = (cols) => {
  //     if (cols.labelCols.length < 1 || cols.featureCols.length < 1) {
  //       alert("Label Columns and Feature Columns are REQUIRED for this operation.");
  //     } else {
  //       let newData = {};
  //       const sourceData = { ...trainData };
  //       //Use Selectd features as independant variables and label as dependant variable
  //       //to create tensors
  //       const [trainingData, testingData] = Stats.splitData(sourceData, cols);

  //       // Set trainData in context
  //       setTrainData(dispatch, trainingData);
  //       setTestData(dispatch, testingData);
  //       setDisplaySplitting(false);
  //     }
  //   };

  //   const saveNormalisations = (cols) => {
  //     let newData = {};
  //     const sourceData = { ...trainData };
  //     //Conduct binary encoding
  //     if (cols.minMaxNormalizer.length > 0) {
  //       newData = Stats.minMaxNormalizer(sourceData, cols);
  //     }

  //     // Set trainData in context
  //     setData(dispatch, newData);
  //     setDisplayNormalisation(false);
  //   };

  //   const labelEncoding = (cols) => {
  //     let newData = {};
  //     const sourceData = { ...trainData };
  //     if (cols.labelEncoder.length > 0) {
  //       newData = Stats.labelEncoder(sourceData, cols);
  //     }
  //     setData(dispatch, newData);
  //     setDisplayRecoding(false);
  //   };

  const onChangeLoss = (e) => {
    setModelConfiguration({ ...modelConfiguration, loss: e.value });
  };
  const onChangeOptimizer = (e) => {
    setModelConfiguration({ ...modelConfiguration, optimizer: e.value });
  };
  const onChangeLearningRate = (e) => {
    setModelConfiguration({ ...modelConfiguration, learningRate: parseFloat(e.target.value) });
  };
  const onChangeMetrics = (e) => {
    setModelConfiguration({ ...modelConfiguration, metrics: e.value });
  };
  const onChangeBatchSize = (e) => {
    setModelConfiguration({ ...modelConfiguration, batchSize: parseInt(e.target.value) });
  };
  const onChangeEpochs = (e) => {
    setModelConfiguration({ ...modelConfiguration, epochs: parseInt(e.target.value) });
  };
  const onChangeValidationSplit = (e) => {
    setModelConfiguration({ ...modelConfiguration, validationSplit: parseFloat(e.target.value) });
  };
  const onChangeActivation = (idx) => (e) => {
    if (e.value !== "Reset") {
      layers[idx].activation = e.value;
    }
    setModelConfiguration({ ...modelConfiguration, layers });
  };
  const onChangeLayers = (e) => {
    console.log(e);
    let curLayers = [...layers];
    const name = e.target.name;
    if (["inputDim", "units"].includes(name)) {
      curLayers[e.target.id][name] = parseInt(e.target.value);
    } else if (name === "useBias")
      curLayers[e.target.id].useBias = e.target.value === "true" ? false : true;

    setModelConfiguration({ ...modelConfiguration, layers: curLayers });
  };

  const addLayer = (e) => {
    e.preventDefault();
    let curLayers = [
      ...layers,
      {
        units: 0,
        useBias: true,
        activation: "linear",
      },
    ];
    setModelConfiguration({ ...modelConfiguration, layers: curLayers });
  };

  const removeLayer = (idx) => (e) => {
    e.preventDefault();
    const index = idx;
    const removedLayers = layers.filter((item, idx) => idx !== index);
    setModelConfiguration({ ...modelConfiguration, layers: removedLayers });
  };

  const createModel = () => {
    if (layers.length > 1) {
      const mdl = tf.sequential();
      for (let i = 0; i < layers.length; i++) {
        if (i === 0) {
          //First layer is the input layer requires inputDim to be specified.
          mdl.add(
            tf.layers.dense({
              units: layers[i].units,
              useBias: layers[i].useBias,
              activation: layers[i].activation,
              inputDim: layers[i].inputDim,
            })
          );
        } else {
          mdl.add(
            tf.layers.dense({
              units: layers[i].units,
              useBias: layers[i].useBias,
              activation: layers[i].activation,
            })
          );
        }
      }
      //Compile the model before send it to training
      if (loss && optimizer && learningRate && metrics.length > 0) {
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
        setCreatedFlag(true);
        alert("Successfully Created a Neural Network Model!");
      } else {
        alert(
          "Dont forget to assign Loss, Optimizer with Learning Rate and Metrics parameters. They are required to build an excellent model!"
        );
      }
    } else {
      alert(
        "Number of layers less than 2 is Only A Dream of building an excellent Neural Network Model!"
      );
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

  const trainModel = async () => {
    if (!tfvis.visor().isOpen()) tfvis.visor().open();
    setTrainedFlag(false);

    // const { onEpochEnd } = tfvis.show.fitCallbacks({ name: "Training Performance" }, ["loss"]);

    const trainLogs = [];
    // const lossContainer = document.getElementById("loss-cont");
    const lblTensor =
      labelTrainTensor.rank === 1
        ? labelTrainTensor.clone()
        : labelTrainTensor.clone().reshape([-1]);
    const medianLabelArray = Array.from(lblTensor.dataSync());
    const medianLabel = Stats.calcMedian(medianLabelArray);
    // //Calculate the median label value of the label tensor
    // if (lblTensor.size % 2 === 0) {
    //   medianLabel = Stats.calcMean(medianLabelArray.slice(lblTensor.size / 2 - 1, 2));
    // } else {
    //   medianLabel = Stats.calcMean(medianLabelArray.slice(lblTensor.size / 2, 1));
    // }

    if (!model) {
      alert("Create the Model before training the model!");
    } else {
      if (!featureTrainTensor || !labelTrainTensor) {
        alert("Assign the Feature and Label Columns before training the model!");
      } else {
        if (epochs > 1) {
          await model.fit(featureTrainTensor, labelTrainTensor, {
            batchSize: batchSize,
            epochs: epochs,
            shuffle: true,
            validationSplit: validationSplit,
            callbacks: {
              onEpochEnd: async (epoch, logs) => {
                // tfvis.show.fitCallbacks({ name: "Training Performance", tab: "Training" }, [
                //   "loss",
                // ]);
                trainLogs.push({
                  loss: logs.loss,
                  val_loss: logs.val_loss,
                  rmse_med: Math.sqrt(logs.loss) / medianLabel,
                  val_rmse_med: Math.sqrt(logs.val_loss) / medianLabel,
                  mae: logs.meanAbsoluteError,
                  val_mae: logs.val_meanAbsoluteError,
                  med_saleprice: medianLabel * (maxAdjPrice - minAdjPrice) + minAdjPrice,
                  norm_med_saleprice: medianLabel,
                  binAccuracy: logs.binaryAccuracy,
                  val_binAccuracy: logs.val_binaryAccuracy,
                });
                tfvis.show.history({ name: "Median Sale Price", tab: "Training" }, trainLogs, [
                  "med_saleprice",
                ]);
                tfvis.show.history(
                  { name: "Normalized Median Sale Price", tab: "Training" },
                  trainLogs,
                  ["norm_med_saleprice"]
                );

                tfvis.show.history(
                  { name: "Loss and Loss vs Median Price", tab: "Training" },
                  trainLogs,
                  ["loss", "rmse_med", "val_rmse_med"]
                );
                tfvis.show.history({ name: "Mean Absolute Error", tab: "Training" }, trainLogs, [
                  "mae",
                  "val_mae",
                ]);
                tfvis.show.history({ name: "Binaray Accuracy", tab: "Training" }, trainLogs, [
                  "binAccuracy",
                  "val_binAccuracy",
                ]);
              },
            },
          });

          setTrainLoss(trainLogs.slice(-1)[0].loss); //take the last epoch loss as final train loss
          setModel(dispatch, model);
          setTrainedFlag(true);
          setCreatedFlag(false);
          alert("Model Successfully Trained!");
        } else {
          alert("Epochs less than 1 couldn't train a best model!");
        }
      }
    }
  };

  const saveModel = async () => {
    if (!model) {
      alert("No model is ready to be saved. Create one and train it first!");
    } else {
      const saveResult = await model.save(`downloads://${ModelID}`);
      const dateSaved = saveResult.modelArtifactsInfo.dataSaved;
      alert(`Model Trained and Saved at ${dateSaved}`);
    }
    setCreatedFlag(false);
    setTrainedFlag(false);
    setTestedFlag(false);
  };

  const testModel = async () => {
    if (tfvis.visor().isOpen()) tfvis.visor().close();
    if (!model) {
      alert("No model loaded for testing purpose.");
    } else {
      let testingLoss;
      if (!featureTestTensor || !labelTestTensor) {
        alert("No features or labels assigned in testing data.");
      } else {
        const lossTensor = model.evaluate(featureTestTensor, labelTestTensor);
        testingLoss = await lossTensor[0].dataSync();
        setTestLoss(testingLoss[0]);
        setTrainedFlag(false);
        setTestedFlag(true);
      }
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
      <Grid container spacing={5}>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center" }}>
          <ArgonBox sx={{ mb: 2 }}>
            <ArgonButton
              color={darkMode ? "dark" : "white"}
              component="label"
              // variant={darkSidenav ? "outlined" : "gradient"}
              variant="gradient"
              onClick={handleTrainHiddenClick}
            >
              Load Training Data{"   "}
              {trainData && (
                <span>
                  <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
                </span>
              )}
            </ArgonButton>
            <input
              ref={hiddenTrainFileInput}
              onChange={handleLoadTrainingData}
              accept=".xlsx"
              type="file"
              style={{ display: "none" }}
            />
          </ArgonBox>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "left" }}>
          <ArgonBox sx={{ mb: 2 }}>
            <ArgonButton
              color={darkMode ? "dark" : "white"}
              component="label"
              // variant={darkSidenav ? "outlined" : "gradient"}
              variant="gradient"
              onClick={handleTestHiddenClick}
            >
              Load Testing Data{"   "}
              {testData && (
                <span>
                  <FileOpenIcon sx={{ color: darkMode ? "white" : "black", mt: 0.5, ml: 1 }} />
                </span>
              )}
            </ArgonButton>
            <input
              ref={hiddenTestFileInput}
              onChange={handleLoadTestingData}
              accept=".xlsx"
              type="file"
              style={{ display: "none" }}
            />
          </ArgonBox>
        </Grid>
      </Grid>

      {!trainData || !testData ? (
        <ArgonBox height="60px" />
      ) : (
        <ArgonBox mt={5} mb={3}>
          <Grid container mb={3}>
            <Grid item xl={12}>
              <Card>
                <ArgonBox m={3}>
                  <DataTable
                    columns={trainData.columns}
                    rows={trainData.rows}
                    title="Training Data Set"
                  />
                </ArgonBox>
              </Card>
            </Grid>
          </Grid>
          <Grid container mt={3} mb={3}>
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
                  <Tab
                    label={
                      !featureColumns && !labelColumns
                        ? "Features-Labels"
                        : "Assigned-Features-Labels"
                    }
                    {...a11yProps(0)}
                  />
                  <Tab label="Build-Model" {...a11yProps(1)} />
                  {/* <Tab label="Test-Model" {...a11yProps(2)} /> */}
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
            {featureColumns && labelColumns ? (
              <Card>
                <ArgonBox pt={2} pl={2} pr={2}>
                  <ArgonBox pl={3} mt={2} mb={0}>
                    <ArgonTypography variant="h4" fontWeight="bold">
                      Configure Neural Network Model
                    </ArgonTypography>
                  </ArgonBox>
                  <Card sx={{ m: 2, p: 2 }}>
                    <ArgonBox pl={2} mb={1}>
                      <ArgonTypography
                        display="flex"
                        alignItems="center"
                        variant="h5"
                        fontWeight="medium"
                      >
                        Model&nbsp;&nbsp;Layers&nbsp;&nbsp;
                        <ArgonButton variant="gradient" color="info" iconOnly onClick={addLayer}>
                          <Icon>add</Icon>
                        </ArgonButton>
                        {Object.keys(dndColumns).length > 0 && (
                          <span style={{ fontSize: "0.8em" }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;Total&nbsp;&nbsp;Layers:&nbsp;&nbsp;{numLayers}
                            &nbsp;&nbsp;&nbsp;&nbsp;#Features:&nbsp;&nbsp;
                            {dndColumns.featureCols.length}
                            &nbsp;&nbsp;&nbsp;&nbsp;#Labels:&nbsp;&nbsp;
                            {dndColumns.labelCols.length}
                          </span>
                        )}
                      </ArgonTypography>
                    </ArgonBox>
                    <ArgonBox
                      minHeight="300px"
                      pr={2}
                      mr={3}
                      sx={{ overflowX: "hidden", overflowY: "auto" }}
                    >
                      {layers.length > 0 &&
                        layers.map((layer, index) => {
                          return (
                            <Grid
                              container
                              spacing={2}
                              sx={{
                                p: 1,
                                m: 1,
                                boxShadow: 1,
                                borderRadius: 2,
                              }}
                              key={index}
                            >
                              <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}>
                                <ArgonTypography
                                  display="flex"
                                  alignItems="center"
                                  variant="button"
                                >
                                  Units&nbsp;
                                  <ArgonInput
                                    type="number"
                                    name="units"
                                    id={index}
                                    size="medium"
                                    value={layer.units}
                                    onChange={onChangeLayers}
                                  />
                                </ArgonTypography>
                              </Grid>
                              <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}>
                                <ArgonTypography
                                  display="flex"
                                  alignItems="center"
                                  variant="button"
                                >
                                  Activation&nbsp;
                                  <Select
                                    options={Activations}
                                    value={Activations.filter((col) => {
                                      return layer.activation !== "Reset"
                                        ? col.value === layer.activation
                                        : null;
                                    })}
                                    onChange={onChangeActivation(index)}
                                    label="Activation"
                                    placeholder="Activation"
                                    styles={{
                                      menu: (base) => ({
                                        ...base,
                                        minWidth: "100%",
                                        width: "max-content",
                                      }),
                                    }}
                                    maxMenuHeight={200}
                                  />
                                </ArgonTypography>
                              </Grid>
                              <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}>
                                <ArgonTypography
                                  display="flex"
                                  alignItems="center"
                                  variant="button"
                                >
                                  Use&nbsp;Bias&nbsp;?
                                  <input
                                    type="checkbox"
                                    name="useBias"
                                    id={index}
                                    size="medium"
                                    value={layer.useBias}
                                    checked={layer.useBias}
                                    onChange={onChangeLayers}
                                    style={{ padding: "12px", margin: "12px" }}
                                  />
                                </ArgonTypography>
                              </Grid>
                              {index === 0 ? (
                                <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}>
                                  <ArgonTypography
                                    display="flex"
                                    alignItems="center"
                                    variant="button"
                                  >
                                    InputDim&nbsp;
                                    <ArgonInput
                                      type="number"
                                      name="inputDim"
                                      id={index}
                                      size="medium"
                                      value={layer.inputDim}
                                      onChange={onChangeLayers}
                                    />
                                  </ArgonTypography>
                                </Grid>
                              ) : (
                                <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}></Grid>
                              )}

                              <Grid item xs={12} md={2} sx={{ justifyContent: "center" }}>
                                <ArgonButton
                                  variant="gradient"
                                  color="warning"
                                  id={index}
                                  iconOnly
                                  disabled={index === 0 ? true : false}
                                  onClick={removeLayer(index)}
                                >
                                  <Icon>delete</Icon>
                                </ArgonButton>
                              </Grid>
                            </Grid>
                          );
                        })}
                    </ArgonBox>
                  </Card>
                  <Card sx={{ m: 2, p: 2 }}>
                    <ArgonBox pl={2}>
                      <ArgonTypography
                        display="flex"
                        alignItems="center"
                        variant="h5"
                        fontWeight="medium"
                      >
                        Model&nbsp;&nbsp;Compiler&nbsp;&nbsp;
                      </ArgonTypography>
                    </ArgonBox>
                    <ArgonBox
                      minHeight="150px"
                      pr={2}
                      mr={3}
                      sx={{ overflowX: "hidden", overflowY: "auto" }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Loss&nbsp;
                            <Select
                              options={Losses}
                              name="loss"
                              value={Losses.filter((ls) => {
                                return loss !== "Reset" ? ls.value === loss : null;
                              })}
                              onChange={onChangeLoss}
                              label="Loss"
                              placeholder="Loss"
                              styles={{
                                menu: (base) => ({
                                  ...base,
                                  minWidth: "100%",
                                  width: "max-content",
                                }),
                              }}
                              maxMenuHeight={250}
                            />
                          </ArgonTypography>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Optimizer&nbsp;
                            <Select
                              options={Optimizers}
                              name="optimizer"
                              value={Optimizers.filter((op) => {
                                return optimizer !== "Reset" ? op.value === optimizer : null;
                              })}
                              onChange={onChangeOptimizer}
                              label="Optimizer"
                              placeholder="Optimizer"
                              styles={{
                                menu: (base) => ({
                                  ...base,
                                  minWidth: "100%",
                                  width: "max-content",
                                }),
                              }}
                            />
                            <ArgonTypography display="flex" alignItems="center" variant="button">
                              &nbsp;&nbsp;Learning&nbsp;Rate&nbsp;
                              <ArgonInput
                                type="number"
                                name="learningRate"
                                size="medium"
                                value={learningRate}
                                onChange={onChangeLearningRate}
                              />
                            </ArgonTypography>
                          </ArgonTypography>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Metrics&nbsp;
                            <Select
                              options={Metrics}
                              name="metrics"
                              value={Metrics.filter((mt) => {
                                return metrics !== "Reset" ? mt.value === metrics : null;
                              })}
                              onChange={onChangeMetrics}
                              label="Metrics"
                              placeholder="Metrics"
                              styles={{
                                menu: (base) => ({
                                  ...base,
                                  minWidth: "100%",
                                  width: "max-content",
                                }),
                              }}
                              maxMenuHeight={250}
                            />
                          </ArgonTypography>
                        </Grid>
                      </Grid>
                    </ArgonBox>
                  </Card>
                  <Card sx={{ m: 2, p: 2 }}>
                    <ArgonBox pl={2}>
                      <ArgonTypography
                        display="flex"
                        alignItems="center"
                        variant="h5"
                        fontWeight="medium"
                      >
                        Train&nbsp;&nbsp;Parameters&nbsp;&nbsp;
                      </ArgonTypography>
                    </ArgonBox>
                    <ArgonBox
                      minHeight="150px"
                      pr={2}
                      mr={3}
                      sx={{ overflowX: "hidden", overflowY: "auto" }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Batch&nbsp;Size&nbsp;
                            <ArgonInput
                              type="number"
                              name="batchSize"
                              size="medium"
                              value={batchSize}
                              onChange={onChangeBatchSize}
                            />
                          </ArgonTypography>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Epochs&nbsp;&nbsp;
                            <ArgonInput
                              type="number"
                              name="epochs"
                              size="medium"
                              value={epochs}
                              onChange={onChangeEpochs}
                            />
                          </ArgonTypography>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{ justifyContent: "center", p: 2, m: 2 }}>
                          <ArgonTypography display="flex" alignItems="center" variant="button">
                            Validation&nbsp;Split&nbsp;
                            <ArgonInput
                              type="number"
                              name="validationSplit"
                              size="medium"
                              value={validationSplit}
                              onChange={onChangeValidationSplit}
                            />
                          </ArgonTypography>
                        </Grid>
                      </Grid>
                    </ArgonBox>
                  </Card>
                </ArgonBox>
                {trainLoss && testLoss && (
                  <Grid container spacing={3} mt={3} mb={5}>
                    <Grid item xs={12} md={3}></Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ justifyContent: "center", alignItems: "center", pl: 15, pr: 15 }}
                    >
                      <MiniStatisticsCard
                        title={{ text: "Train Loss" }}
                        count={trainLoss.toFixed(5)}
                        icon={{ color: "primary", component: "error" }}
                        bgColor="primary"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ justifyContent: "center", alignItems: "center", pl: 15, pr: 15 }}
                    >
                      <MiniStatisticsCard
                        title={{ text: "Test Loss" }}
                        count={testLoss.toFixed(5)}
                        icon={{ color: "primary", component: "error" }}
                        bgColor="primary"
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container spacing={3} mb={5} mt={3}>
                  <Grid item xs={12} md={2}>
                    <ArgonBox m={2}></ArgonBox>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <ArgonButton variant="gradient" color="primary" onClick={createModel}>
                      Create Model
                    </ArgonButton>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      disabled={!createdFlag}
                      onClick={trainModel}
                    >
                      Train Model
                    </ArgonButton>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      disabled={!trainedFlag}
                      onClick={testModel}
                    >
                      Test Model
                    </ArgonButton>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <ArgonButton
                      variant="gradient"
                      color="primary"
                      disabled={!testedFlag}
                      onClick={saveModel}
                    >
                      Save Model
                    </ArgonButton>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              <Card>
                <Grid container spacing={3} m={3}>
                  <Grid item xs={12} md={12} sx={{ textAlign: "center", p: 2, m: 2 }}>
                    <ArgonTypography variant="h5" fontWeight="bold">
                      No feature and label columns assigned. They are required for creating a model.
                    </ArgonTypography>
                  </Grid>
                </Grid>
              </Card>
            )}
          </TabPanel>
        </ArgonBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default ModelBuilding;
