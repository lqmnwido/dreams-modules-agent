import { pentadbiran } from "./http";
import { returnResponseDetails, returnResponseList } from "@2enapps/ui";
import { returnResponseDelete, returnResponsePost, returnResponsePut } from "./http";

export async function getSenaraiAkaunPengguna(params) {
  const response = await pentadbiran.get(`/pengguna${params}`);

  //return response;
  return returnResponseList(`/pengguna${params}`, response);
}

export async function deleteAkaunPengguna(id) {
  const response = await pentadbiran.delete(`/pengguna/${id}`);
  //return response;
  return returnResponseDelete(`/pengguna/${id}`, response);
}

export async function getDetailsAkaunPengguna(id) {
  console.log(
    "getSenaraiPeranan pentadbiran.get(`/pengguna/${id}`) ::::::: ",
    pentadbiran.get(`/pengguna/${id}`),
  );

  const response = await pentadbiran.get(`/pengguna/${id}`);

  response.data.katalaluan = null;
  response.data.hintKatalaluan = null;
  response.data.bilAnak =
    response.data.bilAnak == "0" ? null : response.data.bilAnak;

  return returnResponseDetails(`/pengguna/${id}`, response);
}

export async function saveAkaunPengguna(id, data) {
  data.bilAnak = !data.bilAnak ? 0 : data.bilAnak;

  if (id) {
    const response = await pentadbiran.put(`/pengguna/${id}`, data);
    //return response;
    return returnResponsePut(`/pengguna/${id}`, response, data);
  } else {
    data["id"] = data["noKadPengenalan"];
    const response = await pentadbiran.post(`/pengguna`, data);
    //return response;
    return returnResponsePost(`/pengguna`, response, data);
  }
}
