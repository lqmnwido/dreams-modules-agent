//
import { dashboardTitleSetDateRange, delay, returnResponseList } from "@2enapps/ui";
import { calculateRowSpansFlatJson } from "./template-cetakan";

export async function getDataSimpleChart(params, finalSearchData, type) {
  finalSearchData;
  let responseTranslate = {};
  responseTranslate;
  let response = {};
  await delay();
  response = {
    data: {
      data: [
        {
          id: "1",
          item: "ITEM A",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "2",
          item: "ITEM B",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "3",
          item: "ITEM C",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "4",
          item: "ITEM D",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "5",
          item: "ITEM E",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "6",
          item: "ITEM F",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "7",
          item: "ITEM G",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "8",
          item: "ITEM H",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "9",
          item: "ITEM I",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "10",
          item: "ITEM J",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "11",
          item: "ITEM K",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "12",
          item: "ITEM L",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "13",
          item: "ITEM M",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "14",
          item: "ITEM N",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "15",
          item: "ITEM O",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "16",
          item: "ITEM P",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "17",
          item: "ITEM Q",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "18",
          item: "ITEM R",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "19",
          item: "ITEM S",
          jumlah: Math.floor(Math.random() * 100),
        },
        {
          id: "20",
          item: "ITEM T",
          jumlah: Math.floor(Math.random() * 100),
        },
      ],
      totalItems: 20,
    },
  };

  if (response) {
    response["data"]["dataFooter"] = [];
    let jumlah = 0;
    response["data"]["data"].map(function (obj, index) {
      index;
      jumlah += obj["jumlah"];
    });
    response["data"]["jumlahKeseluruhan"] = jumlah;
    response["data"]["dataFooter"].push({
      id: "JUMLAH",
      item: "JUMLAH",
      jumlah,
    });
    response = JSON.parse(JSON.stringify(response));
    response["titleProp"] = response["titleProp"] = {
      title: dashboardTitleSetDateRange(type?.toUpperCase(), finalSearchData),
    };
  }
  return returnResponseList(`/getDataSimpleChart-${type}/${params}`, response);
}

