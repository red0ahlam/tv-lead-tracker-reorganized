
const inspInput = {
  "headerMapping": {
    "map": {
      "airDate": "Air Date",
      "airTime": "Air Time",
      "timePeriod": "Time Period",
      "spot": "Ad-ID",
      "rate": "Rate",
      "status": "Spot Status"
    },
    "constants": {
      "station": "insp"
    }
  },
  "providerName": "insp",
  "tableType": "many",
  "headerInfo": {
    "startRow": 9,
    "startColumn": 3,
    "headerValues": [
      { "value": "Broadcast Week", "column": 3 },
      { "value": "Agency", "column": 4 },
      { "value": "Advertiser", "column": 5 },
      { "value": "Advertiser Brand", "column": 6 },
      { "value": "Estimate", "column": 7 },
      { "value": "Length", "column": 8 },
      { "value": "Air Date", "column": 9 },
      { "value": "Air Time", "column": 10 },
      { "value": "Day", "column": 11 },
      { "value": "Rate", "column": 12 },
      { "value": "Spot Status", "column": 13 },
      { "value": "Ad-ID", "column": 14 },
      { "value": "Program Name", "column": 15 },
      { "value": "Time Period", "column": 16 },
      { "value": "Selling Name/Inventory Code", "column": 17 },
      { "value": "Order #", "column": 18 },
      { "value": "Primary AE", "column": 19 },
      { "value": "Line", "column": 20 }
    ],
    "isRepeated": true
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 3, "headerColumn": 3, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4, "checkingFn": "isConstant", "constant": "Nationwide Lead Service" },
      { "canBeEmpty": false, "column": 5, "headerColumn": 5, "checkingFn": "isConstant", "constant": "Senior Life Insurance" },
      { "canBeEmpty": false, "column": 6, "headerColumn": 6, "checkingFn": "isConstant", "constant": "Senior Life Insurance" },
      { "canBeEmpty": true, "column": 7, "headerColumn": 7 },
      { "canBeEmpty": false, "column": 8, "headerColumn": 8, "checkingFn": "isLength" },
      { "canBeEmpty": false, "column": 9, "headerColumn": 9, "checkingFn": "parseDate" },
      { "canBeEmpty": true, "column": 10, "headerColumn": 10, "checkingFn": "parseTime" },
      { "canBeEmpty": false, "column": 11, "headerColumn": 11, "checkingFn": "isDays" },
      { "canBeEmpty": false, "column": 12, "headerColumn": 12, "checkingFn": "isRate" },
      { "canBeEmpty": false, "column": 13, "headerColumn": 13 },
      { "canBeEmpty": true, "column": 14, "headerColumn": 14 },
      { "canBeEmpty": true, "column": 15, "headerColumn": 15 },
      { "canBeEmpty": false, "column": 16, "headerColumn": 16, "checkingFn": "isTimeRange", "constant": "Will Ridings" },
      { "canBeEmpty": false, "column": 17, "headerColumn": 17 },
      { "canBeEmpty": false, "column": 18, "headerColumn": 18, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 19, "headerColumn": 19, "checkingFn": "isConstant", "constant": "Chris House" },
      { "canBeEmpty": false, "column": 20, "headerColumn": 20, "checkingFn": "isNumber" }
    ]
  },
  "tableSeparationPattern": {
    "endPattern": {
      "pattern": "Total:",
      "column": 2,
      "isRepeated": true
    }
  }
}

