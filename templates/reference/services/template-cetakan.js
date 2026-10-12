/* ---------------------------------------------------------------------------
 * Training-local copy of the report/template helpers that the ported
 * ui-element and training views call.
 *
 * The monolith kept these in `shared/services/admin/template-cetakan.js`, a
 * 10,504-line file whose axios clients come from the host's Keycloak-bound
 * `http-service-factory.js`. A federation remote has none of that, so this
 * module carries the 14-function closure the views actually reach. The three
 * functions that make HTTP calls (`getDetailsTemplateCetakanByNameV2`,
 * `getDetailsTemplateCetakanExtendByIdAndKeyV2`, `deleteTemplateCetakanExtendV2`)
 * are rewired below to the module's own `pentadbiran` client and the local
 * `returnResponse*` helpers; the rest are pure schema/response transforms copied
 * byte-for-byte. The audit trail and the response shapers come from ./http.
 * ------------------------------------------------------------------------- */

import {
  confirmSwal,
  delay,
  errorSwal,
  getMatchReportSchemaWithData,
  notEmpty,
  replaceDoubleBracket
} from "@2enapps/ui";
import { pentadbiran, returnResponseDelete, returnResponseDetails } from "./http";

/* -------------------------------------------------------------------------
 * Lifted from `template-cetakan.js` of `dreams-mfe` (branch develop).
 *
 * Copied, not moved: the original stays in the Shell's full copy of the file.
 * Bodies are byte-identical — only the surrounding comments differ.
 * ------------------------------------------------------------------------- */

export async function listLinkActionsLaporan(listLaporan, linkActions, self) {
  let idLaporan = linkActions.field.linkComponent.id;
  self.linkComponentTitle = "";
  if (idLaporan && listLaporan) {
    var result = listLaporan.data.find((obj) => {
      return obj.id === idLaporan;
    });
    var newResult = {};
    Object.assign(newResult, result);
    if (linkActions.field.linkComponent.paramsFilter) {
      newResult["extraParams"] = replaceDoubleBracket(
        linkActions.field.linkComponent.paramsFilter,
        linkActions.data,
      );
    }
    if (linkActions.data) {
      self.linkComponentTitle =
        newResult.title +
        replaceDoubleBracket(
          linkActions.field.linkComponent.paramsDisplay,
          linkActions.data,
        );
      self.linkComponentTitle = self.linkComponentTitle.toUpperCase();
      newResult.title = self.linkComponentTitle;
    }
    Object.assign(self.linkSchemaDataReport, newResult);
  }
  self.isModalLinkComponentVisible = true;
}

export async function reassingedFormValue(extraParams, selfThis) {
  if (extraParams) {
    var queryparams =
      extraParams.indexOf("?") > -1 ? extraParams.split("?")[1] : extraParams;
    var params = queryparams.split("&");
    var pair = null,
      data = [];
    let self = selfThis;
    params.forEach(function (d) {
      pair = d.split("=");
      data.push({ key: pair[0], value: pair[1] });
      if (
        self.$refs.searchForm.formData[pair[0]] ||
        self.$refs.searchForm.formData[pair[0]] == null
      ) {
        self.$refs.searchForm.formData[pair[0]] = pair[1];
      }
    });
  }
}

export async function deleteTemplateExtend(id, self) {
  if (
    await confirmSwal(
      "Hapus Data",
      "Adakah anda pasti? Data yang dipadam tidak akan dikembalikan.",
    )
  ) {
    deleteTemplateCetakanExtendV2(id)
      .then(() =>
      //result
      {
        self.idCetakanTemplateExtend = "";
        self.isReload = false;
        self.$nextTick(() => {
          self.getReport(self.cetakanName);
        });
      },
      )
      .catch((error) => {
        errorSwal("Ralat", error);
      });
  }
}

export function getDefaultOrentation(templeteList) {
  let defaultOrientation = "";
  if (templeteList && Array.isArray(templeteList) && templeteList.length > 0) {
    //console.log("check orientation templeteList : ",  templeteList);
    for (var i = 0; i < templeteList.length; i++) {
      //console.log("check orientation templeteList index "+i+"; templeteList["+i+"] : ",  templeteList[i]);
      if (
        templeteList[i] &&
        templeteList[i].data &&
        templeteList[i].data.reportSchema
      ) {
        if (templeteList[i].data.reportSchema.orientation == "potrait") {
          if (!defaultOrientation) {
            defaultOrientation = "p";
          } else if (defaultOrientation != "p") {
            defaultOrientation = "";
            break;
          }
        } else if (
          templeteList[i].data.reportSchema.orientation == "landscape"
        ) {
          if (!defaultOrientation) {
            defaultOrientation = "l";
          } else if (defaultOrientation != "l") {
            defaultOrientation = "";
            break;
          }
        } else if (templeteList[i].data.reportSchema.orientation == "thermal") {
          if (!defaultOrientation) {
            defaultOrientation = "t";
          } else if (defaultOrientation != "t") {
            defaultOrientation = "";
            break;
          }
        } else {
          if (!defaultOrientation) {
            defaultOrientation = "p";
          }
        }
      }
    }
    //  console.log("check orientation 1 : ",  result[i].data.reportSchema.orientation);
  } else if (notEmpty(templeteList)) {
    if (templeteList && templeteList.data && templeteList.data.reportSchema) {
      if (templeteList.data.reportSchema.orientation == "potrait") {
        defaultOrientation = "p";
      } else if (templeteList.data.reportSchema.orientation == "landscape") {
        defaultOrientation = "l";
      } else {
        defaultOrientation = "p";
      }
    }
  }
  return defaultOrientation;
}

