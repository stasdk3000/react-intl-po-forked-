import { Promise } from "es6-promise";
import WebApiExt from "./WebApiExt";

class DataProvider {
  constructor() {
    if (this.getContext() == null) {
      this.mockApi = true;
    } else {
      this.api = new WebApiExt("8.2");
      this.mockApi = false;
    }
    this.getUserLanguage = this.getUserLanguage.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.getEntities = this.getEntities.bind(this);
    this.unboundAction = this.unboundAction.bind(this);
  }

  getContext() {
    if (typeof GetGlobalContext !== "undefined") {
      return GetGlobalContext(); // eslint-disable-line no-undef
    }
  }

  getUserLanguage() {
    let userLanguage;
    switch (this.getUserLcid()) {
      case "1033":
        userLanguage = "en";
        break;
      case "1031":
        userLanguage = "de";
        break;
      case "1036":
        userLanguage = "fr";
        break;
      case "1040":
        userLanguage = "it";
        break;
      case "3082":
        userLanguage = "es";
        break;
      case "2052":
        userLanguage = "zh";
        break;
      default:
        userLanguage = "en";
    }
    return userLanguage;
  }

  getUserLcid() {
    let lcid;
    if (this.mockApi) {
      lcid = "1033";
    } else {
      lcid = this.getContext().getUserLcid();
    }
    return lcid;
  }

  getClientUrl() {
    let clientUrl;
    if (this.mockApi) {
      clientUrl = "https://mat10.crm4.dynamics.com";
    } else {
      clientUrl = this.getContext().getClientUrl();
    }
    return clientUrl;
  }

  getAccounts() {
    if (this.mockApi) {
      return new Promise((resolve, reject) => {
        const result = {
          "@odata.context":
            "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#accounts(name,createdby,createdon,modifiedby,modifiedon,websiteurl,accountid)",
          value: [
            {
              "@odata.etag": 'W/"558623"',
              name: "Coho Winery (sample)",
              createdon: "2017-08-01T13:30:51Z",
              modifiedon: "2017-08-01T13:31:12Z",
              websiteurl: "http://www.cohowinery.com/",
              accountid: "df234089-bd76-e711-80eb-3863bb34ea78"
            }
          ]
        };
        resolve(result);
      });
    } else {
      const options =
        "$select=name,createdby,createdon,modifiedby,modifiedon,websiteurl,accountid";
      return this.api.retrieveMultiple("accounts", options);
    }
  }

  getEntities() {
    if (this.mockApi) {
      return new Promise((resolve, reject) => {
        const result = {
          "@odata.context":
            "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#EntityDefinitions(DisplayName,MetadataId,LogicalName)",
          value: [
            {
              DisplayName: {
                LocalizedLabels: [
                  {
                    Label: "Account",
                    LanguageCode: 1033,
                    IsManaged: true,
                    MetadataId: "2a4901bf-2241-db11-898a-0007e9e17ebd",
                    HasChanged: null
                  }
                ],
                UserLocalizedLabel: {
                  Label: "Account",
                  LanguageCode: 1033,
                  IsManaged: true,
                  MetadataId: "2a4901bf-2241-db11-898a-0007e9e17ebd",
                  HasChanged: null
                }
              },
              MetadataId: "70816501-edb9-4740-a16c-6a5efbc05d84",
              LogicalName: "account"
            }
          ]
        };
        resolve(result);
      });
    } else {
      const options = "$select=DisplayName,MetadataId,LogicalName";
      return this.api.queryEntityMetadata(options);
    }
  }

