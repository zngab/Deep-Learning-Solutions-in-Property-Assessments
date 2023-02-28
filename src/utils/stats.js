import * as StatsUtils from "./statsUtils";
import { orderBy } from "natural-orderby";
import * as DlvUtils from "./dlv_utils";
// import { jStat } from 'jstat';
var { jStat } = require("jstat");
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

/** Calculate the mean value of an array of values
 *
 * @arg array
 * @return mixed
 */
const calcMean = (arr) => {
  let a = arr.slice();
  if (a.length) {
    const sum = calcSum(a);
    const avg = sum / a.length;
    return avg;
  }
  return -9999;
};
const _calcMean = calcMean;
export { _calcMean as calcMean };

/** Extract the maximum in an array of values
 *
 * @arg arr - array
 * @return float
 */
const calcMax = (arr) => {
  return Math.max(...arr);
};
const _calcMax = calcMax;
export { _calcMax as calcMax };

/** Get the index of absolute maximum in an array of values
 *
 * @arg arr - array
 * @return float
 */
const getIndexOfAbsMax = (arr) => {
  if (arr && arr.length > 0) {
    let absArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (StatsUtils.isNumber(arr[i])) {
        absArr.push(Math.abs(parseFloat(arr[i])));
      } else absArr.push(0);
    }

    const maxIndex = absArr.indexOf(Math.max(...absArr));
    return maxIndex;
  } else return -9999;
};
const _getIndexOfAbsMax = getIndexOfAbsMax;
export { _getIndexOfAbsMax as getIndexOfAbsMax };

/** Calculate the Median of an array of values
 *  return -9999 if arr is empty or null
 */
const calcMedian = (arr) => {
  if (arr && arr.length > 0) {
    let a = arr.slice();
    const hf = Math.floor(a.length / 2);
    arr = sortArr(a);
    if (a.length % 2) {
      return parseFloat(arr[hf]);
    } else {
      return (parseFloat(arr[hf - 1]) + parseFloat(arr[hf])) / 2.0;
    }
  } else return -9999;
};
const _calcMedian = calcMedian;
export { _calcMedian as calcMedian };

/** Extract the maximum in an array of values
 * return -9999 if arr is empty or null
 * @arg arr - array
 * @return float
 */
const calcMin = (arr) => {
  if (arr && arr.length > 0) {
    return Math.min(...arr);
  } else return -9999;
};
const _calcMin = calcMin;
export { _calcMin as calcMin };

/** Get the index of absolute minimum in an array of values
 * return -9999 if arr is empty or null
 * @arg arr - array
 * @return float
 */
const getIndexOfAbsMin = (arr) => {
  if (arr && arr.length > 0) {
    const absArr = arr.map((a) => Math.abs(a));
    const indexMin = absArr.indexOf(Math.min(...absArr));
    return indexMin;
  } else return -9999;
};
const _getIndexOfAbsMin = getIndexOfAbsMin;
export { _getIndexOfAbsMin as getIndexOfAbsMin };

/** Calculate the Modal value
 *  return -9999 if arr is empty or null
 * @arg arr - array
 * @return float
 */
const calcMode = (arr) => {
  if (arr && arr.length > 0) {
    let ary = arr.slice();
    const t = ary.sort(function (a, b) {
      const aAry = ary.filter(function (val) {
        return val === a && a;
      });
      const bAry = ary.filter(function (val) {
        return val === b && b;
      });
      return aAry.length - bAry.length;
    });
    return t.pop();
  } else return -9999;
};
const _calcMode = calcMode;
export { _calcMode as calcMode };

/** Calculate the 'p' percentile of an array of values
 *
 * @arg arr - array of values
 * @arg p - percentile to calculate (e.g. 0.95)
 */
const calcPercentile = (arr, p) => {
  let a = arr.slice();

  // Sort the array into ascending order
  let data = sortArr(a);

  // Work out the position in the array of the percentile point
  let pctl = (data.length - 1) * p;
  let b = Math.floor(pctl);

  // Work out what we rounded off (if anything)
  let remainder = pctl - b;

  // See whether that data exists directly
  if (data[b + 1] !== undefined) {
    return parseFloat(data[b]) + remainder * (parseFloat(data[b + 1]) - parseFloat(data[b]));
  } else {
    return parseFloat(data[b]);
  }
};
const _calcPercentile = calcPercentile;
export { _calcPercentile as calcPercentile };

/** Calculate the range for a set of values
 *  return -9999 if arr is empty or null
 * @arg arr - array
 * @return float
 */
const calcRange = (arr) => {
  if (arr && arr.length > 0) {
    const mx = calcMax(arr);
    const mn = calcMin(arr);
    return mx - mn;
  } else return -9999;
};
const _calcRange = calcRange;
export { _calcRange as calcRange };

/** Sum all values in an array
 *  return -9999 if arr is empty or null
 */
const calcSum = (arr) => {
  if (arr && arr.length > 0) {
    let a = arr.slice();
    let sum = 0.0;
    a.forEach((num) => (sum += StatsUtils.isNumber(num) ? parseFloat(num) : 0));
    // return a.reduce(function (a, b) {
    //   return parseFloat(a) + parseFloat(b);
    // });
    return sum;
  } else return -9999;
};
const _calcSum = calcSum;
export { _calcSum as calcSum };

/** Sort values into ascending order
 *
 */
const sortArr = (arr) => {
  let ary = arr.slice();
  ary.sort(function (a, b) {
    return parseFloat(a) - parseFloat(b);
  });
  return ary;
};
const _sortArr = sortArr;
export { _sortArr as sortArr };

/** Calculate the standard deviation of an array
 *  return -9999 if arr is empty.
 */
const calcStdev = (arr, usePopulation = true) => {
  if (arr && arr.length > 0) {
    const mean = calcMean(arr);
    return Math.sqrt(
      arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
        (arr.length - (usePopulation ? 0 : 1))
    );
  } else return -9999;
};
const _calcStdev = calcStdev;
export { _calcStdev as calcStdev };

/** Calculate the coletiance of an array
 *
 */
const calcCov = (arr) => {
  const stdev = calcStdev(arr);
  return Math.pow(stdev, 2);
};
const _calcCov = calcCov;
export { _calcCov as calcCov };

/** Calculate the COD (Coefficient of Dispersion)
 *  of the ASR array
 */
const calcCOD = (arr) => {
  const med = calcMedian(arr);
  const avgAbsDev = calcAvgAbsDevMed(arr);
  if (avgAbsDev !== -9999) {
    return (avgAbsDev * 100) / med;
  } else return -9999;
};
const _calcCOD = calcCOD;
export { _calcCOD as calcCOD };

/** Calculate the PRD (Price Related Differential)
 *
 */