export function reconstructSchemaExtraHeader(
  schemaExtraHeader,
  schemaExtraHeaderAsal,
) {
  console.log(
    "reconstructSchemaExtraHeader schemaExtraHeader MASUKKK : ",
    schemaExtraHeader,
  );
  let newSchemaExtraHeader = JSON.parse(JSON.stringify(schemaExtraHeaderAsal));
  console.log(
    "reconstructSchemaExtraHeader schemaExtraHeader BEFORE : ",
    newSchemaExtraHeader,
  );
  console.log(
    "reconstructSchemaExtraHeader schemaExtraHeader   schemaExtraHeader.data : ",
    schemaExtraHeader.data,
  );

  let newSide = [];
  for (
    let i = 0;
    i <
    (newSchemaExtraHeader.panelNumber ? newSchemaExtraHeader.panelNumber : 1);
    i++
  ) {
    console.log(
      "reconstructSchemaExtraHeader schemaExtraHeader BEFORE : ",
      newSchemaExtraHeader,
    );

    newSide[i] = {
      percentColLabel: newSchemaExtraHeader.sides.percentColLabel
        ? newSchemaExtraHeader.sides.percentColLabel
        : 35,
      percentColSaperator: newSchemaExtraHeader.sides.percentColSaperator
        ? newSchemaExtraHeader.sides.percentColSaperator
        : 5,
      percentColValue: newSchemaExtraHeader.sides.percentColValue
        ? newSchemaExtraHeader.sides.percentColValue
        : 60,

      fields: [],
    };

    if (
      schemaExtraHeader.excelSetting &&
      schemaExtraHeader.excelSetting.panel &&
      schemaExtraHeader.excelSetting.panel[i]
    ) {
      newSide[i]["excelSetting"] = schemaExtraHeader.excelSetting.panel[i];
    }
  }
  let currentSideIndex = 0;
  console.log(
    "reconstructSchemaExtraHeader schemaExtraHeader.sides.fields  : ",
    newSchemaExtraHeader.sides.fields,
  );
  if (
    newSchemaExtraHeader &&
    newSchemaExtraHeader.sides &&
    newSchemaExtraHeader.sides.fields
  ) {
    newSchemaExtraHeader.sides.fields.map(function (objFields, indexFields) {
      indexFields;
      if (schemaExtraHeader.data[objFields.name] || objFields.alwaysShow) {
        newSide[currentSideIndex].fields.push(objFields);
        if (currentSideIndex + 1 == newSchemaExtraHeader.panelNumber) {
          currentSideIndex = 0;
        } else {
          currentSideIndex++;
        }
      }
    });
  }

  let panelSizeTheSame = true;
  for (
    let i = 0;
    i <
    (newSchemaExtraHeader.panelNumber ? newSchemaExtraHeader.panelNumber : 1);
    i++
  ) {
    console.log(
      "reconstructSchemaExtraHeader newSide[" + i + "].length : ",
      newSide[i].fields.length,
    );
    if (
      i + 1 < newSchemaExtraHeader.panelNumber &&
      newSide[i].fields.length != newSide[i + 1].fields.length
    ) {
      panelSizeTheSame = false;
    }
  }
  //console.log("reconstructSchemaExtraHeader panelSizeTheSame : ", panelSizeTheSame);
  if (!panelSizeTheSame) {
    newSide[newSchemaExtraHeader.panelNumber - 1].fields.push({
      label: "",
      name: "",
    });
  }

  //console.log("reconstructSchemaExtraHeader newSide AFTER: ", newSide);
  delete newSchemaExtraHeader.sides.fields;
  newSchemaExtraHeader["sides"] = newSide;
  newSchemaExtraHeader["data"] = schemaExtraHeader.data;
  console.log(
    "reconstructSchemaExtraHeader newSide FINALLLL : ",
    newSchemaExtraHeader,
  );
  //Object.assign(schemaExtraHeader.sides, newSide)
  return newSchemaExtraHeader;
}