  getStringAttributes(entityId) {
    if (this.mockApi) {
      return new Promise((resolve, reject) => {
        const result = {
          "@odata.context":
            "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#EntityDefinitions(LogicalName,Attributes,Attributes(LogicalName,DisplayName))/$entity",
          LogicalName: "account",
          MetadataId: "70816501-edb9-4740-a16c-6a5efbc05d84",
          "Attributes@odata.context":
            "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#EntityDefinitions(70816501-edb9-4740-a16c-6a5efbc05d84)/Attributes(LogicalName,DisplayName)",
          Attributes: [
            {
              "@odata.type": "#Microsoft.Dynamics.CRM.StringAttributeMetadata",
              LogicalName: "emailaddress3",
              DisplayName: {
                LocalizedLabels: [
                  {
                    Label: "Email Address 3",
                    LanguageCode: 1033,
                    IsManaged: true,
                    MetadataId: "1ee8af0c-2341-db11-898a-0007e9e17ebd",
                    HasChanged: null
                  }
                ],
                UserLocalizedLabel: {
                  Label: "Email Address 3",
                  LanguageCode: 1033,
                  IsManaged: true,
                  MetadataId: "1ee8af0c-2341-db11-898a-0007e9e17ebd",
                  HasChanged: null
                }
              },
              MetadataId: "97fb4aae-ea5d-427f-9b2b-9a6b9754286e"
            },
            {
              "@odata.type": "#Microsoft.Dynamics.CRM.StringAttributeMetadata",
              LogicalName: "emailaddress2",
              DisplayName: {
                LocalizedLabels: [
                  {
                    Label: "Email Address 2",
                    LanguageCode: 1033,
                    IsManaged: true,
                    MetadataId: "d999ba00-2341-db11-898a-0007e9e17ebd",
                    HasChanged: null
                  }
                ],
                UserLocalizedLabel: {
                  Label: "Email Address 2",
                  LanguageCode: 1033,
                  IsManaged: true,
                  MetadataId: "d999ba00-2341-db11-898a-0007e9e17ebd",
                  HasChanged: null
                }
              },
              MetadataId: "98b09426-95ab-4f21-87a0-f6775f2b4210"
            }
          ]
        };
        resolve(result);
      });
    } else {
      const options =
        "$select=LogicalName&$expand=Attributes($select=LogicalName,DisplayName;$filter=AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'String')";
      return this.api.queryEntityMetadata(entityId, options);
    }
  }

  unboundAction(name, inputs) {
    if (this.mockApi) {
      return new Promise((resolve, reject) => {
        let result;
        if (inputs.numberId != null) {
          result = {
            "@odata.context":
              "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#mat_plz_str_gebs",
            value: [
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_geb_hnr: 1,
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: 5033,
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 6
              }
            ]
          };
        } else if (inputs.streetId != null) {
          result = {
            "@odata.context":
              "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#mat_plz_str_gebs",
            value: [
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_geb_hnr: 1,
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: 5033,
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 6,
                _mat_gebid_value: "4e1ee258-c190-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_geb_hnr: 2,
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: 5033,
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 6,
                _mat_gebid_value: "501ee258-c190-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_geb_hnr: 4,
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: 5033,
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 6,
                _mat_gebid_value: "521ee258-c190-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_geb_hnr: 5,
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: 5033,
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 6,
                _mat_gebid_value: "5c772400-b590-e711-80f0-3863bb357dc8"
              }
            ]
          };
        } else {
          result = {
            "@odata.context":
              "https://mat10.crm4.dynamics.com/api/data/v8.2/$metadata#mat_plz_str_gebs",
            value: [
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_str_strbez2l: "Brummelstrasse",
                mat_plz_postleitzahl: "5033",
                mat_plz_ortbez27: "Buchs AG",
                mat_plz_kanton: "AG",
                mat_lev_score: 2,
                _mat_strid_value: "3f195e57-b489-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_str_strbez2l: "Brüelstrasse",
                mat_plz_postleitzahl: "4312",
                mat_plz_ortbez27: "Magden",
                mat_plz_kanton: "AG",
                mat_lev_score: 3,
                _mat_strid_value: "ca33674a-b489-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_str_strbez2l: "Brüelstrasse",
                mat_plz_postleitzahl: "8637",
                mat_plz_ortbez27: "Laupen ZH",
                mat_plz_kanton: "ZH",
                mat_lev_score: 3,
                _mat_strid_value: "e24c674a-b489-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_str_strbez2l: "Brüelstrasse",
                mat_plz_postleitzahl: "7323",
                mat_plz_ortbez27: "Wangs",
                mat_plz_kanton: "SG",
                mat_lev_score: 3,
                _mat_strid_value: "d850674a-b489-e711-80f0-3863bb357dc8"
              },
              {
                "@odata.type": "#Microsoft.Dynamics.CRM.mat_plz_str_geb",
                mat_str_strbez2l: "Brüelstrasse",
                mat_plz_postleitzahl: "8280",
                mat_plz_ortbez27: "Kreuzlingen",
                mat_plz_kanton: "TG",
                mat_lev_score: 3,
                _mat_strid_value: "9f592499-b489-e711-80f0-3863bb357dc8"
              }
            ]
          };
        }
        resolve(result);
      });
    } else {
      return this.api.unboundAction(name, inputs);
    }
  }

  getNextPage(query) {
    if (this.mockApi) {
      return new Promise((resolve, reject) => {
        const result = {};
        resolve(result);
      });
    } else {
      return this.api.getNextPage(query);
    }
  }
}

export default DataProvider;