const calcPRD = (arrAsmt, arrAdjSP) => {
  let meanAsr = 0,
    sumAsmt = 0,
    sumSp = 0,
    prd = 0;
  let asrArr = [];
  if (arrAsmt.length === arrAdjSP.length) {
    for (let i = 0; i < arrAsmt.length; i++) {
      if (arrAdjSP[i] > 0) {
        asrArr.push(arrAsmt[i] / arrAdjSP[i]);
        sumAsmt += arrAsmt[i];
        sumSp += arrAdjSP[i];
      }
    }
    meanAsr = calcMean(asrArr);
    prd = sumAsmt > 0 && sumSp > 0 ? meanAsr / (sumAsmt / sumSp) : -9999;
    return prd;
  } else return -9999;
};
const _calcPRD = calcPRD;
export { _calcPRD as calcPRD };

/** Calculate the PRB (Price Related Bias)
 *
 */
const calcPRB = (arrAsmt, arrAdjSP) => {
  let medianAsr = 0;
  let prb = {};
  let asrArr = [],
    indepArr = [],
    depArr = [];
  if (arrAsmt.length === arrAdjSP.length) {
    for (let i = 0; i < arrAsmt.length; i++) {
      if (arrAdjSP[i] > 0) asrArr.push(arrAsmt[i] / arrAdjSP[i]);
    }
    medianAsr = calcMedian(asrArr);

    for (let i = 0; i < arrAsmt.length; i++) {
      if (medianAsr > 0 && arrAdjSP[i] > 0) {
        indepArr.push(
          Math.log(0.5 * arrAdjSP[i] + 0.5 * (arrAsmt[i] / medianAsr)) / Math.log(2) //natural logarithm
        );
        depArr.push((asrArr[i] - medianAsr) / medianAsr);
      }
    }

    const result = simpleLinearRegression(depArr, indepArr);
    prb.prb = result.slope;
    prb.t_value = result.t_test_slope;
    return prb;
  } else return null;
};
const _calcPRB = calcPRB;
export { _calcPRB as calcPRB };

/** Calculate the average absolute deviation from Median of an array
 *  return a float value. When return -9999 if array is empty or null
 */
const calcAvgAbsDevMed = (arr) => {
  const median = calcMedian(arr);
  const newArr = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      newArr.push(Math.abs(arr[i] - median));
    }
    return calcSum(newArr) / arr.length;
  } else return -9999;
};
const _calcAvgAbsDevMed = calcAvgAbsDevMed;
export { _calcAvgAbsDevMed as calcAvgAbsDevMed };

/** Calculate the average absolute deviation from Median of an array
 *  return a float value. When return -9999 if array is empty or null
 */
const calcAvgAbsDevValue = (arr, benchmark) => {
  const newArr = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      newArr.push(Math.abs((arr[i] - benchmark) / 100));
    }
    return calcSum(newArr) / arr.length;
  } else return -9999;
};
const _calcAvgAbsDevValue = calcAvgAbsDevValue;
export { _calcAvgAbsDevValue as calcAvgAbsDevValue };

/** Calculate the average absolute deviation of an array from a benchmark array
 *  return a float value. When return -9999 if array is empty or null or length
 *  of both arrays is not equal.
 */
const calcAvgAbsDevBchArr = (arr, bchArr) => {
  if (arr && bchArr && arr.length === bchArr.length) {
    const newArr = [];
    let crossBenchmark = false;
    let numPositive = 0,
      numNegative = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > bchArr[i]) numPositive++;
      if (arr[i] < bchArr[i]) numNegative++;
      newArr.push(Math.abs((arr[i] - bchArr[i]) / 100));
    }
    if (numPositive > 0 && numNegative > 0 && numPositive + numNegative > 2) crossBenchmark = true;
    return [calcSum(newArr) / arr.length, crossBenchmark];
  } else return [-9999, false];
};
const _calcAvgAbsDevBchArr = calcAvgAbsDevBchArr;
export { _calcAvgAbsDevBchArr as calcAvgAbsDevBchArr };

/** Calculate the average squared erros from a benchmark value to
 *  return a float value. When return -9999 if array is empty or null
 */
const calcMSEValue = (arr, benchmark) => {
  const newArr = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      newArr.push(Math.pow((arr[i] - benchmark) / 100, 2));
    }
    return calcSum(newArr) / arr.length;
  } else return -9999;
};
const _calcMSEValue = calcMSEValue;
export { _calcMSEValue as calcMSEValue };

/** Calculate the average squared error between subject array and a benchmark array
 *  return a float value. When return -9999 if array is empty or null or length
 *  of both arrays is not equal.
 */
const calcMSEBchArr = (arr, bchArr) => {
  if (arr && bchArr && arr.length === bchArr.length) {
    const newArr = [];
    let crossBenchmark = false;
    let numPositive = 0,
      numNegative = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > bchArr[i]) numPositive++;
      if (arr[i] < bchArr[i]) numNegative++;
      newArr.push(Math.pow((arr[i] - bchArr[i]) / 100, 2));
    }
    if (numPositive > 0 && numNegative > 0 && numPositive + numNegative > 2) crossBenchmark = true;
    return [calcSum(newArr) / arr.length, crossBenchmark];
  } else return [-9999, false];
};
const _calcMSEBchArr = calcMSEBchArr;
export { _calcMSEBchArr as calcMSEBchArr };

/** Calculate the quality score with assessor's taf comparing to the benchmark taf
 * array. Assessor's taf needs to be filled using auditor's factor when there is factor
 * missing between adjacent months. This function will return a float value.
 */