export function calculateRowSpansFlatJson(items, columns) {
  const result = [...items]; // Clone to avoid mutation

  console.log("calculateRowSpans result : ", result);

  // For each column, calculate rowspan
  columns.forEach((column) => {
    console.log("calculateRowSpans column : ", column);

    let i = 0;
    while (i < result.length) {
      const currentValue = result[i][column];
      let rowSpanCount = 1;

      // Count consecutive rows with the same value for the column
      for (
        let j = i + 1;
        j < result.length && result[j][column] === currentValue;
        j++
      ) {
        rowSpanCount++;
      }

      // Set the rowspan count for the first occurrence and 0 for the rest
      result[i][`${column}Props`] = {
        rowSpan: rowSpanCount,
        colSpan: rowSpanCount > 0 ? 1 : 0,
      };
      for (let j = i + 1; j < i + rowSpanCount; j++) {
        result[j][`${column}Props`] = {
          rowSpan: 0,
        };
      }

      // Move to the next group
      i += rowSpanCount;
    }
  });
  console.log("calculateRowSpans RETURN   result : ", result);
  return result;
}

export async function setupDynamicContentTemplate(
  cetakanName,
  reportData,
  resultSetTemplete,
  self,
) {
  if (
    notEmpty(self.dynamicContentTemplete) &&
    self.dynamicContentTemplete.length > 0
  ) {
    self.dynamicContentTemplete.forEach((dynamicContent) => {
      // console.log('getPrintSchemaByName dynamicContent :::::::: ', dynamicContent)
      if (dynamicContent.datatableName) {
        let index = self.reportSchemaContent.content.findIndex(
          (x) => x.datatableName === dynamicContent.datatableName,
        );
        if (index > -1) {
          // console.log('getPrintSchemaByName  ADA result.data.reportSchema.content[index] :::::::: ',  resultSetTemplete.data.reportSchema.content[index])
          // console.log('getPrintSchemaByName  ADA dynamicContent.para :::::::: ',  dynamicContent.para)
          self.reportSchemaContent.content[index].para = dynamicContent.para;
          if (
            self.reportSchemaContent.content[index].type ==
            "ordered-bullet-dynamic"
          ) {
            self.reportSchemaContent.content[index].type = "ordered-bullet";
          } else if (
            self.reportSchemaContent.content[index].type ==
            "unordered-bullet-dynamic"
          ) {
            self.reportSchemaContent.content[index].type = "unordered-bullet";
          } else if (
            self.reportSchemaContent.content[index].type == "para-dynamic"
          ) {
            self.reportSchemaContent.content[index].type = "para";
          }
          //console.log('getPrintSchemaByName  ADA self.reportSchemaContent.content[index].para :::::::: ',  self.reportSchemaContent.content[index].para)
        }
      } else if (dynamicContent.dynamicVariable && dynamicContent.replaceText) {
        // console.log(
        //   "getPrintSchemaByName  ADA DINAMIK TEXT:::::::: ",
        //   dynamicContent.replaceText
        // );

        let data = {};
        data[dynamicContent.dynamicVariable] = dynamicContent.replaceText;
        // console.log(
        //   "getPrintSchemaByName  ADA DINAMIK TEXT data:::::::: ",
        //   data
        // );
        // console.log(
        //   "getPrintSchemaByName  ADA DINAMIK TEXT self.reportSchemaContent:::::::: ",
        //   self.reportSchemaContent
        // );
        getMatchReportSchemaWithData(self.reportSchemaContent, data);
      }
    });
  }
}

