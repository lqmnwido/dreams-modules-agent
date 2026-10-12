
import { delay } from "@2enapps/ui";


export async function saveBiodata(id, data) {
  console.log("saveKuarters data ::::::: ", data);
  await delay()
  if (id) {
    return data;
  } else {
    return data;
  }
}


export async function getSenaraiBiodata(params) {
  params
  await delay()

  return {
    list: [
      {
        id: "1",
        nama: "Hafiz",
        noKadPengenalan: "000000000000",
        umur: "30",
        alamat1: "24 Jalan 1",
        alamat2: "Kampung Pandan",
        alamat3: "Bandar Kuantan",
        poskod: "25000",
        idBandar: "Kuantan",
        idNegeri: "Pahang",
      },
      {
        id: "2",
        noKadPengenalan: "111111111111",
        nama: "Afiz",
        umur: "25",
        alamat1: "21 Jalan 2",
        alamat2: "Titiwangsa",
        alamat3: "Bandar Kuala Lumpur",
        poskod: "50200",
        idBandar: "Kuala Lumpur",
        idNegeri: "Wilayah Persekutuan"
      },
      {
        id: "3",
        noKadPengenalan: "222222222222",
        nama: "Has",
        umur: "35",
        alamat1: "21 Jalan 3",
        alamat2: "Bandar Utama",
        alamat3: "Petaling Jaya",
        poskod: "47800",
        idBandar: "Petaling Jaya",
        idNegeri: "Selangor"
      },
      {
        id: "4",
        noKadPengenalan: "333333333333",
        nama: "Zul",
        umur: "28",
        alamat1: "Jalan 4",
        alamat2: "Titiwangsa",
        alamat3: "Bandar Kuala Lumpur",
        poskod: "53000",
        idBandar: "Kuala Lumpur",
        idNegeri: "Wilayah Persekutuan"
      },
      {
        id: "5",
        noKadPengenalan: "444444444444",
        nama: "Ali",
        umur: "40",
        alamat1: "Jalan 5",
        alamat2: "Batu Caves",
        alamat3: "Gombak",
        poskod: "68100",
        idBandar: "Batu Caves",
        idNegeri: "Selangor"
      },
    ],
    total: 5,
    listFooter: [],
  }
}

export async function getDetailsBiodata(id) {
  await delay()
  const response = {data:{}}
  if (id == '1') {
    response.data = {
      id: "1",
      noKadPengenalan: "000000000000",
      nama: "Hafiz",
      umur: "30",
      alamat1: "24 Jalan 1",
      alamat2: "Kampung Pandan",
      alamat3: "Bandar Kuantan",
      poskod: "25000",
      idBandar: "0615",
      idNegeri: "06",
    }
  } else if (id == '2') {
    response.data = {
      id: "2",
      noKadPengenalan: "111111111111",
      nama: "Afiz",
      umur: "25",
      alamat1: "21 Jalan 2",
      alamat2: "Titiwangsa",
      alamat3: "Bandar Kuala Lumpur",
      poskod: "50200",
      idBandar: "Kuala Lumpur",
      idNegeri: "Wilayah Persekutuan"
    }
  } else if (id == '3') {
    response.data = {
      id: "3",
      noKadPengenalan: "222222222222",
      nama: "Has",
      umur: "35",
      alamat1: "21 Jalan 3",
      alamat2: "Bandar Utama",
      alamat3: "Petaling Jaya",
      poskod: "47800",
      idBandar: "Petaling Jaya",
      idNegeri: "Selangor",
    }
  } else if (id == '4') {
    response.data = {
      id: "4",
      noKadPengenalan: "333333333333",
      nama: "Zul",
      umur: "28",
      alamat1: "Jalan 4",
      alamat2: "Titiwangsa",
      alamat3: "Bandar Kuala Lumpur",
      poskod: "53000",
      idBandar: "Kuala Lumpur",
      idNegeri: "Wilayah Persekutuan"
    }
  } else if (id == '5') {
    response.data = {
      id: "5",
      noKadPengenalan: "444444444444",
      nama: "Ali",
      umur: "40",
      alamat1: "Jalan 5",
      alamat2: "Batu Caves",
      alamat3: "Gombak",
      poskod: "68100",
      idBandar: "Batu Caves",
      idNegeri: "Selangor"
    }
  } else {
    response.data = {}
  }


  return response;
}

export async function getDetailsPekerjaan(id) {
  // const response = await rest.get(`/posts/${id}`);
  const response = {};

  if (id == '1') {
    response.data = {
      id: "1",
      idKementerian: "20",
      idAgensi: "2018",
      noGaji: "30",
      jumlahPendapatan: "4444",
      tarikhMulaKerja: "02-10-2023 05:52:39 PM",
    }
  } else if (id == '2') {
    response.data = {
      id: "2",
      idKementerian: "20",
      idAgensi: "2018", 
      noGaji: "25",
      jumlahPendapatan: "2222",
      tarikhMulaKerja: "02-10-2023 05:52:39 PM",
    }
  } else if (id == '3') {
    response.data = {
      id: "3",
      idKementerian: "20",
      idAgensi: "2018",
      noGaji: "35",
      jumlahPendapatan: "2222222",
      tarikhMulaKerja: "02-10-2023 05:52:39 PM",
    }
  } else if (id == '4') {
    response.data = {
      id: "4",
      idKementerian: "20",
      idAgensi: "2018",
      noGaji: "28",
      jumlahPendapatan: "22222",
      tarikhMulaKerja: "02-10-2023 05:52:39 PM",
    }
  } else if (id == '5') {
    response.data = {
      id: "5",
      idKementerian: "20",
      idAgensi: "2018",
      noGaji: "40",
      jumlahPendapatan: "2222",
      tarikhMulaKerja: "02-10-2023 05:52:39 PM",
    }
  } 
  return response;
}


export async function deleteBiodata(id) {
  id
  await delay()
  return true;
}