const calcTimeAdjQualityScore = (arr, bchArr) => {
  let arrCopy = arr.slice();
  let benchArr = bchArr.slice();
  let assrArr = [];
  let bchTaf, assrTaf;
  const deductionCoef = 6;
  const shapeAdj = 0.1;

  for (let i = 0; i < benchArr.length; i++) {
    const found = arrCopy.find((a) => a.month === benchArr[i].month);
    if (found) {
      assrArr.push(found);
    } else {
      assrArr.push(benchArr[i]);
    }
  }

  const benchmarkTaf = benchArr.map((item) => parseFloat(item.factor));
  const assrArrTaf = assrArr.map((item) => parseFloat(item.factor));

  // if (benchmarkTaf.length > 12) {
  //   bchTaf = benchmarkTaf.slice(24);
  //   assrTaf = assrArrTaf.slice(24);
  // } else {
  bchTaf = benchmarkTaf.slice();
  assrTaf = assrArrTaf.slice();
  // }

  let avgAssrTaf = calcMean(assrTaf);
  let avgBchTaf = calcMean(bchTaf);
  let indexOfAbsMaxAssrTaf = getIndexOfAbsMax(assrTaf);

  let qualityScore = 0.0;
  let modifiedBchTaf = [];
  let adjusted = false;

  if (bchTaf[0] === 0 && avgBchTaf === 0) {
    if (avgAssrTaf === 0) {
      qualityScore = 1.0;
      return qualityScore;
    } else {
      adjusted = true;
      for (let i = 0; i < bchTaf.length; i++) {
        modifiedBchTaf.push(assrTaf[indexOfAbsMaxAssrTaf]);
      }
    }
  } else {
    modifiedBchTaf = bchTaf.slice();
    if (modifiedBchTaf[0] * assrTaf[0] < 0) adjusted = true;
  }

  // let avgModBchTaf = calcMean(modifiedBchTaf);
  // const [mae, crossBchmark] = calcAvgAbsDevBchArr(assrTaf, modifiedBchTaf);
  const [mse, crossBchmark] = calcMSEBchArr(assrTaf, modifiedBchTaf);

  // qualityScore = adjusted
  //   ? 1 - mae / (3 * Math.abs(modifiedBchTaf[0])) // if Auditor's taf have been manually set to all ZEROS
  //   : 1 - mae / (2 * Math.abs(modifiedBchTaf[0])); // a milder calculation is to use bchTaf[0] as the denominator.

  qualityScore = adjusted
    ? 1 - Math.sqrt(mse) * (deductionCoef + 2) // if Auditor's taf have been manually set to all ZEROS or two trends are totally opposite
    : 1 - Math.sqrt(mse) * deductionCoef; // normal deduction coefficient applied.
  if (crossBchmark) qualityScore -= shapeAdj; // a penalty of shape adjustment (sawtooth shape) deduction from calculated score

  return qualityScore.toFixed(3);
};
const _calcTimeAdjQualityScore = calcTimeAdjQualityScore;
export { _calcTimeAdjQualityScore as calcTimeAdjQualityScore };

/** Calculate the correlation coefficients between two arrays
 *
 */
const calcCorrCoeff = (...args) => {
  const [arrays, options] = StatsUtils.manageInput(args);

  const isInputValid = StatsUtils.checkInput(arrays);
  if (!isInputValid) throw new Error("Input not valid");

  const [x, y] = arrays;

  const µ = { x: calcMean(x), y: calcMean(y) };
  const s = { x: calcStdev(x), y: calcStdev(y) };

  const addedMultipliedDifferences = x
    .map((val, i) => (val - µ.x) * (y[i] - µ.y))
    .reduce((sum, v) => sum + v, 0);

  const dividedByDevs = addedMultipliedDifferences / (s.x * s.y);

  const r = dividedByDevs / (x.length - 1);

  // return string?
  if (options.returnString === true) return r.toFixed(options.returnDecimals);
  // default return
  return StatsUtils.preciseRound(r, options.returnDecimals);
};
const _calcCorrCoeff = calcCorrCoeff;
export { _calcCorrCoeff as calcCorrCoeff };

/**
 * Calculate frequencies in Array.
 *
 * @param {array} arr
 * @returns {*} an object (ex: { a: 4, b: 2, c: 1 })
 *
 * @example calcFreq(["a", "b", "a", "c", "a", "a", "b"]); // { a: 4, b: 2, c: 1 }
 */
const calcFreq = (arr) =>
  arr.reduce((a, v) => {
    a[v] = a[v] ? a[v] + 1 : 1;
    return a;
  }, {});
const _calcFreq = calcFreq;
export { _calcFreq as calcFreq };

/**
 * Change '' to 'Blank' in an array of String.
 *
 * @param {array} arr
 * @returns [*] an array
 *
 * @example replaceBlankInArr(["", "b", "c", "d", "a", "e", "f"]); // ["Blank", "b", "c", "d", "a", "e", "f"]
 */
const replaceBlankInArr = (arr) => arr.forEach((a) => (a === "" ? "Blank" : a));
const _replaceBlankInArr = replaceBlankInArr;
export { _replaceBlankInArr as replaceBlankInArr };

/**
 * Create Pivot Table.
 *
 * @param {dataSet - array of data objects; rowCategory, colCategory, thirdCategory - String}
 * @returns {*} an object
 *
 */