const tegnaInput = {
  "headerMapping": {
    "map": {
      "station": "Property",
      "airDate": "Air Date",
      "airTime": "Air Time",
      "timePeriod": "Time Period",
      "spot": "Ad-ID",
      "rate": "Rate (Ext)",
      "status": "Spot State"
    }
  },
  "providerName": "tegna",
  "tableType": "one_divided",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 0,
    "headerValues": [
      { "value": "Order #", "column": 0 },
      { "value": "Property", "column": 4 },
      { "value": "Air Date", "column": 18 },
      { "value": "Air Time", "column": 19 },
      { "value": "Advertiser", "column": 20 },
      { "value": "Agency", "column": 21 },
      { "value": "Length", "column": 22 },
      { "value": "Time Period", "column": 23 },
      { "value": "AE Full Name", "column": 24 },
      { "value": "Ad-ID", "column": 25 },
      { "value": "Spot State", "column": 26 },
      { "value": "Rate (Ext)", "column": 27 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 2, "headerColumn": 0, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4 },
      { "canBeEmpty": false, "column": 18, "headerColumn": 18, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 19, "headerColumn": 19, "checkingFn": "parseTime" },
      { "canBeEmpty": false, "column": 20, "headerColumn": 20, "checkingFn": "isConstant", "constant": "Senior Life Insurance" },
      { "canBeEmpty": false, "column": 21, "headerColumn": 21, "checkingFn": "isConstant", "constant": "Senior Life Insurance Company" },
      { "canBeEmpty": false, "column": 22, "headerColumn": 22, "checkingFn": "isLength" },
      { "canBeEmpty": true, "column": 23, "headerColumn": 23, "checkingFn": "isTimeRange" },
      { "canBeEmpty": false, "column": 24, "headerColumn": 24, "checkingFn": "isConstant", "constant": "Ryan Puffer" },
      { "canBeEmpty": true, "column": 25, "headerColumn": 25 },
      { "canBeEmpty": false, "column": 26, "headerColumn": 26 },
      { "canBeEmpty": false, "column": 27, "headerColumn": 27, "checkingFn": "isRate" }
    ],
    "sumRows": [
      { "column": 27, "checkingFn": "isRate" }
    ]
  },
  "tableSeparationPattern": {
    "startPattern": {
      "pattern": "Spot State :",
      "column": 2,
      "isRepeated": false
    },
    "endPattern": {
      "pattern": "Property :",
      "column": 1,
      "isRepeated": true
    }
  }
}

const policynologyInput = {
  "headerMapping": {
    "map": {
      "station": "Program",
      "airDate": "Air Date",
      "airTime": "Aired Time",
      "spot": "Aired Ad-ID",
      "rate": "Rate"
    }
  },
  "providerName": "policynology",
  "tableType": "one_connected",
  "headerInfo": {
    "startRow": 5,
    "startColumn": 0,
    "headerValues": [
      { "value": "Program", "column": 0 },
      { "value": "Agency", "column": 1 },
      { "value": "Adv ID", "column": 2 },
      { "value": "Air Date", "column": 3 },
      { "value": "Aired Time", "column": 4 },
      { "value": "Aired Length", "column": 5 },
      { "value": "Order Product Description", "column": 6 },
      { "value": "Rate", "column": 7 },
      { "value": "Aired Ad-ID", "column": 8 },
      { "value": "Prelog Data Name", "column": 9 },
      { "value": "Estimate", "column": 10 },
      { "value": "Access Code", "column": 11 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 0, "headerColumn": 0, "checkingFn": "isConstant", "constant": "THE365" },
      { "canBeEmpty": false, "column": 1, "headerColumn": 1, "checkingFn": "isConstant", "constant": "Policynology" },
      { "canBeEmpty": false, "column": 2, "headerColumn": 2, "checkingFn": "isConstant", "constant": "Senior Life Insurance/Senior Life" },
      { "canBeEmpty": false, "column": 3, "headerColumn": 3, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4, "checkingFn": "parseTime" },
      { "canBeEmpty": false, "column": 5, "headerColumn": 5, "checkingFn": "isLength" },
      { "canBeEmpty": false, "column": 6, "headerColumn": 6, "checkingFn": "isConstant", "constant": "Senior Life" },
      { "canBeEmpty": false, "column": 7, "headerColumn": 7, "checkingFn": "isRate" },
      { "canBeEmpty": true, "column": 8, "headerColumn": 8 },
      { "canBeEmpty": false, "column": 9, "headerColumn": 9 },
      { "canBeEmpty": false, "column": 10, "headerColumn": 10 },
      { "canBeEmpty": false, "column": 11, "headerColumn": 11 }
    ]
  },
  "tableSeparationPattern": {
    "endPattern": {
      "pattern": "*Pre & Post logs are subject to change after the broadcast month has been fully reconciled. During coverage of live events, spots may run out of rotation, and separation is not guaranteed",
      "column": 0,
      "isRepeated": false
    }
  }
}

