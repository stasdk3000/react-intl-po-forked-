import React from "react";
import PropTypes from "prop-types";
import {
  Breadcrumb,
  IBreadcrumbItem
} from "office-ui-fabric-react/lib/Breadcrumb";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import {
  Selection,
  SelectionMode,
  SelectionZone
} from "office-ui-fabric-react/lib/utilities/selection";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Check } from "office-ui-fabric-react/lib/Check";
import { identity, createListItems } from "../utils/";
import {
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react/lib/MessageBar";
import DataProvider from "../DataProvider";
import "../_styles/Content.css";

class Content extends React.Component {
  constructor() {
    super();
    this.dataProvider = new DataProvider();
    this.state = {
      items: [],
      selection: new Selection({
        onSelectionChanged: this._onSelectionChanged
      }),
      listMode: ""
    };
    this.state.selection.setItems(this.state.items, false);
  }

  componentWillMount() {
    let inputs = {
      street: this._getParamValueByName("street")
    };
    this.dataProvider.unboundAction("mat_LookupAddress", inputs).then(
      res => {
        this._processEntitiesAndShowResults(res);
      },
      err => {
        this._showError(err);
      }
    );
  }

  _getParamValueByName(name) {
    let value = "";
    const { urlParams } = this.props;
    for (let i in urlParams) {
      if (urlParams[i][0] == name) {
        value = urlParams[i][1];
      }
    }
    return value;
  }

  _processEntitiesAndShowResults(res) {
    const plzStreets = res.value;
    let name = "";
    let key = "";
    let listMode = "str";
    const items = plzStreets.map(p => {
      if (p.mat_geb_hnr != null) {
        listMode = "geb";
        if (p.mat_geb_hnra != null) {
          name = `${p.mat_str_strbez2l} ${p.mat_geb_hnr}${p.mat_geb_hnra}, ${p.mat_plz_postleitzahl} ${p.mat_plz_ortbez27}`;
        } else {
          name = `${p.mat_str_strbez2l} ${p.mat_geb_hnr}, ${p.mat_plz_postleitzahl} ${p.mat_plz_ortbez27}`;
        }
      } else {
        name = `${p.mat_str_strbez2l}, ${p.mat_plz_postleitzahl} ${p.mat_plz_ortbez27}`;
      }

      key = p._mat_gebid_value ? p._mat_gebid_value : p._mat_strid_value;
      return {
        name: name,
        key: key
      };
    });
    this.setState({
      items: items,
      listMode: listMode
    });
    this.state.selection.setItems(this.state.items, false);
  }

  _processEntitiesAndSendResultBack(res) {
    const psg = res.value;
    let result = {};
    psg.map(p => {
      result.streetNr = p.mat_geb_hnr;
      if (p.mat_geb_hnra != null) {
        result.streetNrA = p.mat_geb_hnra;
      } else {
        result.streetNrA = "";
      }
      result.street = p.mat_str_strbez2l;
      result.plz = p.mat_plz_postleitzahl;
      result.city = p.mat_plz_ortbez27;
      result.region = p.mat_plz_kanton;
    });
    window.parent.postMessage(
      JSON.stringify(result),
      dataProvider.getClientUrl()
    );
  }

  // Configure the error message.
  _showError(err) {
    this.setState({
      result: {
        type: MessageBarType.error,
        text: `Error ${err.statusCode}: ${err.code} - ${err.message}`
      }
    });
  }

  componentDidMount() {
    this._hasMounted = true;
  }

  _onSelectionChanged = () => {
    if (this._hasMounted) {
      this.forceUpdate();
    }
  };

  _isPrimaryButtonDisabled = () => {
    const { selection } = this.state;
    return !selection.getSelectedCount() > 0;
  };

  _selectStreetOnClick = () => {
    const { selection } = this.state;
    let selectedStreet = selection.getSelection()[0].key;
    const inputs = {
      street: this._getParamValueByName("street"),
      streetId: {
        "@odata.type": "Microsoft.Dynamics.CRM.mat_str",
        mat_strid: selectedStreet
      }
    };
    this.dataProvider.unboundAction("mat_LookupAddress", inputs).then(
      res => {
        this._processEntitiesAndShowResults(res);
      },
      err => {
        this._showError(err);
      }
    );
  };

  _selectNumberOnClick = () => {
    const { selection } = this.state;
    let selectedNumber = selection.getSelection()[0].key;
    const inputs = {
      numberId: {
        "@odata.type": "Microsoft.Dynamics.CRM.mat_geb",
        mat_gebid: selectedNumber
      }
    };
    this.dataProvider.unboundAction("mat_LookupAddress", inputs).then(
      res => {
        this._processEntitiesAndSendResultBack(res);
      },
      err => {
        this._showError(err);
      }
    );
  };

  render() {
    const { breadcrumbs, maxBreadcrumbs } = this.props;
    const { items, selection, listMode } = this.state;
    return (
      <div className="container">
        {this.renderBreadCrumbs()}
        <div className="selection">
          <MarqueeSelection selection={selection}>
            <SelectionZone
              selection={selection}
              selectionMode={SelectionMode.single}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  className="selection-item"
                  data-selection-index={index}
                >
                  <span className="check" data-selection-toggle={true}>
                    <Check checked={selection.isIndexSelected(index)} />
                  </span>
                  <span className="name">{item.name}</span>
                </div>
              ))}
            </SelectionZone>
          </MarqueeSelection>
        </div>
        <div>{this.renderPrimaryButton()}</div>
      </div>
    );
  }

  renderBreadCrumbs() {
    const { listMode } = this.state;
    const { breadcrumbs, maxBreadcrumbs } = this.props;
    if (listMode == "str") {
      return (
        <Breadcrumb
          className="breadcrumbs"
          items={breadcrumbs.slice(0, 1)}
          maxDisplayedItems={maxBreadcrumbs}
        />
      );
    } else if (listMode == "geb") {
      return (
        <Breadcrumb
          className="breadcrumbs"
          items={breadcrumbs}
          maxDisplayedItems={maxBreadcrumbs}
        />
      );
    }
  }

  renderPrimaryButton() {
    const { listMode } = this.state;
    if (listMode == "str") {
      return (
        <PrimaryButton
          disabled={this._isPrimaryButtonDisabled()}
          checked={false}
          text="Select street"
          onClick={() => this._selectStreetOnClick()}
        />
      );
    } else if (listMode == "geb") {
      return (
        <PrimaryButton
          disabled={this._isPrimaryButtonDisabled()}
          checked={false}
          text="Select nr"
          onClick={() => this._selectNumberOnClick()}
        />
      );
    }
  }
}

Content.propTypes = {
  maxBreadcrumbs: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape(IBreadcrumbItem)),
  urlParams: PropTypes.array
};

Content.defaultProps = {
  maxBreadcrumbs: 2,
  breadcrumbs: [
    { text: "Streets", key: "str", onClick: identity },
    { text: "Geb", key: "geb", onClick: identity }
  ],
  urlParams: [["", ""]]
};

export default Content;