const createPivotTable = (dataSet, rowCategory, colCategory, thirdCategory = null) => {
  let output = {
    message: "",
    tableData: null,
    tableLevel: 2,
    rowCtgValues: [],
    colCtgValues: [],
    thirdCtgValues: [],
  };
  if (Array.isArray(dataSet) && dataSet.length > 0) {
    let baseData = dataSet.slice();
    let rowCtgValues = [],
      colCtgValues = [],
      thirdCtgValues = [];
    let table = [];

    if (rowCategory && colCategory && rowCategory in baseData[0] && colCategory in baseData[0]) {
      rowCtgValues = orderBy([
        ...new Set(
          baseData.map((data) =>
            typeof data[rowCategory] === "string"
              ? data[rowCategory]
              : StatsUtils.isNumber(data[rowCategory])
              ? parseInt(data[rowCategory]).toString()
              : data[rowCategory]
          )
        ),
      ]);
      replaceBlankInArr(rowCtgValues);
      output = { ...output, rowCtgValues: rowCtgValues };

      colCtgValues = orderBy([
        ...new Set(
          baseData.map((data) =>
            typeof data[colCategory] === "string"
              ? data[colCategory]
              : StatsUtils.isNumber(data[colCategory])
              ? parseInt(data[colCategory]).toString()
              : data[colCategory]
          )
        ),
      ]);
      replaceBlankInArr(colCtgValues);
      output = { ...output, colCtgValues: colCtgValues };

      if (thirdCategory) {
        if (thirdCategory in baseData[0]) {
          for (let i = 0; i < baseData.length; i++) {
            thirdCtgValues = orderBy([
              ...new Set(
                baseData.map((data) =>
                  typeof data[thirdCategory] === "string"
                    ? data[thirdCategory]
                    : StatsUtils.isNumber(data[thirdCategory])
                    ? parseInt(data[thirdCategory]).toString()
                    : data[thirdCategory]
                )
              ),
            ]);
            replaceBlankInArr(thirdCtgValues);
            output = { ...output, thirdCtgValues: thirdCtgValues };
          }
        } else {
          output = { ...output, message: "No Third Category Found." };
          return output;
        }
      }
      if (thirdCtgValues.length > 0) {
        output = { ...output, tableLevel: 3 };
        for (let i = 0; i < thirdCtgValues.length; i++) {
          let firstFilteredData = baseData.slice();
          firstFilteredData =
            thirdCtgValues[i] === "Blank"
              ? baseData.filter((data) => data[thirdCategory] === "")
              : baseData.filter((data) =>
                  StatsUtils.isNumber(data[thirdCategory])
                    ? data[thirdCategory].toString() === thirdCtgValues[i]
                    : data[thirdCategory] === thirdCtgValues[i]
                );
          for (let j = 0; j < rowCtgValues.length; j++) {
            let secondFilteredData = firstFilteredData.slice();
            secondFilteredData =
              rowCtgValues[j] === "Blank"
                ? firstFilteredData.filter((data) => data[rowCategory] === "")
                : firstFilteredData.filter((data) =>
                    StatsUtils.isNumber(data[rowCategory])
                      ? data[rowCategory].toString() === rowCtgValues[j]
                      : data[rowCategory] === rowCtgValues[j]
                  );
            const colObj = {
              [thirdCategory]: thirdCtgValues[i],
              [rowCategory]: rowCtgValues[j],
            };
            let rowTotal = 0;
            for (let k = 0; k < colCtgValues.length; k++) {
              let thirdFilteredData = secondFilteredData.slice();
              thirdFilteredData =
                colCtgValues[k] === "Blank"
                  ? secondFilteredData.filter((data) => data[colCategory] === "")
                  : secondFilteredData.filter((data) =>
                      StatsUtils.isNumber(data[colCategory])
                        ? data[colCategory].toString() === colCtgValues[k]
                        : data[colCategory] === colCtgValues[k]
                    );
              colObj[colCtgValues[k]] = thirdFilteredData.length;
              rowTotal += thirdFilteredData.length;
            }
            colObj["RowTotal"] = rowTotal;
            // colObj["id"] = j;
            table.push(colObj);
          }
          const colTotalObj = {
            [thirdCategory]: thirdCtgValues[i],
            [rowCategory]: "ColumnTotal",
          };
          let total = 0;
          for (let j = 0; j < colCtgValues.length; j++) {
            let colTotal = 0;
            for (let k = 0; k < rowCtgValues.length; k++) {
              colTotal += table[k + i * (rowCtgValues.length + 1)][colCtgValues[j]];
            }
            colTotalObj[colCtgValues[j]] = colTotal;
            total += colTotal;
          }
          colTotalObj["RowTotal"] = total;
          table.push(colTotalObj);
        }
        // Calculate Table Total
        const tableTotalObj = {
          [thirdCategory]: "ALL",
          [rowCategory]: "TableTotal",
        };
        let tblTotal = 0;
        for (let l = 0; l < colCtgValues.length; l++) {
          let colTotal = 0;
          for (let m = 0; m < thirdCtgValues.length; m++) {
            colTotal += table[rowCtgValues.length * (m + 1) + m][colCtgValues[l]];
          }
          tableTotalObj[colCtgValues[l]] = colTotal;
          tblTotal += colTotal;
        }
        tableTotalObj["RowTotal"] = tblTotal;
        table.push(tableTotalObj);
      } else {
        for (let j = 0; j < rowCtgValues.length; j++) {
          let secondFilteredData = [...baseData];
          secondFilteredData =
            rowCtgValues[j] === "Blank"
              ? baseData.filter((data) => data[rowCategory] === "")
              : baseData.filter((data) =>
                  StatsUtils.isNumber(data[rowCategory])
                    ? data[rowCategory].toString() === rowCtgValues[j]
                    : data[rowCategory] === rowCtgValues[j]
                );
          const colObj = { [rowCategory]: rowCtgValues[j] };
          let rowTotal = 0;
          for (let k = 0; k < colCtgValues.length; k++) {
            let thirdFilteredData = [...secondFilteredData];
            thirdFilteredData =
              colCtgValues[k] === "Blank"
                ? secondFilteredData.filter((data) => data[colCategory] === "")
                : secondFilteredData.filter((data) =>
                    StatsUtils.isNumber(data[colCategory])
                      ? data[colCategory].toString() === colCtgValues[k]
                      : data[colCategory] === colCtgValues[k]
                  );
            colObj[colCtgValues[k]] = thirdFilteredData.length;
            rowTotal += thirdFilteredData.length;
          }
          colObj["RowTotal"] = rowTotal;
          // colObj["id"] = j;
          table.push(colObj);
        }
        const colTotalObj = { [rowCategory]: "ColumnTotal" };
        let total = 0;
        for (let j = 0; j < colCtgValues.length; j++) {
          let colTotal = 0;
          for (let k = 0; k < rowCtgValues.length; k++) {
            colTotal += table[k][colCtgValues[j]];
          }
          colTotalObj[colCtgValues[j]] = colTotal;
          total += colTotal;
        }
        colTotalObj["RowTotal"] = total;
        table.push(colTotalObj);
      }

      output = {
        ...output,
        message: "Successfully Created Pivot Table.",
        tableData: [...table],
      };
      return output;
    } else {
      output = {
        ...output,
        message:
          "Row Category and Column Category are Required. Both Categories Must Be Found in Data Set.",
      };
      return output;
    }
  } else {
    output = { ...output, message: "No Data for Creating a Pivot Table." };
    return output;
  }
};
const _createPivotTable = createPivotTable;
export { _createPivotTable as createPivotTable };

/** Generate the Simple Linear Regression model
 *  using the input of dependant value array
 *  and independant value array.
 */
const simpleLinearRegression = (arrDep, arrIndep) => {
  let r,
    sy,
    sx,
    vy,
    vx,
    n,
    SST,
    SSM,
    DFM,
    MSM,
    SSE,
    DFE,
    MSE,
    b,
    a,
    meanX,
    meanY,
    r_squared,
    adjusted_r_squared,
    sample_stdev_error,
    standard_error_regression,
    standard_error_slope,
    standard_error_constant,
    t_test_slope,
    t_test_constant,
    F_test;

  r = calcCorrCoeff(arrIndep, arrDep);
  sy = calcStdev(arrDep);
  sx = calcStdev(arrIndep);
  vy = sy * sy;
  vx = sx * sx;
  n = arrDep.length;
  meanY = calcMean(arrDep);
  meanX = calcMean(arrIndep);
  b = r * (sy / sx);
  a = meanY - meanX * b;
  r_squared = r * r;

  //Calculate the T-Test value to confirm the significance of the coefficients
  adjusted_r_squared = 1 - ((n - 1) / (n - 2)) * (1 - r_squared);
  sample_stdev_error = Math.sqrt(1 - r_squared) * sy;
  standard_error_regression = Math.sqrt(1 - adjusted_r_squared) * sy;
  standard_error_slope = (standard_error_regression / Math.sqrt(n)) * (1 / sx);
  standard_error_constant =
    (standard_error_regression / Math.sqrt(n)) * Math.sqrt(1 + (meanX * meanX) / vx);
  t_test_slope = b / standard_error_slope;
  t_test_constant = a / standard_error_constant;

  //Calculate the F-Test value to confirm the significance of the overall SLR model
  SST = vy * n;
  SSE = SST - r_squared * SST;
  SSM = SST - SSE;
  DFM = 1; //number of letiables in regression including dependant letiable and all independant letiables as p, DFM=p-1 (Corrected Degresss of Freedom for Model)
  MSM = SSM / DFM;
  DFE = n - 2; //Degrees of Freedom for Error: DFE=n-p
  MSE = SSE / DFE;
  F_test = MSM / MSE;

  //Output the SLR model with major ANOVA values
  return {
    constant: a,
    slope: b,
    r2: r_squared,
    adjr2: adjusted_r_squared,
    t_test_constant: t_test_constant,
    t_test_slope: t_test_slope,
    F_test: F_test,
  };
};
const _simpleLinearRegression = simpleLinearRegression;
export { _simpleLinearRegression as simpleLinearRegression };