const paramountInput = {
  "headerMapping": {
    "map": {
      "station": "station",
      "airDate": "Date",
      "airTime": "Air Time",
      "timePeriod": "Time Period",
      "spot": "Ad-ID",
      "rate": "Rate (Ext)"
    }
  },
  "providerName": "paramount",
  "tableType": "one_divided",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 1,
    "headerValues": [
      { "value": "Order", "column": 1 },
      { "value": "Line", "column": 2 },
      { "value": "Spot #", "column": 3 },
      { "value": "Weekday", "column": 4 },
      { "value": "Air Time", "column": 5 },
      { "value": "Date", "column": 6 },
      { "value": "Time Period", "column": 7 },
      { "value": "Program (Placed)", "column": 8 },
      { "value": "Advertiser", "column": 9 },
      { "value": "Agency", "column": 10 },
      { "value": "AE Full Name", "column": 11 },
      { "value": "Length", "column": 12 },
      { "value": "Rate (Ext)", "column": 13 },
      { "value": "Week Start", "column": 14 },
      { "value": "Ad-ID", "column": 15 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 1, "headerColumn": 1, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 2, "headerColumn": 2, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 3, "headerColumn": 3, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4, "checkingFn": "isDays" },
      { "canBeEmpty": false, "column": 5, "headerColumn": 5, "checkingFn": "parseTime" },
      { "canBeEmpty": false, "column": 6, "headerColumn": 6, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 7, "headerColumn": 7, "checkingFn": "isTimeRange" },
      { "canBeEmpty": false, "column": 8, "headerColumn": 8 },
      { "canBeEmpty": false, "column": 9, "headerColumn": 9, "checkingFn": "isConstant", "constant": "Senior Life Insurance Company" },
      { "canBeEmpty": false, "column": 10, "headerColumn": 10, "checkingFn": "isConstant", "constant": "Policynology LLC. C/O Senior Life Insurance Co." },
      { "canBeEmpty": false, "column": 11, "headerColumn": 11, "checkingFn": "isConstant", "constant": "Will Ridings" },
      { "canBeEmpty": false, "column": 12, "headerColumn": 12, "checkingFn": "isLength" },
      { "canBeEmpty": false, "column": 13, "headerColumn": 13, "checkingFn": "isRate" },
      { "canBeEmpty": false, "column": 14, "headerColumn": 14, "checkingFn": "parseDate" },
      { "canBeEmpty": true, "column": 15, "headerColumn": 15 }
    ],
    "sumRows": [
      { "column": 3, "checkingFn": "isNumber" },
      { "column": 13, "checkingFn": "isRate" }
    ]
  },
  "tableSeparationPattern": {
    "startPattern": {
      "pattern": "Property :",
      "column": 0,
      "isRepeated": false
    }
  },
  "relevantSideInfo": [
    {
      "mappedProperty": "station",
      "pattern": "Property :",
      "isRepeated": true,
      "column": 0
    }
  ]
}