export async function setupTemplate(cetakanName, reportData, self) {
  self.reportSchemaContent = {};
  self.suratName = "";
  self.isLoading = true;
  console.log(
    "setupTemplate getPrintSchemaByName cetakanName :::::::: ",
    cetakanName,
  );
  getDetailsTemplateCetakanByNameV2(cetakanName)
    .then(async (result) => {
      console.log(
        "setupTemplate getDetailsTemplateCetakanByNameV2 result :::::::: ",
        result,
      );
      // console.log('setupTemplate getPrintSchemaByName result.data.reportSchema.content :::::::: ', result.data.reportSchema.content)
      // console.log('setupTemplate getPrintSchemaByName reportData :::::::: ', reportData)
      let defaultOrientation = getDefaultOrentation(result);
      self.reportSchemaContent = result.data.reportSchema;
      setupDynamicContentTemplate(cetakanName, reportData, result, self);

      /*
      let isHideNoData =
      result &&
      result.data &&
      result.data.reportSchema &&
      result.data.reportSchema.isHideNoData
        ? result.data.reportSchema.isHideNoData
        : false;
      */

      //console.log('getDetailsTemplateCetakanExtendByIdAndKeyV2 param idTemplate : '+result.data.id+'; keyExtend : '+self.keyExtend+' ')

      self.idTemplateCetakan = result.data.id;
      getDetailsTemplateCetakanExtendByIdAndKeyV2(
        result.data.id,
        self.keyExtend,
      )
        .then((resultExtend) => {
          //console.log('getDetailsTemplateCetakanExtendByKey kertas pertimbangan resultExtend :::::::: ', resultExtend)
          if (
            resultExtend &&
            notEmpty(resultExtend.data) &&
            resultExtend.data.id
          ) {
            //if ada data
            self.idCetakanTemplateExtend = resultExtend.data.id;
            self.reportSchemaContent = resultExtend.data.reportSchema;
            self.isLoading = false;
            self.suratName = self.reportSchemaContent.name;
            self.reportSchemaContent["defaultPaper"] = self.defaultPaper;
            self.reportSchemaContent["defaultOrientation"] = defaultOrientation;
            //self.reportSchemaContent['defaultOrientation'] = self.defaultOrientation
            self.isModalVisible = true;
            self.isReload = true;
          } else {
            if (self.reportSchemaContent) {
              // console.log(
              //   "setupTemplate self.reportSchemaContent :::::::::: ",
              //   self.reportSchemaContent
              // );
              // console.log("setupTemplate reportData :::::::::: ", reportData);

              getMatchReportSchemaWithData(
                self.reportSchemaContent,
                reportData,
              );
              self.isLoading = false;
              self.suratName = self.reportSchemaContent.name;
              self.reportSchemaContent["defaultPaper"] = self.defaultPaper;
              self.reportSchemaContent["defaultOrientation"] =
                defaultOrientation;
              //self.reportSchemaContent['defaultOrientation'] = self.defaultOrientation
              self.isModalVisible = true;
              self.isReload = true;
            }
          }
          // if (self.reportSchemaContent) {
          //   getMatchReportSchemaWithData(self.reportSchemaContent, reportData);
          //   self.isLoading = false;
          //   self.suratName = this.reportSchemaContent.name;
          //   self.isModalVisible = true;
          //   self.isReload = true;
          // }
        })
        .catch((error) => {
          error;
          if (self.reportSchemaContent) {
            // console.log(
            //   "setupTemplate self.reportSchemaContent :::::::::: ",
            //   self.reportSchemaContent
            // );
            // console.log("setupTemplate reportData :::::::::: ", reportData);

            getMatchReportSchemaWithData(self.reportSchemaContent, reportData);
            self.isLoading = false;
            self.suratName = self.reportSchemaContent.name;
            self.reportSchemaContent["defaultPaper"] = self.defaultPaper;
            // self.reportSchemaContent["defaultOrientation"] =
            //   self.defaultOrientation;
            self.reportSchemaContent["defaultOrientation"] = defaultOrientation;
            self.isModalVisible = true;
            self.isReload = true;
          }
        });
    })
    .catch((error) => {
      self.isLoading = false;
      errorSwal("Ralat", error);
    });
}

export function dynamicJsonList(response, jsonPropLayer) {
  // console.log(
  //   "dynamicJsonList ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: "
  // );
  console.log("dynamicJsonList response ::::: ", response);
  console.log("dynamicJsonList jsonPropLayer ::::: ", jsonPropLayer);

  let datas = response.data.data;
  let result = [];
  //let mainIndex = 0;
  const searchParams = new URLSearchParams(response.config.url);
  let pageSize = searchParams.get("pageSize");
  console.log("dynamicJsonList searchParams ::::: ", searchParams);
  console.log("dynamicJsonList pageSize ::::: ", pageSize);
  //console.log("dynamicJsonList datas ::::: ", datas);

  datas.forEach((mainData, index) => {
    index;
    //mainData;
    let object = {};
    // console.log("dynamicJsonList 1st layer ::::: ", jsonPropLayer);
    // console.log("dynamicJsonList 1st layer mainData ::::: ", mainData);

    if (
      notEmpty(jsonPropLayer)
      // && index == 0
    ) {
      if (jsonPropLayer.firstLayerNo) {
        mainData["bil"] = index + 1 + (response.data.pageNo - 1) * pageSize;
        console.log("dynamicJsonList set BILLLL ::::: ", mainData["bil"]);
        // object["bilProps"] = {
        //   data: object["bil"],
        //   rowSpan: 1,
        //   colSpan: 1,
        //   setIndex: result.length,
      }
      //

      processJsonObject(
        jsonPropLayer.layer,
        object,
        mainData,
        result,
        true,
        {},
        jsonPropLayer.firstLayerNo,
      );
    }
    console.log("dynamicJsonList datas ::::: ", datas);
  });
  // console.log(
  //   "dynamicJsonList result result ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ",
  //   result
  // );
  // jsonPropLayer;
  // datas;
  // result;
  // mainIndex;
  // pageSize;

  return result;
}