/** Generate the LOESS smoothing curve
 */
const loessSmoothing = (xval, yval, bandwidth) => {
  function tricube(x) {
    let tmp = 1 - x * x * x;
    return tmp * tmp * tmp;
  }

  let res = [];

  let left = 0;
  let right = Math.floor(bandwidth * xval.length) - 1;

  for (let i in xval) {
    let x = xval[i];

    if (i > 0) {
      if (right < xval.length - 1 && xval[right + 1] - xval[i] < xval[i] - xval[left]) {
        left++;
        right++;
      }
    }

    let edge;
    if (xval[i] - xval[left] > xval[right] - xval[i]) edge = left;
    else edge = right;

    let denom = xval[edge] !== x ? Math.abs(1.0 / (xval[edge] - x)) : 0;

    let sumWeights = 0;
    let sumX = 0,
      sumXSquared = 0,
      sumY = 0,
      sumXY = 0;

    let k = left;
    while (k <= right) {
      let xk = xval[k];
      let yk = yval[k];
      let dist;
      if (k < i) {
        dist = x - xk;
      } else {
        dist = xk - x;
      }

      let w = tricube(dist * denom);
      let xkw = xk * w;
      sumWeights += w;
      sumX += xkw;
      sumXSquared += xk * xkw;
      sumY += yk * w;
      sumXY += yk * xkw;
      k++;
    }

    let meanX = sumX / sumWeights;
    let meanY = sumY / sumWeights;
    let meanXY = sumXY / sumWeights;
    let meanXSquared = sumXSquared / sumWeights;

    let beta;
    if (meanXSquared === meanX * meanX) beta = 0;
    else beta = (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX);

    let alpha = meanY - beta * meanX;

    res[i] = beta * x + alpha;
  }

  return xval.map((x, i) => {
    return { x: x, loess: res[i] };
  });
};
const _loessSmoothing = loessSmoothing;
export { _loessSmoothing as loessSmoothing };

//Generate Multiple Linear Regression model based on
//multiple independant variables and one dependant variable.
//The result model containing
// {
//   coef: [],
//   R2: value,
//   adjusted_R2: value,
//   predict: [],  //predicted values for each set of indepValue input
//   ybar: value, //mean of depValues
//   t.t: [],
//   t.p: [],
//   t.interval95: [[lower, higher],...],
//   f.F_statistics: value,
//   f.pvalue: value,
// }
const multipleLinearRegression = (depValues, indepValues) => {
  let model = null;

  if (depValues.length === indepValues.length) {
    model = jStat.models.ols(depValues, indepValues);
  }
  return model;
};
const _multipleLinearRegression = multipleLinearRegression;
export { _multipleLinearRegression as multipleLinearRegression };

/**
 * Create Compare Mean Table. The Output should include Mean, Median, Min, Max, and Counts columns.
 * If the stratumColumn is not provided, this function will create a Descriptive Summary for those continuous columns.
 *
 * @param {dataSet - array of data objects; valueColumn, stratumColumn - Categorical?}
 * @returns {*} an object
 *
 */
const compareMeans = (dataSet, valueColumn, stratumColumn = null) => {
  let output = {
    message: "",
    tableData: null,
    stratumColumn,
    statumValues: [],
    valueColumn,
    tableLevel: 1,
  };
  if (Array.isArray(dataSet) && dataSet.length > 0) {
    let baseData = [...dataSet];
    let stratumValues = [];
    let table = [];
    let allValues = [];

    //Added overall stats Jan 26, 2023
    if (valueColumn && valueColumn in baseData[0]) {
      for (let i = 0; i < baseData.length; i++) allValues.push(baseData[i][valueColumn]);
    } else {
      output = { ...output, message: "No Data for Creating a Pivot Table." };
      return output;
    }

    if (!stratumColumn) {
      //Added Overall stats Jan 26, 2023
      const rowOverallObj = { [valueColumn]: "OverallStats" };
      rowOverallObj.MEAN = calcMean(allValues).toFixed(3);
      rowOverallObj.MEDIAN = calcMedian(allValues).toFixed(3);
      rowOverallObj.MIN = calcMin(allValues).toFixed(3);
      rowOverallObj.MAX = calcMax(allValues).toFixed(3);
      rowOverallObj.COUNT = allValues.length;
      table.push(rowOverallObj);

      output = {
        ...output,
        message: "Successfully Created Descriptive Summary Table.",
        tableData: [...table],
      };
    } else {
      output = {
        ...output,
        tableLevel: 2,
      };
      if (stratumColumn in baseData[0]) {
        stratumValues = orderBy([
          ...new Set(
            baseData.map((data) =>
              typeof data[stratumColumn] === "string"
                ? data[stratumColumn]
                : StatsUtils.isNumber(data[stratumColumn])
                ? data[stratumColumn].toString()
                : data[stratumColumn]
            )
          ),
        ]);
        replaceBlankInArr(stratumValues);
        output = { ...output, stratumValues: stratumValues };

        for (let j = 0; j < stratumValues.length; j++) {
          let valuesArray = [];
          let secondFilteredData = [...baseData];
          secondFilteredData =
            stratumValues[j] === "Blank"
              ? baseData.filter((data) => data[stratumColumn] === "")
              : baseData.filter((data) =>
                  StatsUtils.isNumber(data[stratumColumn])
                    ? data[stratumColumn].toString() === stratumValues[j]
                    : data[stratumColumn] === stratumValues[j]
                );
          valuesArray = secondFilteredData.map((d) => d[valueColumn]);

          const colObj = { [stratumColumn]: stratumValues[j] };
          colObj.MEAN = calcMean(valuesArray).toFixed(3);
          colObj.MEDIAN = calcMedian(valuesArray).toFixed(3);
          colObj.MIN = calcMin(valuesArray).toFixed(3);
          colObj.MAX = calcMax(valuesArray).toFixed(3);
          colObj.COUNT = valuesArray.length;

          table.push(colObj);
        }
        //Added Overall stats Jan 26, 2023
        const rowOverallObj = { [stratumColumn]: "OverallStats" };
        rowOverallObj.MEAN = calcMean(allValues).toFixed(3);
        rowOverallObj.MEDIAN = calcMedian(allValues).toFixed(3);
        rowOverallObj.MIN = calcMin(allValues).toFixed(3);
        rowOverallObj.MAX = calcMax(allValues).toFixed(3);
        rowOverallObj.COUNT = allValues.length;
        table.push(rowOverallObj);

        output = {
          ...output,
          message: "Successfully Created Compare Mean Table.",
          tableData: [...table],
        };
      } else {
        output = {
          ...output,
          message: "Stratum Column is Required for creating descriptive summary.",
        };
        return output;
      }
    }

    return output;
  } else {
    output = { ...output, message: "No Data for Creating a Pivot Table." };
    return output;
  }
};
const _compareMeans = compareMeans;
export { _compareMeans as compareMeans };