const grayInput = {
  "headerMapping": {
    "map": {
      "station": "Media Outlet Name",
      "airDate": "Broadcast Date",
      "airTime": "Hit Time",
      "spot": "ISCI",
      "rate": "Rate"
    }
  },
  "providerName": "gray",
  "tableType": "one_connected",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 0,
    "headerValues": [
      { "value": "Media Outlet Name", "column": 0 },
      { "value": "Channel", "column": 1 },
      { "value": "Advertiser Name", "column": 2 },
      { "value": "Order Id", "column": 3 },
      { "value": "Alt Order Id", "column": 4 },
      { "value": "Product Name", "column": 5 },
      { "value": "Estimate Code", "column": 6 },
      { "value": "Length", "column": 7 },
      { "value": "Rate", "column": 8 },
      { "value": "Broadcast Date", "column": 9 },
      { "value": "Hit Time", "column": 10 },
      { "value": "ISCI", "column": 11 },
      { "value": "Program", "column": 12 },
      { "value": "Unit Status", "column": 13 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 0, "headerColumn": 0 },
      { "canBeEmpty": true, "column": 1, "headerColumn": 1 },
      { "canBeEmpty": false, "column": 2, "headerColumn": 2 },
      { "canBeEmpty": false, "column": 3, "headerColumn": 3, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 4, "headerColumn": 4 },
      { "canBeEmpty": true, "column": 5, "headerColumn": 5 },
      { "canBeEmpty": true, "column": 6, "headerColumn": 6 },
      { "canBeEmpty": false, "column": 7, "headerColumn": 7, "checkingFn": "isLength" },
      { "canBeEmpty": false, "column": 8, "headerColumn": 8, "checkingFn": "isRate" },
      { "canBeEmpty": false, "column": 9, "headerColumn": 9, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 10, "headerColumn": 10, "checkingFn": "parseTime" },
      { "canBeEmpty": true, "column": 11, "headerColumn": 11 },
      { "canBeEmpty": true, "column": 12, "headerColumn": 12 },
      { "canBeEmpty": false, "column": 13, "headerColumn": 13 }
    ]
  }
}


