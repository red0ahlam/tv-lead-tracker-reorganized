export enum TableExtractionMode {
  many = "many",
  one_connected = "one_connected",
  one_divided = "one_divided",
}

export enum checkingFnType {
  isEmail = "isEmail",
  parseDate = "parseDate",
  parseTime = "parseTime",
  isTimeRange = "isTimeRange",
  isDays = "isDays",
  isCityState = "isCityState",
  isNumber = "isNumber",
  isRate = "isRate",
  isLength = "isLength",
  isConstant = "isConstant"
}