/*Convert number labels to binary strings
 *
 * @params nLabel: number label to be converted - MUST >=0 , lenString: length of converted binary string
 *
 * @return binary string
 */
const createBinaryString = (nLabel, lenString) => {
  const bString = nLabel.toString(2);
  const binString = bString.padStart(lenString, "0");
  // for (
  //   let nFlag = 0, nShifted = nLabel, bString = "";
  //   nFlag < lenString;
  //   nFlag++, bString += String(nShifted >>> (lenString - 1)), nShifted <<= 1
  // );
  return binString;
};
const _createBinaryString = createBinaryString;
export { _createBinaryString as createBinaryString };

/**
 * Create One Column each based on selected columns requiring label encoding.
 * Return new data with the encoded new columns and values added in the original data.
 *
 * @param :
 * source Data : {
 *  columns,
 *  rows,
 * },
 * cols: {
 * source: {
 *  id,
 *  prefix,
 *  content,
 * },
 * labelEncoder: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * ...,
 * ],
 * }
 * @returns {*} an object
 *
 */
const labelEncoder = (sourceData, cols) => {
  let newData = { ...sourceData };
  for (let col of cols.labelEncoder) {
    let labelValues = [];
    const newColumnHeader = col.content.concat("_Recoded");
    const newHeaders = [
      ...newData.columns,
      {
        field: newColumnHeader,
        headerName: newColumnHeader,
      },
    ];
    //Get distinct values from source data for selected column, using natural order by,
    //means sort number like strings as numbers
    labelValues = orderBy([
      ...new Set(
        newData.rows.map((data) =>
          typeof data[col.content] === "string"
            ? data[col.content].replace(/\s+/g, "")
            : StatsUtils.isNumber(data[col.content])
            ? parseInt(data[col.content]).toString()
            : data[col.content]
        )
      ),
    ]);

    //Create a refernce object containing old values vs new values
    const referencePairs = {};
    for (let i = 0; i < labelValues.length; i++) {
      referencePairs[
        typeof labelValues[i] !== "string"
          ? StatsUtils.isNumber(labelValues[i])
            ? parseInt(labelValues[i]).toString()
            : labelValues[i]
          : labelValues[i]
      ] = i.toString();
    }
    //Add new column with new paired label values in source data
    const newRows = newData.rows.map((row) => {
      const rpIndex = StatsUtils.isNumber(row[col.content])
        ? row[col.content].toString().replace(/\s+/g, "")
        : row[col.content].replace(/\s+/g, "");
      const newRow = {
        ...row,
        [newColumnHeader]: referencePairs[rpIndex],
      };
      return newRow;
    });
    //Return updated data object
    newData = { columns: newHeaders, rows: newRows };
  }

  return newData;
};
const _labelEncoder = labelEncoder;
export { _labelEncoder as labelEncoder };

/**
 * Create columns for selected binary based columns using binary encoding method.
 * Return new data with the binary encoded new columns and values added in the original data.
 *
 * @param :
 * source Data : {
 *  columns,
 *  rows,
 * },
 * cols: {
 * source: {
 *  id,
 *  prefix,
 *  content,
 * },
 * binaryEncoder: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * ...,
 * ]
 * }
 * @returns {*} an object
 *
 */
const binaryEncoder = (sourceData, cols) => {
  let newData = { ...sourceData };
  for (let col of cols.binaryEncoder) {
    let labelValues = [];
    //Get distinct values from source data for selected column, using natural order by,
    //means sort number like strings as numbers
    labelValues = orderBy([
      ...new Set(
        newData.rows.map((data) =>
          typeof data[col.content] === "string"
            ? data[col.content].replace(/\s+/g, "")
            : StatsUtils.isNumber(data[col.content])
            ? parseInt(data[col.content]).toString()
            : data[col.content]
        )
      ),
    ]);

    const binLength = Math.floor(Math.log2(labelValues.length)) + 1;

    const originColumnHeader = col.content.substr(0, col.content.indexOf("_Recoded"));
    const addedHeaders = [];
    for (let i = 0; i < binLength; i++) {
      addedHeaders.push({
        field: originColumnHeader.concat("_").concat(i.toString()),
        headerName: originColumnHeader.concat("_").concat(i.toString()),
      });
    }

    const newHeaders = newData.columns.concat(addedHeaders);

    //Add new column with new paired label values in source data
    const newRows = newData.rows.map((row) => {
      const binString = createBinaryString(parseInt(row[col.content]), binLength);

      let newRow = { ...row };
      for (let j = 0; j < binLength; j++) {
        newRow = {
          ...newRow,
          [originColumnHeader.concat("_").concat(j.toString())]:
            j < binLength - 1 ? parseInt(binString.slice(j, j + 1)) : parseInt(binString.slice(-1)),
        };
      }

      return newRow;
    });
    //Return updated data object
    newData = { columns: newHeaders, rows: newRows };
  }

  return newData;
};
const _binaryEncoder = binaryEncoder;
export { _binaryEncoder as binaryEncoder };

/**
 * Create columns for selected continuous columns using minmax normalisation method.
 * Column selected must be numbers, or it will return an empty object.
 * Return new data with the new normalized columns and values added in the original data.
 *
 * @param :
 * source Data : {
 *  columns,
 *  rows,
 * },
 * cols: {
 * source: {
 *  id,
 *  prefix,
 *  content,
 * },
 * minMaxNormalizer: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * ...,
 * ]
 * }
 * @returns {*} an object
 *
 */