const nexstarInput = {
  "headerMapping": {
    "map": {
      "station": "ReferenceSourceName",
      "airDate": "AirDate",
      "airTime": "AirTime",
      "spot": "EstimateCode",
      "rate": "Rate"
    }
  },
  "providerName": "nexstar",
  "tableType": "one_connected",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 0,
    "headerValues": [
      { "value": "TipVersion", "column": 0 },
      { "value": "TransactionNum", "column": 1 },
      { "value": "TransactionType", "column": 2 },
      { "value": "SourceId", "column": 3 },
      { "value": "SourceName", "column": 4 },
      { "value": "TimeStamp", "column": 5 },
      { "value": "UnitId", "column": 6 },
      { "value": "ReferenceSourceName", "column": 7 },
      { "value": "AltReferenceId", "column": 8 },
      { "value": "ReferenceSourceId", "column": 9 },
      { "value": "linenumber", "column": 10 },
      { "value": "ReferenceType", "column": 11 },
      { "value": "ReferenceId", "column": 12 },
      { "value": "ClientCode", "column": 13 },
      { "value": "ProductCode", "column": 14 },
      { "value": "EstimateCode", "column": 15 },
      { "value": "BuyerId", "column": 16 },
      { "value": "BuyerName", "column": 17 },
      { "value": "AdvertiserId", "column": 18 },
      { "value": "AdvertiserName", "column": 19 },
      { "value": "BrandId", "column": 20 },
      { "value": "BrandName", "column": 21 },
      { "value": "ProductId", "column": 22 },
      { "value": "ProductName", "column": 23 },
      { "value": "MediaOutletId", "column": 24 },
      { "value": "SalesElementName", "column": 25 },
      { "value": "SalesElementId", "column": 26 },
      { "value": "SalesElementType", "column": 27 },
      { "value": "Program", "column": 28 },
      { "value": "Daypart", "column": 29 },
      { "value": "InventoryType", "column": 30 },
      { "value": "LinkType", "column": 31 },
      { "value": "Makegood", "column": 32 },
      { "value": "Bonus", "column": 33 },
      { "value": "Length", "column": 34 },
      { "value": "Rate", "column": 35 },
      { "value": "AdId", "column": 36 },
      { "value": "Status", "column": 37 },
      { "value": "CreditInd", "column": 38 },
      { "value": "DowMonday", "column": 39 },
      { "value": "DowTuesday", "column": 40 },
      { "value": "DowWednesday", "column": 41 },
      { "value": "DowThursday", "column": 42 },
      { "value": "DowFriday", "column": 43 },
      { "value": "DowSaturday", "column": 44 },
      { "value": "DowSunday", "column": 45 },
      { "value": "CalendarDateTime", "column": 46 },
      { "value": "AirDate", "column": 47 },
      { "value": "Airtime", "column": 48 },
      { "value": "ChannelInt", "column": 49 },
      { "value": "Market", "column": 50 },
      { "value": "Salesoffice", "column": 51 },
      { "value": "StatusType", "column": 52 },
      { "value": "LogType", "column": 53 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 0, "headerColumn": 0, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 1, "headerColumn": 1 },
      { "canBeEmpty": false, "column": 2, "headerColumn": 2 },
      { "canBeEmpty": false, "column": 3, "headerColumn": 3 },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4 },
      { "canBeEmpty": false, "column": 5, "headerColumn": 5, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 6, "headerColumn": 6 },
      { "canBeEmpty": true, "column": 7, "headerColumn": 7 },
      { "canBeEmpty": true, "column": 8, "headerColumn": 8 },
      { "canBeEmpty": false, "column": 9, "headerColumn": 9, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 10, "headerColumn": 10, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 11, "headerColumn": 11, "checkingFn": "isConstant", "constant": "Order" },
      { "canBeEmpty": false, "column": 12, "headerColumn": 12, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 13, "headerColumn": 13 },
      { "canBeEmpty": true, "column": 14, "headerColumn": 14 },
      { "canBeEmpty": true, "column": 15, "headerColumn": 15 },
      { "canBeEmpty": false, "column": 16, "headerColumn": 16, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 17, "headerColumn": 17, "checkingFn": "isConstant", "constant": "Policynology LLC" },
      { "canBeEmpty": false, "column": 18, "headerColumn": 18, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 19, "headerColumn": 19, "checkingFn": "isConstant", "constant": "Senior Life Insurance" },
      { "canBeEmpty": true, "column": 20, "headerColumn": 20, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 21, "headerColumn": 21 },
      { "canBeEmpty": false, "column": 22, "headerColumn": 22 },
      { "canBeEmpty": true, "column": 23, "headerColumn": 23 },
      { "canBeEmpty": false, "column": 24, "headerColumn": 24, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 25, "headerColumn": 25 },
      { "canBeEmpty": false, "column": 26, "headerColumn": 26 },
      { "canBeEmpty": false, "column": 27, "headerColumn": 27, "checkingFn": "isConstant", "constant": "Program" },
      { "canBeEmpty": false, "column": 28, "headerColumn": 28 },
      { "canBeEmpty": false, "column": 29, "headerColumn": 29 },
      { "canBeEmpty": false, "column": 30, "headerColumn": 30, "checkingFn": "isConstant", "constant": "Commercial" },
      { "canBeEmpty": true, "column": 31, "headerColumn": 31 },
      { "canBeEmpty": false, "column": 32, "headerColumn": 32 },
      { "canBeEmpty": false, "column": 33, "headerColumn": 33 },
      { "canBeEmpty": false, "column": 34, "headerColumn": 34, "checkingFn": "isLength" },
      { "canBeEmpty": false, "column": 35, "headerColumn": 35, "checkingFn": "isRate" },
      { "canBeEmpty": true, "column": 36, "headerColumn": 36 },
      { "canBeEmpty": false, "column": 37, "headerColumn": 37 },
      { "canBeEmpty": false, "column": 38, "headerColumn": 38 },
      { "canBeEmpty": false, "column": 39, "headerColumn": 39 },
      { "canBeEmpty": false, "column": 40, "headerColumn": 40 },
      { "canBeEmpty": false, "column": 41, "headerColumn": 41 },
      { "canBeEmpty": false, "column": 42, "headerColumn": 42 },
      { "canBeEmpty": false, "column": 43, "headerColumn": 43 },
      { "canBeEmpty": false, "column": 44, "headerColumn": 44 },
      { "canBeEmpty": false, "column": 45, "headerColumn": 45 },
      { "canBeEmpty": false, "column": 46, "headerColumn": 46, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 47, "headerColumn": 47, "checkingFn": "parseDate" },
      { "canBeEmpty": true, "column": 48, "headerColumn": 48, "checkingFn": "parseTime" },
      { "canBeEmpty": true, "column": 49, "headerColumn": 49 },
      { "canBeEmpty": false, "column": 50, "headerColumn": 50 },
      { "canBeEmpty": false, "column": 51, "headerColumn": 51 },
      { "canBeEmpty": false, "column": 52, "headerColumn": 52 },
      { "canBeEmpty": false, "column": 53, "headerColumn": 53 }
    ]
  }
}