export async function getDataMultipleSeriesChart(
  params,
  finalSearchData,
  type
) {
  finalSearchData;
  let responseTranslate = {};
  responseTranslate;
  let response = {};
  await delay();
  response = {
    data: {
      data: [
        {
          id: "1",
          item: "ITEM A",
          seriesOne: Math.floor(Math.random() * 100),
          seriesTwo: Math.floor(Math.random() * 100),
          seriesThree: Math.floor(Math.random() * 100),
          seriesFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.seriesOne +
              this.seriesTwo +
              this.seriesThree +
              this.seriesFour
            );
          },
        },
        {
          id: "2",
          item: "ITEM B",
          seriesOne: Math.floor(Math.random() * 100),
          seriesTwo: Math.floor(Math.random() * 100),
          seriesThree: Math.floor(Math.random() * 100),
          seriesFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.seriesOne +
              this.seriesTwo +
              this.seriesThree +
              this.seriesFour
            );
          },
        },
        {
          id: "3",
          item: "ITEM C",
          seriesOne: Math.floor(Math.random() * 100),
          seriesTwo: Math.floor(Math.random() * 100),
          seriesThree: Math.floor(Math.random() * 100),
          seriesFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.seriesOne +
              this.seriesTwo +
              this.seriesThree +
              this.seriesFour
            );
          },
        },
        {
          id: "4",
          item: "ITEM D",
          seriesOne: Math.floor(Math.random() * 100),
          seriesTwo: Math.floor(Math.random() * 100),
          seriesThree: Math.floor(Math.random() * 100),
          seriesFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.seriesOne +
              this.seriesTwo +
              this.seriesThree +
              this.seriesFour
            );
          },
        },
        {
          id: "5",
          item: "ITEM E",
          seriesOne: Math.floor(Math.random() * 100),
          seriesTwo: Math.floor(Math.random() * 100),
          seriesThree: Math.floor(Math.random() * 100),
          seriesFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.seriesOne +
              this.seriesTwo +
              this.seriesThree +
              this.seriesFour
            );
          },
        },
        // {
        //   id: "6",
        //   item: "ITEM F",
        //   seriesOne: Math.floor(Math.random() * 100),
        //   seriesTwo: Math.floor(Math.random() * 100),
        //   seriesThree: Math.floor(Math.random() * 100),
        //   seriesFour: Math.floor(Math.random() * 100),
        //   get jumlah() {
        //     return (
        //       this.seriesOne +
        //       this.seriesTwo +
        //       this.seriesThree +
        //       this.seriesFour
        //     );
        //   },
        // },
        // {
        //   id: "7",
        //   item: "ITEM G",
        //   seriesOne: Math.floor(Math.random() * 100),
        //   seriesTwo: Math.floor(Math.random() * 100),
        //   seriesThree: Math.floor(Math.random() * 100),
        //   seriesFour: Math.floor(Math.random() * 100),
        //   get jumlah() {
        //     return (
        //       this.seriesOne +
        //       this.seriesTwo +
        //       this.seriesThree +
        //       this.seriesFour
        //     );
        //   },
        // },
        // {
        //   id: "8",
        //   item: "ITEM H",
        //   seriesOne: Math.floor(Math.random() * 100),
        //   seriesTwo: Math.floor(Math.random() * 100),
        //   seriesThree: Math.floor(Math.random() * 100),
        //   seriesFour: Math.floor(Math.random() * 100),
        //   get jumlah() {
        //     return (
        //       this.seriesOne +
        //       this.seriesTwo +
        //       this.seriesThree +
        //       this.seriesFour
        //     );
        //   },
        // },
        // {
        //   id: "9",
        //   item: "ITEM I",
        //   seriesOne: Math.floor(Math.random() * 100),
        //   seriesTwo: Math.floor(Math.random() * 100),
        //   seriesThree: Math.floor(Math.random() * 100),
        //   seriesFour: Math.floor(Math.random() * 100),
        //   get jumlah() {
        //     return (
        //       this.seriesOne +
        //       this.seriesTwo +
        //       this.seriesThree +
        //       this.seriesFour
        //     );
        //   },
        // },
        // {
        //   id: "10",
        //   item: "ITEM J",
        //   seriesOne: Math.floor(Math.random() * 100),
        //   seriesTwo: Math.floor(Math.random() * 100),
        //   seriesThree: Math.floor(Math.random() * 100),
        //   seriesFour: Math.floor(Math.random() * 100),
        //   get jumlah() {
        //     return (
        //       this.seriesOne +
        //       this.seriesTwo +
        //       this.seriesThree +
        //       this.seriesFour
        //     );
        //   },
        // },
      ],
      totalItems: 5,
    },
  };

  if (response) {
    response["data"]["dataFooter"] = [];
    let seriesOne = 0,
      seriesTwo = 0,
      seriesThree = 0,
      seriesFour = 0,
      jumlah = 0;
    response["data"]["data"].map(function (obj, index) {
      index;
      seriesOne += obj["seriesOne"];
      seriesTwo += obj["seriesTwo"];
      seriesThree += obj["seriesThree"];
      seriesFour += obj["seriesFour"];
      jumlah += obj["jumlah"];
    });
    response["data"]["jumlahKeseluruhan"] = jumlah;
    response["data"]["dataFooter"].push({
      id: "JUMLAH",
      item: "JUMLAH",
      seriesOne: seriesOne,
      seriesTwo: seriesTwo,
      seriesThree: seriesThree,
      seriesFour: seriesFour,
      jumlah,
    });
    response = JSON.parse(JSON.stringify(response));
    response["titleProp"] = response["titleProp"] = {
      title: dashboardTitleSetDateRange(type?.toUpperCase(), finalSearchData),
    };
  }
  return returnResponseList(
    `/getDataMultipleSeriesChart-${type}/${params}`,
    response
  );
}

