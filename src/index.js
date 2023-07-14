import * as React from "react";
import * as ReactDOM from "react-dom";

import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import fr from "react-intl/locale-data/fr";
import it from "react-intl/locale-data/it";
import de from "react-intl/locale-data/de";
import zh from "react-intl/locale-data/zh";
import localeData from "./translations/translations.json";

import App from "./App";
import DataProvider from "./DataProvider";

import "./_styles/index.css";

let rootDiv;
let dataProvider = new DataProvider();

addLocaleData([...en, ...es, ...fr, ...it, ...de, ...zh]);
const language = dataProvider.getUserLanguage();
const messages = localeData[language];

function start(vals) {
  if (!rootDiv) {
    rootDiv = document.createElement("div");
    document.body.appendChild(rootDiv);
  }

  ReactDOM.render(
    <IntlProvider locale={language} messages={messages}>
      <App urlParams={vals} />
    </IntlProvider>,
    rootDiv
  );
}

function getDataParam() {
  //Get the any query string parameters and load them
  //into the vals array
  var vals = new Array();
  if (window.location.search != "") {
    vals = window.location.search.substr(1).split("&");
    for (var i in vals) {
      vals[i] = vals[i].replace(/\+/g, " ").split("=");
    }
    //look for the parameter named 'data'
    var found = false;
    for (var i in vals) {
      if (vals[i][0].toLowerCase() == "data") {
        parseDataValue(vals[i][1]);
        found = true;
        break;
      }
    }
    if (!found) {
      //noParams();
    }
  } else {
    //noParams();
  }
}

function parseDataValue(datavalue) {
  if (datavalue != "") {
    var vals = new Array();
    vals = decodeURIComponent(datavalue).split("&");
    for (var i in vals) {
      vals[i] = vals[i].replace(/\+/g, " ").split("=");
    }
    start(vals);
  }
}

// Start the application.
getDataParam();