export function processJsonObject(
  jsonProp,
  object,
  datas,
  result,
  isFirstLayer,
  parentProp,
  firstLayerNo,
) {
  // console.log("11111111111111 processJsonObject jsonProp.fields ::::: ", jsonProp.fields);
  // console.log("11111111111111 processJsonObject parentProp ::::: ", parentProp);
  isFirstLayer;

  if (notEmpty(jsonProp.fields)) {
    // console.log("processJsonObject jsonProp 44444444444 :::: ", jsonProp);

    if (isFirstLayer) {
      jsonProp.fields.forEach((field) => {
        field["setName"] = !field["setName"] ? field.name : field["setName"];
        //console.log("processJsonObject parentProp  ::::: ", datas[field.name+ "Props"]);
        object[field.setName] = datas[field.name];
        object[field.setName + "Props"] = {
          data: datas[field.name],
          rowSpan: 1,
          colSpan:
            datas[field.name + "Props"] &&
              datas[field.name + "Props"]["colSpan"] > -1
              ? datas[field.name + "Props"]["colSpan"]
              : 1,
          fontStyle:
            datas[field.name + "Props"] &&
              datas[field.name + "Props"]["fontStyle"]
              ? datas[field.name + "Props"]["fontStyle"]
              : "",
          fontWeight:
            datas[field.name + "Props"] &&
              datas[field.name + "Props"]["fontWeight"]
              ? datas[field.name + "Props"]["fontWeight"]
              : "",
          setIndex: result.length,
        };
        parentProp[field.setName + "Props"] = object[field.setName + "Props"];
        parentProp[field.setName] = object[field.setName];
      });

      //console.log("processJsonObject parentProp 222222222 ::::: ", parentProp);
      if (notEmpty(jsonProp.children)) {
        // console.log(
        //   "processJsonObject dt[jsonProp.children.name]::::: ",
        //   datas[jsonProp.children.name]
        // );
        processJsonObject(
          jsonProp.children,
          //{...object},
          JSON.parse(JSON.stringify(object)),
          datas[jsonProp.children.name],
          result,
          false,
          JSON.parse(JSON.stringify(parentProp), firstLayerNo),
        );
      } else {
        // console.log("check processJsonObject result::::: ", result);
        // console.log("check processJsonObject object ::::: ", object);

        result.push({ ...object });
        object = JSON.parse(JSON.stringify(object));
      }
    } else {
      if (Array.isArray(datas) && datas.length > 0) {
        datas.forEach((dt, indexDt) => {
          indexDt;
          // console.log("dt ::::::: " + indexDt + " : ", dt);
          // console.log("processJsonObject jsonProp 3333333333 :::: ", jsonProp);

          if (result && result[result.length - 1]) {
            let checkExist = true;
            let lastElementResult = result[result.length - 1];
            // console.log(
            //   "YYYYYYYYYYYYYYY jsonProp 3333333333 ::::: ",
            //   jsonProp
            // );
            // console.log(
            //   "YYYYYYYYYYYYYYY parentProp 3333333333 ::::: ",
            //   parentProp
            // );
            // console.log(
            //   `YYYYYYYYYYYYYYY lastElementResult :`,
            //   lastElementResult
            // );
            // console.log(`YYYYYYYYYYYYYYY object :`, object);

            // console.log(`11111111111111 ------------------------------------- parentProp :  `, parentProp);
            // console.log(`CHECKINGGGGGGG ------------------------------------- parentProp :  `, parentProp);
            // console.log(`CHECKINGGGGGGG jsonProp.fields :  `, jsonProp.fields);

            for (let key in parentProp) {
              //console.log(`CHECKINGGGGGGG key vs jsonProp :  `, !!jsonProp.fields.find(item => (item.setName == key || item.setName+"Props" == key)));
              //console.log(`CHECKINGGGGGGG key : `+key+`; lastElementResult : `+lastElementResult[key]["data"]+`; Object : ${object[key]["data"]}:`, (lastElementResult[key]["data"] != object[key]["data"]));

              if (
                key.includes("Props") &&
                !!jsonProp.fields.find(
                  (item) =>
                    item.setName == key || item.setName + "Props" == key,
                ) == false &&
                //&& lastElementResult[key] && object[key]
                lastElementResult[key]["data"] != object[key]["data"]
              ) {
                // console.log(`processJsonObject access KEYYYYYYYYYY 3333333333 ${key}:`, parentProp[key]);
                // console.log(`processJsonObject access lastElementResult 3333333333 ${key}:`, lastElementResult[key] );
                // console.log(`processJsonObject access lastElementResult DATA 3333333333 ${key}:`, lastElementResult[key]["data"] );
                checkExist = false;
              }
            }
            //console.log(`CHECKINGGGGGGG ------------------------------------- checkExist : `, checkExist);

            // console.log(
            //   `processJsonObject access 3333333333 checkExist :`,
            //   checkExist
            // );
            //checkExist
            if (checkExist) {
              for (let key in parentProp) {
                if (
                  !!jsonProp.fields.find(
                    (item) =>
                      item.setName == key || item.setName + "Props" == key,
                  ) == false
                ) {
                  if (key.includes("Props")) {
                    object[key]["rowSpan"] = 0;
                    //result[object[key]["setIndex"]][key]["rowSpan"] += 1
                    //((result[object[key]["setIndex"]][key]["rowSpan"]) + 1);
                  } else {
                    //***TEMP COMMENT */
                    object[key] = "";
                  }
                }
                //console.log(`processJsonObject access 3333333333 ${key}:`, parentProp[key]);
              }
            }
          }
          // console.log(`MMMMMMMMM jsonProp.fields :`, jsonProp.fields);
          // console.log(`MMMMMMMMM parentProp :`, parentProp);

          // jsonProp.fields.forEach((field) => {
          //   object[field.setName] = dt[field.name];
          //   object[field.setName + "Props"] = {
          //     data: dt[field.name],
          //     rowSpan: 1,
          //     colSpan: 1,
          //     setIndex: result.length,
          //   };
          //   // parentProp[field.setName + "Props"] =
          //   //   object[field.setName + "Props"];
          //   // parentProp[field.setName] = object[field.setName];
          // });

          // console.log(`MMMMMMMMM access 77777777777 jsonProp.fields:`, jsonProp.fields[0]["setName"]);
          // console.log(`MMMMMMMMM access 77777777777 result all :`, result);
          // console.log(`MMMMMMMMM access 77777777777 result object :`, object);
          // console.log(`MMMMMMMMM access 77777777777 object setindex :`, object[jsonProp.fields[0]["setName"]]["setIndex"]);
          // console.log(`MMMMMMMMM access 77777777777 result x :`, result[object[jsonProp.fields[0]["setName"]]["setIndex"]]);

          /*
          if (result && result[result.length - 1]) {
            let checkExist = true;
            let lastElementResult = result[result.length - 1];
            for (let key in parentProp) {
             
              if (
                object[key]["data"]  &&  lastElementResult[key]["data"] &&
                key.includes("Props") //&&
                //  (!!jsonProp.fields.find(item => (item.setName == key || item.setName+"Props" == key)) == false)
                // && lastElementResult[key]["data"] != object[key]["data"]                 
              ) {
                checkExist = false;
              }
            }
            if (checkExist) {
              for (let key in parentProp) {
                if (key.includes("Props") && object[key]["setIndex"] &&  result[object[key]["setIndex"]]) {
                   result[object[key]["setIndex"]][key]["rowSpan"] += 1 
                }
              }
            }
          }
          */

          if (
            jsonProp.fields &&
            jsonProp.fields[0] &&
            notEmpty(result) &&
            object[jsonProp.fields[0]["setName"] + "Props"] &&
            result[object[jsonProp.fields[0]["setName"] + "Props"]["setIndex"]]
          ) {
            //if (object["blokProps"] && result[object["blokProps"]["setIndex"]])
            for (let key in parentProp) {
              //console.log(`processJsonObject access 77777777777 result hhhhhh `+key+` :`, result[object[key]["setIndex"]]);
              if (
                key.includes("Props") &&
                result[object[key]["setIndex"]] &&
                result[object[key]["setIndex"]][key] &&
                //&&  result[object[key]["setIndex"]][key]["rowSpan"] > 0
                !!jsonProp.fields.find(
                  (item) =>
                    item.setName == key || item.setName + "Props" == key,
                ) == false
              ) {
                //if (key.includes("Props"))
                //object[key]["rowSpan"] = 0;
                // console.log(`processJsonObject access 77777777777 to ADDDD 111 ${key}:`, result[object[key]["setIndex"]][key][
                //   "rowSpan"
                // ]);

                //if (result[object["blokProps"]["setIndex"]]) {
                result[object[key]["setIndex"]][key]["rowSpan"] =
                  result[object[key]["setIndex"]][key]["rowSpan"] + 1;
                //}
              }
              //console.log(`processJsonObject access 3333333333 ${key}:`, parentProp[key]);
            }
          }

          jsonProp.fields.forEach((field) => {
            field["setName"] = !field["setName"]
              ? field.name
              : field["setName"];
            object[field.setName] = dt[field.name];
            object[field.setName + "Props"] = {
              data: dt[field.name],
              rowSpan: 1,
              //colSpan: 1,
              fontStyle:
                dt[field.name + "Props"] &&
                  dt[field.name + "Props"]["fontStyle"]
                  ? dt[field.name + "Props"]["fontStyle"]
                  : "",
              fontWeight:
                dt[field.name + "Props"] &&
                  dt[field.name + "Props"]["fontWeight"]
                  ? dt[field.name + "Props"]["fontWeight"]
                  : "",
              colSpan:
                dt[field.name + "Props"] &&
                  dt[field.name + "Props"]["colSpan"] > -1
                  ? dt[field.name + "Props"]["colSpan"]
                  : 1,
              setIndex: result.length,
            };
            parentProp[field.setName + "Props"] =
              object[field.setName + "Props"];
            parentProp[field.setName] = object[field.setName];
          });

          if (notEmpty(jsonProp.children)) {
            // console.log(
            //   "processJsonObject dt[jsonProp.children.name]::::: ",
            //   dt[jsonProp.children.name]
            // );
            processJsonObject(
              jsonProp.children,
              //{...object},
              JSON.parse(JSON.stringify(object)),
              dt[jsonProp.children.name],
              result,
              false,
              JSON.parse(JSON.stringify(parentProp), firstLayerNo),
            );
          } else {
            // console.log("check processJsonObject result::::: ", result);
            // console.log("check processJsonObject object ::::: ", object);

            let resetObject = JSON.parse(JSON.stringify(object));
            result.push({ ...resetObject });
            object = JSON.parse(JSON.stringify(resetObject));
          }
        });
      } else {
        //console.log("check processJsonObject result::::: ", result);
        // console.log("check processJsonObject object ::::: ", object);
        // console.log(`QQQQQQQQQQQQQQQQQQQQQ jsonProp :`, jsonProp);
        // console.log(`QQQQQQQQQQQQQQQQQQQQQ parentProp :`, parentProp);
        // console.log(`QQQQQQQQQQQQQQQQQQQQQ access 3333333333 object :`, object);

        if (result && result[result.length - 1]) {
          let checkExist = true;
          let lastElementResult = result[result.length - 1];
          // console.log(
          //   `QQQQQQQQQQQQQQQQQQQQQ access 3333333333 lastElementResult :`,
          //   lastElementResult
          // );

          for (let key in parentProp) {
            // console.log(`QQQQQQQQQQQQQQQQQQQQQ access KEYY ${key}:`, parentProp[key]);
            // console.log(`QQQQQQQQQQQQQQQQQQQQQ access XSAMA 1 ${key}:`, lastElementResult[key]["data"]);
            // console.log(`QQQQQQQQQQQQQQQQQQQQQ access XSAMA 2 ${key}:`, object[key]["data"]);
            if (
              key.includes("Props") &&
              //&& lastElementResult[key] && object[key]
              lastElementResult[key]["data"] != object[key]["data"] &&
              !!jsonProp.fields.find(
                (item) => item.setName == key || item.setName + "Props" == key,
              ) == false
            ) {
              //console.log(`QQQQQQQQQQQQQQQQQQQQQ access XSAMA --------------- `);
              // console.log(`processJsonObject access lastElementResult 3333333333 ${key}:`, lastElementResult[key] );
              // console.log(`processJsonObject access lastElementResult DATA 3333333333 ${key}:`, lastElementResult[key]["data"] );
              checkExist = false;
            }
          }
          // console.log(
          //   `QQQQQQQQQQQQQQQQQQQQQ access 3333333333 checkExist :`,
          //   checkExist
          // );
          //checkExist
          if (checkExist) {
            for (let key in parentProp) {
              //if (notEmpty(object[key]["rowSpan"])) {
              if (key.includes("Props")) {
                object[key]["rowSpan"] = 1;
                //object[key]["colSpan"] = 1;
              } else {
                //***TEMP COMMENT */
                object[key] = "";
              }
              //}
              //console.log(`processJsonObject access 3333333333 ${key}:`, parentProp[key]);
            }
          }

          // else {
          // for (let key in parentProp) {
          //   if (!notEmpty(object[key]["rowSpan"])) {
          //     if (key.includes("Props")) {
          //       object[key] = {
          //         rowSpan: 1,
          //       };
          //     } else {
          //       object[key] = "";
          //     }
          //   }
          // }
          //}
        }

        if (notEmpty(jsonProp)) {
          //console.log("processJsonObject jsonProp 8888888888888888888888 :::: ", jsonProp.children);
          recurCheckLayerJson(jsonProp, object);
        }

        /*

        let lastElementResultBlok = result[result.length - 1];
      if (
        result &&
        lastElementResultBlok &&
        lastElementResultBlok["namaPremisProps"]["data"] ==
          object["namaPremisProps"]["data"] &&
        lastElementResultBlok["noDpaProps"]["data"] ==
          object["noDpaProps"]["data"]
      ) {
        object["bil"] = "";
        object["namaPremis"] = "";
        object["noDpa"] = "";

        object["namaPremisProps"]["rowSpan"] = 1;
        object["noDpaProps"]["rowSpan"] = 1;
        object["bilProps"]["rowSpan"] = 1;
      }
      object["blok"] = "";
      object["aras"] = "";
      object["ruang"] = "";

      object["blokProps"] = {
        rowSpan: 1,
      };
      object["arasProps"] = {
        rowSpan: 1,
      };
      object["ruangProps"] = {
        rowSpan: 1,
      };

      */

        result.push({ ...object });
        object = JSON.parse(JSON.stringify(object));
      }
    }
  }

  //console.log('processJsonObject jsonProp.children ::::: ', jsonProp.children)

  return "";
}