const minMaxNormalizer = (sourceData, cols) => {
  let newData = { ...sourceData };
  let colsMinMax = [];
  for (let col of cols.minMaxNormalizer) {
    let numValues = [];
    const newColumnHeader = col.content.concat("_Norm");
    const newHeaders = [
      ...newData.columns,
      {
        field: newColumnHeader,
        headerName: newColumnHeader,
      },
    ];

    //Get number value array to calculate the min and max of all the values
    numValues = newData.rows.map((data) =>
      StatsUtils.isNumber(data[col.content])
        ? typeof data[col.content] === "string"
          ? parseFloat(data[col.content])
          : data[col.content]
        : null
    );

    const minValue = Math.min(...numValues);
    const maxValue = Math.max(...numValues);

    colsMinMax.push({
      colName: col.content,
      min: minValue,
      max: maxValue,
    });

    //Add new column with new paired label values in source data
    const newRows = newData.rows.map((row) => {
      const newRow = {
        ...row,
        [newColumnHeader]: (row[col.content] - minValue) / (maxValue - minValue),
      };
      return newRow;
    });
    //Return updated data object
    newData = { columns: newHeaders, rows: newRows, colsMinMax: colsMinMax };
  }

  return newData;
};
const _minMaxNormalizer = minMaxNormalizer;
export { _minMaxNormalizer as minMaxNormalizer };

/**
 * Combine selected features and label(s) data into a newRows array.
 * Shuffle the newRows array and then split the newRows into training data and testing data.
 * Return training data and testing data in a [].
 *
 * @param :
 * source Data : {
 *  columns,
 *  rows,
 * },
 * cols: {
 * source: {
 *  id,
 *  prefix,
 *  content,
 * },
 * labelCols: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * featureCols: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * ]
 * }
 * @returns {*} an object
 *
 */
const splitData = (sourceData, cols) => {
  // Get the column headers for features and label values
  let newHeaders = [];
  for (let col of cols.featureCols) {
    newHeaders.push({
      field: col.content,
      headerName: col.content,
    });
  }
  for (let col of cols.labelCols) {
    newHeaders.push({
      field: col.content,
      headerName: col.content,
    });
  }

  let newRows = [];
  for (let row of sourceData.rows) {
    let newRow = {};
    for (let col of cols.featureCols) {
      newRow = {
        ...newRow,
        [col.content]: row[col.content],
      };
    }
    for (let col of cols.labelCols) {
      newRow = {
        ...newRow,
        [col.content]: row[col.content],
      };
    }
    newRows.push(newRow);
  }

  //Shuffle the newRows (data) for three times
  tf.util.shuffle(newRows);
  tf.util.shuffle(newRows);
  tf.util.shuffle(newRows);

  //Split the shuffled data into 70% training data and 30% testing data
  const [trainRows, testRows] = splitByPct(newRows, 0.7);

  const trainingData = { columns: newHeaders, rows: trainRows };
  const testingData = { columns: newHeaders, rows: testRows };

  return [trainingData, testingData];
};
const _splitData = splitData;
export { _splitData as splitData };

/**
 * Randomly split specified % of total data into 2 data sets
 *
 * @param: sourceArray, pctSplit: float
 *
 * Return 2 sets of arrays
 *
 */
const splitByPct = (source, pctSplit) => {
  const longArray = [...source];
  const shortArray = [];
  const shortSetLength = Math.floor(source.length * (pctSplit > 0.5 ? 1 - pctSplit : pctSplit));
  for (let i = 0; i < shortSetLength; i++) {
    const randIndex = Math.floor(Math.random() * longArray.length);
    const removed = longArray.splice(randIndex, 1);
    shortArray.push(removed[0]);
  }
  return [longArray, shortArray];
};
const _splitByPct = splitByPct;
export { _splitByPct as splitByPct };

/**
 * Create columns for selected binary based columns using oneHot method.
 * Return new data with the binary encoded new columns and values added in the original data.
 *
 * @param :
 * source Data : {
 *  columns,
 *  rows,
 * },
 * cols: {
 * source: {
 *  id,
 *  prefix,
 *  content,
 * },
 * oneHotEncoder: [
 * {
 *  id,
 *  prefix,
 *  content,
 * },
 * ...,
 * ]
 * }
 * @returns {*} an object
 *
 */
const oneHotEncoder = (sourceData, cols) => {
  let newData = { ...sourceData };
  for (let col of cols.oneHotEncoder) {
    let labelValues = [];
    //Get distinct values from source data for selected column, using natural order by,
    //means sort number like strings as numbers
    labelValues = orderBy([
      ...new Set(
        newData.rows.map((data) =>
          typeof data[col.content] === "string"
            ? data[col.content].replace(/\s+/g, "")
            : StatsUtils.isNumber(data[col.content])
            ? parseInt(data[col.content]).toString()
            : data[col.content]
        )
      ),
    ]);

    const binLength = labelValues.length;

    const originColumnHeader = col.content.substr(0, col.content.indexOf("_Recoded"));
    const addedHeaders = [];
    for (let i = 0; i < binLength; i++) {
      addedHeaders.push({
        field: originColumnHeader.concat("_").concat(i.toString()),
        headerName: originColumnHeader.concat("_").concat(i.toString()),
      });
    }

    const newHeaders = newData.columns.concat(addedHeaders);

    //Add new column with new paired label values in source data
    const newRows = newData.rows.map((row) => {
      let newRow = { ...row };
      for (let j = 0; j < binLength; j++) {
        newRow = {
          ...newRow,
          [originColumnHeader.concat("_").concat(j.toString())]:
            parseInt(row[col.content]) === j ? 1 : 0,
        };
      }

      return newRow;
    });
    //Return updated data object
    newData = { columns: newHeaders, rows: newRows };
  }

  return newData;
};
const _oneHotEncoder = oneHotEncoder;
export { _oneHotEncoder as oneHotEncoder };

/**
 * Create Ratio Stats Table for a specific AUG. The Output should include Median, PRD, PRB, COD, TOTALASMT, TOTALIOV and Counts of that stratum.
 *
 * @param {dataSet - array of data objects; augCategory, stratumColumn - String}
 * @returns {*} an object
 *
 */
