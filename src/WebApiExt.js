import { WebApi } from "xrm-webapi";

class WebApiExt extends WebApi {
  queryEntityMetadata(queryString, queryOptions) {
    if (queryString != null && !/^[?]/.test(queryString)) {
      queryString = "?" + queryString;
    }
    var query =
      queryString != null
        ? "EntityDefinitions" + queryString
        : "EntityDefinitions";
    var req = super.getRequest("GET", query);
    if (queryOptions != null && typeof queryOptions === "object") {
      req.setRequestHeader("Prefer", super.getPreferHeader(queryOptions));
    }
    return new Promise(function(resolve, reject) {
      req.onreadystatechange = function() {
        if (req.readyState === 4 /* complete */) {
          req.onreadystatechange = null;
          if (req.status === 200) {
            resolve(JSON.parse(req.response));
          } else {
            reject(JSON.parse(req.response).error);
          }
        }
      };
      req.send();
    });
  }

  queryAttributeMetadata(entityId, queryString, queryOptions) {
    if (queryString != null && !/^[?]/.test(queryString)) {
      queryString = "?" + queryString;
    }
    let entitySet;
    if (entityId != null) {
      entitySet = `EntityDefinitions(${entityId})`;
    }
    var query = queryString != null ? entitySet + queryString : entitySet;
    var req = this.getRequest("GET", query);
    if (queryOptions != null && typeof queryOptions === "object") {
      req.setRequestHeader("Prefer", this.getPreferHeader(queryOptions));
    }
    return new Promise(function(resolve, reject) {
      req.onreadystatechange = function() {
        if (req.readyState === 4 /* complete */) {
          req.onreadystatechange = null;
          if (req.status === 200) {
            resolve(JSON.parse(req.response));
          } else {
            reject(JSON.parse(req.response).error);
          }
        }
      };
      req.send();
    });
  }
}

export default WebApiExt;