const callCenter1Input = {
  "providerName": "callCenter1",
  "tableType": "one_connected",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 0,
    "headerValues": [
      { "value": "Session ID", "column": 0 },
      { "value": "Call DTS", "column": 1 },
      { "value": "SourceName", "column": 2 },
      { "value": "Lead Type", "column": 3 },
      { "value": "Disposition", "column": 4 },
      { "value": "FirstName", "column": 5 },
      { "value": "LastName", "column": 6 },
      { "value": "Address1", "column": 7 },
      { "value": "Address2", "column": 8 },
      { "value": "City", "column": 9 },
      { "value": "State", "column": 10 },
      { "value": "ZIP", "column": 11 },
      { "value": "UpdatePhone", "column": 12 },
      { "value": "email", "column": 13 },
      { "value": "DOB", "column": 14 },
      { "value": "Comments", "column": 15 },
      { "value": "CS Comments", "column": 16 },
      { "value": "NameOfAgent", "column": 17 },
      { "value": "ANI", "column": 18 },
      { "value": "Type", "column": 19 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": false, "column": 0, "headerColumn": 0, "checkingFn": "isNumber" },
      { "canBeEmpty": false, "column": 1, "headerColumn": 1, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 2, "headerColumn": 2 },
      { "canBeEmpty": false, "column": 3, "headerColumn": 3 },
      { "canBeEmpty": false, "column": 4, "headerColumn": 4 },
      { "canBeEmpty": true, "column": 5, "headerColumn": 5 },
      { "canBeEmpty": true, "column": 6, "headerColumn": 6 },
      { "canBeEmpty": true, "column": 7, "headerColumn": 7 },
      { "canBeEmpty": true, "column": 8, "headerColumn": 8 },
      { "canBeEmpty": true, "column": 9, "headerColumn": 9 },
      { "canBeEmpty": true, "column": 10, "headerColumn": 10 },
      { "canBeEmpty": true, "column": 11, "headerColumn": 11, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 12, "headerColumn": 12, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 13, "headerColumn": 13, "checkingFn": "isEmail" },
      { "canBeEmpty": true, "column": 14, "headerColumn": 14, "checkingFn": "parseDate" },
      { "canBeEmpty": true, "column": 15, "headerColumn": 15 },
      { "canBeEmpty": true, "column": 16, "headerColumn": 16 },
      { "canBeEmpty": true, "column": 17, "headerColumn": 17, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 18, "headerColumn": 18 },
      { "canBeEmpty": true, "column": 19, "headerColumn": 19 }
    ]
  },
  processingSteps: [
    { order: 1, name: "dropDispositionDroppedCall" },
    { order: 2, name: "extractTvCampaigns", options: { columnKey: "sourcename" } },
    { order: 3, name: "setEmptyANI" },
    { order: 4, name: "dropPolicyHolders", options: { commentsColumnKey: "CS Comments" } },
    { order: 5, name: "getRidOfNonNumberAni" },
    { order: 5, name: "deduplicateANI", options: {aniExcludedKeys: ['session id', 'call dts', 'lead type', 'disposition', 'Comments', 'CS Comments', 'NameOfAgent', 'ani'], campaignKey: 'SourceName'}}
  ]
}

