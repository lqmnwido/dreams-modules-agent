import { delay, returnResponseDetails } from "@2enapps/ui";

// 
// 

export async function getDataSampelCetakanA(namaLaporan) {
  await delay();
  const response = {
    data: "",
  };
  return returnResponseDetails(
    `/getDataSampelCetakanA/${namaLaporan}`,
    response
  );
}
export async function getDataSampelCetakanB(namaLaporan) {
  await delay();
  const response = {
    data: "",
  };
  return returnResponseDetails(
    `/getDataSampelCetakanB/${namaLaporan}`,
    response
  );
}

export async function getDataSampleCustomTemplete(id) {
  await delay();
  const response = {
    data: {
      noRujukanSurat: 'TEST/RUJUKAN/SURAT',
    },
  };
  return returnResponseDetails(
    `/getDataSampleCustomTemplete/${id}`,
    response
  );
}

export async function getDataSampleTemplete(id) {
  await delay();
  const response = {
    data: {
      noRujukanSurat: 'TEST/RUJUKAN/SURAT',
    },
  };
  return returnResponseDetails(
    `/getDataSampleCustomTemplete/${id}`,
    response
  );
}

