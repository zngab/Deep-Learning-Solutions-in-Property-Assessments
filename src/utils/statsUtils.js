const checkInput = (args) => {
  // only two inputs exist
  if (args.length !== 2) return { message: "Only Two Arrays Allowed", result: false };
  const [x, y] = args;
  // inputs are not falsy
  if (!x || !y) return { message: "Both Arrays Must Not Falsy", result: false };
  // they are arrays
  if (!Array.isArray(x) || !Array.isArray(y))
    return { message: "Input Must Be Two Arrays", result: false };
  // length is not 0
  if (!x.length || !y.length) return { message: "Both Arrays Must Not Empty", result: false };
  // length is the same
  if (x.length !== y.length) return { message: "Both Arrays Must Have Same Length", result: false };
  // all the elems in the arrays are numbers
  if (x.concat(y).find((el) => !isNumber(el)))
    return { message: "Both Arrays Must Only Contain Numbers", result: false };
  // 👌 all good!
  return { message: "Valid Input", result: true };
};
const _checkInput = checkInput;
export { _checkInput as checkInput };

const isNumber = (n) => {
  if (typeof n === "number" && n === Number(n) && Number.isFinite(n)) {
    return { message: "Element Is Number", result: true };
  } else {
    return { message: "Element Must Be Number", result: false };
  }
};
const _isNumber = isNumber;
export { _isNumber as isNumber };

const isObject = (obj) => {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    return { message: "Element Is An Object", result: true };
  } else {
    return { message: "Element Must Be An Object", result: false };
  }
};
const _isObject = isObject;
export { _isObject as isObject };

const manageInput = (input) => {
  let arrays = input;
  let options = {};

  if (input.length > 2) {
    /* eslint-disable-next-line prefer-destructuring */
    if (isObject(input[2])) options = input[2];
    arrays = input.slice(0, 2);
  }

  const opts = {
    returnString: options.string || false,
    returnDecimals: options.decimals || 9,
  };

  return [arrays, opts];
};
const _manageInput = manageInput;
export { _manageInput as manageInput };

const preciseRound = (num, dec) =>
  Math.round(num * 10 ** dec + (num >= 0 ? 1 : -1) * 0.0001) / 10 ** dec;
const _preciseRound = preciseRound;
export { _preciseRound as preciseRound };

const splitNumbersByBreakpoints = (
  number,
  breakpoints,
  totalLengthOfPeriods //either 37 or 13  (+ 1 is just to allow the 37th month to be calculated.)
) => {
  //breakpoints length is number of breakpoints
  //Calculate the diffs array using breakpoints
  //Return an array of values representing the number of periods in each period [p1,p2,p3...]
  let diffs = [];
  let periods = [];

  for (let i = 0; i <= breakpoints.length; i++) {
    //initialize periods array with all 0s
    periods.push(0);
    if (i === 0) diffs[0] = breakpoints[0];
    if (i > 0 && i < breakpoints.length) diffs[i] = breakpoints[i] - breakpoints[i - 1];
    if (i === breakpoints.length) diffs[i] = totalLengthOfPeriods - breakpoints[i - 1];
  }

  let residual = number;
  for (let i = 0; i < diffs.length; i++) {
    if (residual > 0) {
      if (residual <= diffs[i]) {
        periods[i] = residual;
      } else {
        periods[i] = diffs[i];
      }
      residual -= diffs[i];
    }
  }
  return periods;
};
const _splitNumbersByBreakpoints = splitNumbersByBreakpoints;
export { _splitNumbersByBreakpoints as splitNumbersByBreakpoints };

const getArrDims = (arry) => {
  let arr = arry.slice();
  var dim = [];
  for (;;) {
    dim.push(arr.length);

    if (Array.isArray(arr[0])) {
      arr = arr[0];
    } else {
      break;
    }
  }
  return dim;
};
const _getArrDims = getArrDims;
export { _getArrDims as getArrDims };