export async function getDataDrilldownChart(params, finalSearchData, type) {
  finalSearchData;
  let responseTranslate = {};
  responseTranslate;
  let response = {};
  await delay();
  response = {
    data: {
      data: [
        {
          id: "1",
          item: "ITEM A",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "2",
          item: "ITEM B",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "3",
          item: "ITEM C",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "4",
          item: "ITEM D",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "5",
          item: "ITEM E",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "6",
          item: "ITEM F",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "7",
          item: "ITEM G",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "8",
          item: "ITEM H",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "9",
          item: "ITEM I",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "10",
          item: "ITEM J",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
      ],
      totalItems: 10,
    },
  };

  if (response) {
    response["data"]["dataFooter"] = [];
    let subitemOne = 0,
      subitemTwo = 0,
      subitemThree = 0,
      subitemFour = 0,
      jumlah = 0;
    response["data"]["data"].map(function (obj, index) {
      index;
      subitemOne += obj["subitemOne"];
      subitemTwo += obj["subitemTwo"];
      subitemThree += obj["subitemThree"];
      subitemFour += obj["subitemFour"];
      jumlah += obj["jumlah"];
    });
    response["data"]["jumlahKeseluruhan"] = jumlah;
    response["data"]["dataFooter"].push({
      id: "JUMLAH",
      item: "JUMLAH",
      subitemOne: subitemOne,
      subitemTwo: subitemTwo,
      subitemThree: subitemThree,
      subitemFour: subitemFour,
      jumlah,
    });
    response = JSON.parse(JSON.stringify(response));
    response["titleProp"] = response["titleProp"] = {
      title: dashboardTitleSetDateRange(type?.toUpperCase(), finalSearchData),
    };
  }
  return returnResponseList(
    `/getDataDrilldownChart-${type}/${params}`,
    response
  );
}

export async function getDataDrilldownSunburstChart(
  params,
  finalSearchData,
  type
) {
  finalSearchData;
  let responseTranslate = {};
  responseTranslate;
  let response = {};
  await delay();
  response = {
    data: {
      data: [
        {
          id: "1",
          item: "ITEM A",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "2",
          item: "ITEM B",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
        {
          id: "3",
          item: "ITEM C",
          subitemOne: Math.floor(Math.random() * 100),
          subitemTwo: Math.floor(Math.random() * 100),
          subitemThree: Math.floor(Math.random() * 100),
          subitemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subitemOne +
              this.subitemTwo +
              this.subitemThree +
              this.subitemFour
            );
          },
        },
      ],
      totalItems: 3,
    },
  };

  if (response) {
    response["data"]["dataFooter"] = [];
    let subitemOne = 0,
      subitemTwo = 0,
      subitemThree = 0,
      subitemFour = 0,
      jumlah = 0;
    response["data"]["data"].map(function (obj, index) {
      index;
      subitemOne += obj["subitemOne"];
      subitemTwo += obj["subitemTwo"];
      subitemThree += obj["subitemThree"];
      subitemFour += obj["subitemFour"];
      jumlah += obj["jumlah"];
    });
    response["data"]["jumlahKeseluruhan"] = jumlah;
    response["data"]["dataFooter"].push({
      id: "JUMLAH",
      item: "JUMLAH",
      subitemOne: subitemOne,
      subitemTwo: subitemTwo,
      subitemThree: subitemThree,
      subitemFour: subitemFour,
      jumlah,
    });
    response = JSON.parse(JSON.stringify(response));
    response["titleProp"] = response["titleProp"] = {
      title: dashboardTitleSetDateRange(type?.toUpperCase(), finalSearchData),
    };
  }
  return returnResponseList(
    `/getDataDrilldownChart-${type}/${params}`,
    response
  );
}