const augRatioStats = (dataSet, augCategory, stratumColumn = null) => {
  let output = {
    message: "",
    tableData: null,
    stratumColumn,
    stratumValues: [],
    augCategory,
    augAsmtTotal: 0,
    augIOVTotal: 0,
  };

  if (Array.isArray(dataSet) && dataSet.length > 0) {
    let augData = dataSet.filter((d) => d.AUG_CODE === augCategory);

    if (!augData) return { ...output, message: "Data is not available for Ratio Stats!!" };
    let stratumValues = [];
    let table = [];
    if (stratumColumn) {
      if (augCategory && stratumColumn && stratumColumn in augData[0]) {
        stratumValues = [...new Set(augData.map((data) => data[stratumColumn]))].sort();
        replaceBlankInArr(stratumValues);
        output = { ...output, stratumValues: stratumValues };
        let augAsmtTotal = 0,
          augIOVTotal = 0;
        for (let j = 0; j < stratumValues.length; j++) {
          let asrArray = [],
            asmtArray = [],
            adjSPArray = [];
          let secondFilteredData = [...augData];
          secondFilteredData =
            stratumValues[j] === "Blank"
              ? augData.filter((data) => data[stratumColumn] === "")
              : augData.filter((data) => data[stratumColumn] === stratumValues[j]);
          secondFilteredData.forEach((d) => {
            if (d.ADJUSTED_PRICE > 0) asrArray.push(d.TOTAL_AP_ASMNT / d.ADJUSTED_PRICE);
          });

          secondFilteredData.forEach((d) => {
            if (d.ADJUSTED_PRICE > 0) asmtArray.push(d.TOTAL_AP_ASMNT);
          });

          secondFilteredData.forEach((d) => {
            if (d.ADJUSTED_PRICE > 0) adjSPArray.push(d.ADJUSTED_PRICE);
          });

          const colObj = {
            AUG: augCategory,
            [stratumColumn]: stratumValues[j],
          };
          colObj.MEAN = calcMean(asrArray).toFixed(3);
          colObj.MEDIAN = calcMedian(asrArray).toFixed(3);
          colObj.MIN = calcMin(asrArray).toFixed(3);
          colObj.MAX = calcMax(asrArray).toFixed(3);
          colObj.PRD = calcPRD(asmtArray, adjSPArray).toFixed(3);
          colObj.PRB = calcPRB(asmtArray, adjSPArray).toFixed(3);
          colObj.COD = calcCOD(asrArray).toFixed(3);
          colObj.ASMTTOTAL = calcSum(asmtArray);
          colObj.IOVTOTAL = calcSum(adjSPArray);
          colObj.COUNT = asrArray.length;

          table.push(colObj);
          augAsmtTotal += colObj.ASMTTOTAL;
          augIOVTotal += colObj.IOVTOTAL;
        }

        output = {
          ...output,
          message: "Successfully Created Ratio Statistics Table with Stratum.",
          tableData: [...table],
          augAsmtTotal: augAsmtTotal,
          augIOVTotal: augIOVTotal,
        };

        return output;
      } else {
        output = {
          ...output,
          message:
            "AUG Category and Stratum Column are Required. Both Categories Must Be Found in Data Set.",
        };
        return output;
      }
    } else {
      let augAsmtTotal,
        augIOVTotal = 0;

      let asrArray = [],
        asmtArray = [],
        adjSPArray = [];

      augData.forEach((d) => {
        if (d.ADJUSTED_PRICE > 0) asrArray.push(d.TOTAL_AP_ASMNT / d.ADJUSTED_PRICE);
      });

      augData.forEach((d) => {
        if (d.ADJUSTED_PRICE > 0) asmtArray.push(d.TOTAL_AP_ASMNT);
      });

      augData.forEach((d) => {
        if (d.ADJUSTED_PRICE > 0) adjSPArray.push(d.ADJUSTED_PRICE);
      });

      const colObj = { AUG: augCategory };
      colObj.MEAN = calcMean(asrArray).toFixed(3);
      colObj.MEDIAN = calcMedian(asrArray).toFixed(3);
      colObj.MIN = calcMin(asrArray).toFixed(3);
      colObj.MAX = calcMax(asrArray).toFixed(3);
      colObj.PRD = calcPRD(asmtArray, adjSPArray).toFixed(3);
      colObj.PRB = calcPRB(asmtArray, adjSPArray).toFixed(3);
      colObj.COD = calcCOD(asrArray).toFixed(3);
      colObj.ASMTTOTAL = calcSum(asmtArray);
      colObj.IOVTOTAL = calcSum(adjSPArray);
      colObj.COUNT = asrArray.length;

      table.push(colObj);
      augAsmtTotal += colObj.ASMTTOAL;
      augIOVTotal += colObj.IOVTOTAL;

      output = {
        ...output,
        message: "Successfully Created Overall AUG Ratio Statistics Table.",
        tableData: [...table],
        augAsmtTotal: augAsmtTotal,
        augIOVTotal: augIOVTotal,
      };
      return output;
    }
  } else {
    output = {
      ...output,
      message: "No Data for Creating a Ratio Stats Table.",
    };
    return output;
  }
};
const _augRatioStats = augRatioStats;
export { _augRatioStats as augRatioStats };

/**
 * Calculate Municipal assessment Level with input ratiostat data.
 *
 * @returns [assrResAsmtLvl, assrNResAsmtLvl, audResAsmtLvl, audNResAsmtLvl]
 *
 * @example calcMuniAsmtLvl(ratioData, augCodes, asmtyear, muni)
 */
const calcMuniAsmtLvl = (ratioData, augCodes, asmtyear, muni) => {
  const muniRatioData = ratioData.filter((r) => r.asmtyear === asmtyear && r.municode === muni);

  if (muniRatioData.length > 0) {
    let assrresAsmtTotal = 0,
      assrresIOVTotal = 0,
      assrnresAsmtTotal = 0,
      assrnresIOVTotal = 0;
    let audresAsmtTotal = 0,
      audresIOVTotal = 0,
      audnresAsmtTotal = 0,
      audnresIOVTotal = 0;

    for (let i = 0; i < muniRatioData.length; i++) {
      const aug = augCodes.find((a) => a.augcode === muniRatioData[i].aug);
      if (aug.isres) {
        assrresAsmtTotal += muniRatioData[i].strataasmt;
        assrresIOVTotal += muniRatioData[i].assrimv;
        audresAsmtTotal += Math.round(
          muniRatioData[i].audimv * parseFloat(muniRatioData[i].audmedasr)
        );
        audresIOVTotal += muniRatioData[i].audimv;
      } else {
        assrnresAsmtTotal += muniRatioData[i].strataasmt;
        assrnresIOVTotal += muniRatioData[i].assrimv;
        audnresAsmtTotal += Math.round(
          muniRatioData[i].audimv * parseFloat(muniRatioData[i].audmedasr)
        );
        audnresIOVTotal += muniRatioData[i].audimv;
      }
    }
    if (assrnresIOVTotal > 0 && audnresIOVTotal > 0 && assrresIOVTotal > 0 && audresIOVTotal > 0) {
      const assrResAsmtLvl = (assrresAsmtTotal / assrresIOVTotal).toFixed(3);
      const assrNResAsmtLvl = (assrnresAsmtTotal / assrnresIOVTotal).toFixed(3);
      const audResAsmtLvl = (audresAsmtTotal / audresIOVTotal).toFixed(3);
      const audNResAsmtLvl = (audnresAsmtTotal / audnresIOVTotal).toFixed(3);

      return [assrResAsmtLvl, assrNResAsmtLvl, audResAsmtLvl, audNResAsmtLvl];
    }
  }
  return [null, null, null, null];
};
const _calcMuniAsmtLvl = calcMuniAsmtLvl;
export { _calcMuniAsmtLvl as calcMuniAsmtLvl };