const callCenter2Input = {
  "providerName": "callCenter2",
  "tableType": "one_connected",
  "headerInfo": {
    "startRow": 0,
    "startColumn": 0,
    "headerValues": [
      { "value": "FirstName", "column": 0 },
      { "value": "LastName", "column": 1 },
      { "value": "Address1", "column": 2 },
      { "value": "Address2", "column": 3 },
      { "value": "City", "column": 4 },
      { "value": "State", "column": 5 },
      { "value": "ZIP", "column": 6 },
      { "value": "ANI", "column": 7 },
      { "value": "UpdatePhone", "column": 8 },
      { "value": "DOB", "column": 9 },
      { "value": "Call DTS", "column": 10 },
      { "value": "SourceName", "column": 11 },
      { "value": "OriginatingCampaign", "column": 12 },
      { "value": "Comments", "column": 13 },
      { "value": "NameOfAgent", "column": 14 },
      { "value": "email", "column": 15 },
      { "value": "Appointment", "column": 16 }
    ],
    "isRepeated": false
  },
  "dataInfo": {
    "dataValues": [
      { "canBeEmpty": true, "column": 0, "headerColumn": 0 },
      { "canBeEmpty": true, "column": 1, "headerColumn": 1 },
      { "canBeEmpty": true, "column": 2, "headerColumn": 2 },
      { "canBeEmpty": true, "column": 3, "headerColumn": 3 },
      { "canBeEmpty": true, "column": 4, "headerColumn": 4 },
      { "canBeEmpty": true, "column": 5, "headerColumn": 5 },
      { "canBeEmpty": true, "column": 6, "headerColumn": 6, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 7, "headerColumn": 7, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 8, "headerColumn": 8, "checkingFn": "isNumber" },
      { "canBeEmpty": true, "column": 9, "headerColumn": 9, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 10, "headerColumn": 10, "checkingFn": "parseDate" },
      { "canBeEmpty": false, "column": 11, "headerColumn": 11 },
      { "canBeEmpty": true, "column": 12, "headerColumn": 12 },
      { "canBeEmpty": true, "column": 13, "headerColumn": 13 },
      { "canBeEmpty": true, "column": 14, "headerColumn": 14 },
      { "canBeEmpty": true, "column": 15, "headerColumn": 15, "checkingFn": "isEmail" },
      { "canBeEmpty": true, "column": 16, "headerColumn": 16 }
    ]
  },
  processingSteps: [
    { order: 1, name: "formatColumnValue", options: { columnKey: "sourcename", regexExp: "/spanish national\\s+(\\d+)/i", replacement: "spanish nat $1" } },
    { order: 2, name: "handleSaveAllLeads", options: { mainKey: "sourcename", secondKey: "originatingCampaign" } },
    { order: 3, name: "extractTvCampaigns", options: { columnKey: "sourcename" } },
    { order: 4, name: "setEmptyANI" },
    { order: 5, name: "dropPolicyHolders", options: { commentsColumnKey: "Comments" } },
    { order: 6, name: "getRidOfNonNumberAni" },
    { order: 7, name: "deduplicateANI", options: {aniExcludedKeys: ['call dts', 'Comments', 'Appointment', 'NameOfAgent', 'ani'], campaignKey: 'SourceName'}}
  ]
}

export const providerInputMap = {
  "insp": inspInput,
  "tegna": tegnaInput,
  "paramount": paramountInput,
  "policynology_the365": policynologyInput,
  "gray": grayInput,
  "nexstar": nexstarInput,
  "callCenter1": callCenter1Input,
  "callCenter2": callCenter2Input
}