export async function getDataDrilldownMultipleSeriesChart(
  params,
  finalSearchData,
  type
) {
  finalSearchData;
  let responseTranslate = {};
  responseTranslate;
  let response = {};
  await delay();
  response = {
    data: {
      data: [
        {
          id: "1",
          item: "ITEM A",
          subItem: "SUB ITEM A.1",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "2",
          item: "ITEM A",
          subItem: "SUB ITEM A.2",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "3",
          item: "ITEM A",
          subItem: "SUB ITEM A.3",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "31",
          item: "ITEM A",
          subItem: "SUB ITEM A.4",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "4",
          item: "ITEM B",
          subItem: "SUB ITEM B.1",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "5",
          item: "ITEM B",
          subItem: "SUB ITEM B.2",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "6",
          item: "ITEM B",
          subItem: "SUB ITEM B.3",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "61",
          item: "ITEM B",
          subItem: "SUB ITEM B.4",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "7",
          item: "ITEM C",
          subItem: "SUB ITEM C.1",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "8",
          item: "ITEM C",
          subItem: "SUB ITEM C.2",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "9",
          item: "ITEM C",
          subItem: "SUB ITEM C.3",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
        {
          id: "91",
          item: "ITEM C",
          subItem: "SUB ITEM C.4",
          subSubItemOne: Math.floor(Math.random() * 100),
          subSubItemTwo: Math.floor(Math.random() * 100),
          subSubItemThree: Math.floor(Math.random() * 100),
          subSubItemFour: Math.floor(Math.random() * 100),
          get jumlah() {
            return (
              this.subSubItemOne +
              this.subSubItemTwo +
              this.subSubItemThree +
              this.subSubItemFour
            );
          },
        },
      ],
      totalItems: 10,
    },
  };

  const arrayByItem = Object.values(
    response["data"]["data"].reduce((acc, data) => {
      if (!acc[data.item]) {
        acc[data.item] = {
          item: data.item,
          subSubItemOne: 0,
          subSubItemTwo: 0,
          subSubItemThree: 0,
          subSubItemFour: 0,
        };
      }
      acc[data.item].subSubItemOne += data.subSubItemOne;
      acc[data.item].subSubItemTwo += data.subSubItemTwo;
      acc[data.item].subSubItemThree += data.subSubItemThree;
      acc[data.item].subSubItemFour += data.subSubItemFour;

      return acc;
    }, {})
  );
  response["firstLayerData"] = arrayByItem;

  if (response) {
    response["data"]["dataFooter"] = [];
    let subSubItemOne = 0,
      subSubItemTwo = 0,
      subSubItemThree = 0,
      subSubItemFour = 0,
      jumlah = 0;
    response["data"]["data"].map(function (obj, index) {
      index;
      subSubItemOne += obj["subSubItemOne"];
      subSubItemTwo += obj["subSubItemTwo"];
      subSubItemThree += obj["subSubItemThree"];
      subSubItemFour += obj["subSubItemFour"];
      jumlah += obj["jumlah"];
    });
    response["data"]["jumlahKeseluruhan"] = jumlah;
    response["data"]["dataFooter"].push({
      id: "JUMLAH",
      item: "JUMLAH",
      subSubItemOne: subSubItemOne,
      subSubItemTwo: subSubItemTwo,
      subSubItemThree: subSubItemThree,
      subSubItemFour: subSubItemFour,
      jumlah,
    });

    response = JSON.parse(JSON.stringify(response));
    response["data"]["listLayer"] = calculateRowSpansFlatJson(
      response["data"]["data"],
      ["item"]
    );
    response["titleProp"] = response["titleProp"] = {
      title: dashboardTitleSetDateRange(type?.toUpperCase(), finalSearchData),
    };
  }

  return returnResponseList(
    `/getDataDrilldownMultipleSeriesChart-${type}/${params}`,
    response
  );
}

export async function getSampleDataKpiOne(params, typeContent) {
  let responseTranslate = [];
  let response = {};
  await delay();
  response = {
    data: {
      jumlahKpiA: Math.floor(Math.random() * 1000) + 100,
      jumlahKpiB: Math.floor(Math.random() * 1000) + 100,
      jumlahKpiC: Math.floor(Math.random() * 1000) + 100,
      jumlahKpiD: Math.floor(Math.random() * 1000) + 100,
    },
  };

  response = JSON.parse(JSON.stringify(response));
  console.log(
    "CHECKAPI DASHBOARD KUARTERS RESPONSE; function : getDataKpi; type : " +
      typeContent +
      "; response : ",
    response
  );
  if (response) {
    responseTranslate = {
      data: {
        data: [
          {
            id: "1",
            jumlah: response.data.jumlahKpiA,
          },
          {
            id: "2",
            jumlah: response.data.jumlahKpiB,
          },
          {
            id: "3",
            jumlah: response.data.jumlahKpiC,
          },
          {
            id: "4",
            jumlah: response.data.jumlahKpiD,
          },
        ],
        totalItems: 4,
      },
    };
  }
  return returnResponseList(`/getSampleDataKpiOne${params}`, responseTranslate);
}