export function recurCheckLayerJson(jsonProp, object) {
  jsonProp.fields.forEach((field) => {
    // console.log('recurCheckLayerJson object ::::: ', object )
    // console.log('recurCheckLayerJson field.setName + "Props"  ::::: ', field.setName + "Props" )
    // console.log('recurCheckLayerJson object[field.setName + "Props"]  ::::: ', object[field.setName + "Props"] )
    object[field.setName] = "";
    object[field.setName + "Props"] = {
      rowSpan: 1,
      colSpan: 1,
    };
  });
  if (notEmpty(jsonProp.children)) {
    recurCheckLayerJson(jsonProp.children, object);
  }
}

export async function getDetailsTemplateCetakanByNameV2(name) {
  console.log("getDetailsTemplateCetakanByNameV2 name : ", name);
  console.log(
    "getDetailsTemplateCetakanByNameV2 listOfCetakanHC : ",
    listOfCetakanHC,
  );


  //offline dlu
  await delay();
  const response = {
    data: listOfCetakanHC.find((item) => item.namaLaporan === name),
  };
  response.data["name"] = response.data["namaLaporan"];
  response.data["reportSchema"] = JSON.parse(response.data["skemaLaporan"]);
  return returnResponseDetails(
    `/format-cetakan/nama-laporan/${name}`,
    response,
  );
  /*
  
    if (process.env.VUE_APP_OFFLINE == "yes") {
      await delay();
      const response = {
        data: listOfCetakanHC.find((item) => item.namaLaporan === name),
      };
      //console.log("getDetailsTemplateCetakanByNameV2 name response : ", response);
      response.data["name"] = response.data["namaLaporan"];
      response.data["reportSchema"] = JSON.parse(response.data["skemaLaporan"]);
  
      // delete response.data["namaLaporan"];
      // delete response.data["skemaLaporan"];
  
      return returnResponseDetails(
        `/format-cetakan/nama-laporan/${name}`,
        response,
      );
    } else {
      console.log("getDetailsTemplateCetakanByName name : ", name);
      const response = await pentadbiran.get(
        `/format-cetakan/nama-laporan/${name}`,
      );
      console.log("getDetailsTemplateCetakanByName name response : ", response);
      response.data["name"] = response.data["namaLaporan"];
      response.data["reportSchema"] = JSON.parse(response.data["skemaLaporan"]);
      delete response.data["namaLaporan"];
      delete response.data["skemaLaporan"];
      console.log(
        "getDetailsTemplateCetakanByName name response FINAL : ",
        response,
      );
      return returnResponseDetails(
        `/format-cetakan/nama-laporan/${name}`,
        response,
      );
    }
      */
}

export async function getDetailsTemplateCetakanExtendByIdAndKeyV2(id, key) {
  key;
  if (process.env.VUE_APP_OFFLINE == "yes") {
    await delay();
    return false;
  } else {
    if (key) {
      const response = await pentadbiran.get(
        `/format-cetakan/${id}/format-cetakan-sub/key/${key}`,
        //`/templateCetakanExtend/getDetailsByKey/${id}/${key}`
      );

      //response.data["name"] = response.data["namaLaporan"]
      response.data["reportSchema"] = JSON.parse(response.data["skemaLaporan"]);

      //delete response.data["namaLaporan"]
      delete response.data["skemaLaporan"];

      //response.data["reportSchema"] = JSON.parse(response.data["reportSchema"]);
      return returnResponseDetails(
        `/format-cetakan/${id}/format-cetakan-sub/key/${key}`,
        response,
      );
    } else {
      return false;
    }
  }
}

export async function deleteTemplateCetakanExtendV2(id) {
  const response = await pentadbiran.delete(`/format-cetakan-sub/${id}`);
  return returnResponseDelete(`/format-cetakan-sub/${id}`, response);
}
