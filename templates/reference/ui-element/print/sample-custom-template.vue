<template>

    <spinner v-if="isLoading" />
    <Modal v-if="isModalVisible" :showModal="isModalVisible" @close="closeModal" size="xl" :title="reportSchema.title">
        <div :id="reportSchema.id" class="mb-5">     
            <div>
                <table style="break-after: page; width: 100%;">
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: right; margin: 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">No. Rujukan :
                                                            {{ contentTemplate?.noRujukanSurat }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Tarikh :
                                                            {{ tarikhSurat }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>{{ namaPemohon
                                                                }}</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>{{
                                                                noPengenalanPemohon }}</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Melalui dan salinan
                                                            :</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ keteranganKementerian
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ alamatKementerian1
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ alamatKementerian2
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ alamatKementerian3
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ alamatKementerian4
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">{{ negeriKementerian
                                                            }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Tuan / Puan</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>




                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>SAMPLE SURAT WITHOUT GUNA TEMPLETE CETAKAN</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Dengan hormatnya saya
                                                            diarah merujuk kepada perkara di atas.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                        <span data-v-35c27eca="" class="mt-1">2. Dimaklumkan bahawa
                                                            tuan/puan telah diluluskan untuk ditawarkan kuarters seperti
                                                            alamat di atas. Sila lengkapkan dan kembalikan semula Surat
                                                            Setuju Terima seperti di <u>Lampiran A</u> dalam tempoh
                                                            <b>tujuh (7) hari bekerja</b> dari tarikh surat ini. Tawaran
                                                            ini adalah terbatal sekiranya tiada maklum balas diterima
                                                            dalam tempoh tersebut. Walau bagaimanapun, tawaran kuarters
                                                            ini adalah bersyarat iaitu tempoh menduduki kuarters ini
                                                            hanya sehingga rumah yang dibeli oleh tuan/puan dengan
                                                            menggunakan Pinjaman Perumahan Kerajaan dalam radius 25
                                                            kilometer dari Bangunan Perdana Putra telah
                                                            diluluskan.</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                        <span data-v-35c27eca="" class="mt-1">3. Oleh yang demikian,
                                                            tuan/puan hendaklah mengosongkan dan menyerahkan kuarters
                                                            yang ditawarkan ini dalam tempoh 45 hari mulai tarikh Sijil
                                                            Layak Menduduki (CF) dan kunci rumah diterima selaras dengan
                                                            Pekeliling Perkhidmatan Sumber Manusia (PPSM) - Kemudahan
                                                            Perumahan Kerajaan. Jika kemudiannya didapati tuan/puan
                                                            telah hilang kelayakan untuk menduduki kuarters, BPH berhak
                                                            menarik balik kemudahan kuarters ini dan tuan/puan boleh
                                                            disabitkan kesalahan, disenarai hitam untuk tawaran tanpa
                                                            had masa serta boleh dikenakan tuntutan bayaran sewa
                                                            kuarters mengikut kadar pasaran bermula dari tarikh hilang
                                                            kelayakan tersebut.</span>
                                                    </p>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Sekian, terima
                                                            kasih.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 0px 0px 10px; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><b>"MALAYSIA
                                                                MADANI"</b></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><b>"BERKHIDMAT UNTUK
                                                                NEGARA"</b></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Saya yang menjalankan
                                                            amanah,</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 60px 0px 0px; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>({{
                                                                pegawaiKuarters }})</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">b.p. Ketua Setiausaha
                                                            Negara</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 12px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Emel :
                                                            {{ emelPegawaiKuarters }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca=""
                                            style="text-align: right; break-before: page; margin: 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><u>Lampiran A</u></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: center; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><b>BAHAGIAN PENGURUSAN
                                                                HARTANAH</b></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><b>JABATAN PERDANA
                                                                MENTERI</b></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: center; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><u>SURAT SETUJU
                                                                TERIMA</u></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca=""
                                            style="float: right; text-align: right; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 20px 0px 0px; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Tarikh :
                                                            {{ tarikhSetujuTerima }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Setiausaha Bahagian</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Bahagian Pengurusan
                                                            Hartanah</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Tuan / Puan</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>PENERIMAAN TAWARAN
                                                                BERSYARAT KUARTERS KERAJAAN DI {{ alamatPenuhKuarters }}
                                                                ({{ kelasKuarters }}) – TUKAR PENAMA</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Dengan hormatnya merujuk
                                                            kepada surat tuan/puan {{ noRujukanSurat }} bertarikh
                                                            {{ tarikhSurat }} mengenai perkara di atas.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; text-align: left; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">2. Saya
                                                            <strong>{{ namaPemohon }}
                                                                ({{ noPengenalanPemohon }})</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" style="display: flex;" class="mt-1">
                                                    <div data-v-35c27eca=""
                                                        style="height: 15px; width: 15px; min-width: 15px; min-height: 15px; margin-right: 10px; border: 1px solid black;">
                                                    </div>
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; text-align: left; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><b>Menerima</b> tawaran
                                                            tersebut dan bersetuju mematuhi syarat yang ditetapkan oleh
                                                            Kerajaan serta bersetuju bahawa:</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <ol data-v-35c27eca="" type="i"
                                            style="font-family: Arial, sans-serif; text-align: left; font-size: 13px; margin: 5px 0px 0px 30px;">
                                            <li data-v-35c27eca="" class="">
                                                <p data-v-35c27eca=""
                                                    style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                    <span data-v-35c27eca="" class="mt-1">tawaran ini akan ditarik balik
                                                        sekiranya saya berkhidmat dengan <b>Badan Berkanun Bukan
                                                            Persekutuan</b> dan tidak menerima saraan sepertimana
                                                        Pegawai Awam Persekutuan;</span>
                                                </p>
                                            </li>
                                            <li data-v-35c27eca="" class="">
                                                <p data-v-35c27eca=""
                                                    style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                    <span data-v-35c27eca="" class="mt-1">kegagalan saya untuk
                                                        melengkapkan semua dokumen-dokumen dan memasuki kuarters dalam
                                                        tempoh <b>tiga puluh (30) hari</b> dari tarikh surat tawaran
                                                        akan menyebabkan tawaran kuarters ini terbatal;</span>
                                                </p>
                                            </li>
                                            <li data-v-35c27eca="" class="">
                                                <p data-v-35c27eca=""
                                                    style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                    <span data-v-35c27eca="" class="mt-1">tawaran kuarters ini adalah
                                                        bersyarat iaitu tempoh menduduki kuarters ini hanya sehingga
                                                        rumah yang dibeli dengan menggunakan Pinjaman Perumahan Kerajaan
                                                        dalam lingkungan 25 kilometer dari Bangunan Perdana Putra telah
                                                        siap dibina dan selamat diduduki. Proses pengosongan dan
                                                        penyerahan kuarters akan dilaksanakan dalam tempoh 45 hari mulai
                                                        tarikh Sijil Layak Menduduki (CF) dan kunci rumah diterima
                                                        selaras dengan Pekeliling Perkhidmatan Sumber Manusia (MyPPSM) -
                                                        Kemudahan Perumahan Kerajaan;</span>
                                                </p>
                                            </li>
                                            <li data-v-35c27eca="" class="">
                                                <p data-v-35c27eca=""
                                                    style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                    <span data-v-35c27eca="" class="mt-1">Jika kemudiannya didapati saya
                                                        telah hilang kelayakan untuk menduduki kuarters, BPH berhak
                                                        menarik balik kemudahan kuarters ini dan saya boleh disabitkan
                                                        kesalahan, disenarai hitam untuk tawaran tanpa had masa serta
                                                        boleh dikenakan tuntutan bayaran sewa kuarters mengikut kadar
                                                        pasaran bermula dari tarikh hilang kelayakan tersebut;
                                                        dan</span>
                                                </p>
                                            </li>
                                            <li data-v-35c27eca="" class="">
                                                <p data-v-35c27eca=""
                                                    style="margin: 0px 0px 10px; text-align: justify; font-size: 13px; font-family: Arial, sans-serif; break-inside: avoid; break-after: auto;">
                                                    <span data-v-35c27eca="" class="mt-1">kegagalan bayaran sewa
                                                        diterima oleh BPH selama tiga (3) bulan berturut-turut boleh
                                                        menyebabkan kemudahan kuarters ini ditarik balik.</span>
                                                </p>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" style="display: flex;" class="mt-1">
                                                    <div data-v-35c27eca=""
                                                        style="height: 15px; width: 15px; min-width: 15px; min-height: 15px; margin-right: 10px; border: 1px solid black;">
                                                    </div>
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; text-align: left; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>Menolak</strong>
                                                            tawaran tersebut dan faham sekiranya saya masih berminat
                                                            untuk menduduki kuarters pada masa akan datang, saya perlu
                                                            membuat permohonan/mendaftar semula.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Sekian, terima
                                                            kasih.</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">Yang Benar,</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: 60px 0px 0px; font-size: 13px; font-family: Arial, sans-serif; text-decoration-line: overline; break-inside: avoid; break-after: auto;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>({{ namaPemohon
                                                                }})</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca=""
                                            style="text-align: left; break-before: page; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 12px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">* NOTA : </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 12px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1">SAMA ADA SETUJU TERIMA
                                                            ATAU TOLAK TAWARAN KUARTERS, SILA EMELKAN LAMPIRAN INI DALAM
                                                            TEMPOH <u>7 HARI BEKERJA</u> DARI TARIKH SURAT TAWARAN KE
                                                            {{ emelPegawaiKuarters }}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>Alamat Potongan
                                                                Gaji (Sekiranya berlainan dari Surat
                                                                Tawaran)</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca=""
                                                            class="mt-1">............................................</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 13px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca=""
                                                            class="mt-1">............................................</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <hr data-v-35c27eca="" color="black" size="1" class="line">
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody data-v-35c27eca="" class="">
                        <tr data-v-35c27eca="">
                            <td data-v-35c27eca="" style="width: 100%;">
                                <div data-v-35c27eca="">
                                    <div data-v-35c27eca="" class="mt-1" style="margin: 0px;">
                                        <div data-v-35c27eca="" style="text-align: left; margin: 5px 0px 0px;">
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 14px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>Untuk Kegunaan
                                                                Pejabat :</strong></span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div data-v-35c27eca="" class="">
                                                <div data-v-35c27eca="" class="">
                                                    <p data-v-35c27eca=""
                                                        style="margin: initial; font-size: 14px; font-family: Arial, sans-serif;">
                                                        <span data-v-35c27eca="" class="mt-1"><strong>Tandatangan
                                                                Pegawai BPH : _______________________ </strong>
                                                            <strong>Nama: _______________________</strong> </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>


        <BCard class="mb-2">

            <div class="row mt-1">
                <div class="col-md-12 text-end ">
                    <button class="btn btn-success  mb-1" @click="printDiv">
                        <i class=" fas fa-print ">
                        </i> Cetak
                    </button>
                </div>

            </div>
        </BCard>




    </Modal>
</template>
<script>
import { printTemplate } from "@2enapps/ui";
import { GeneratedFormModal as Modal } from "@2enapps/ui";
import { notEmpty } from "@2enapps/ui";
//import { TabPrint } from "@2enapps/ui";
import { getDataSampleCustomTemplete } from "@/services/training/print-ui-element";
import { deleteTemplateExtend } from "@/services/training/template-cetakan";
import { confirmSwal } from "@2enapps/ui";
export default {
    name: "surat",
    components: {
        //TabPrint,
        Modal
    },
    props: {
        propSchemaDataReport: Object,
        propId: String,
        cetakanName: String,
        PropCanEdit: {
            type: Boolean,
            required: false,
            default: true,
        },
        propViewsType: String,
        propRoleType: String,
        PropWaterMarkContent: String,
    },
    data() {
        return {
            isReload: false,
            suratName: "",
            isModalVisible: false,
            //reportSchemaContent: {},
            isLoading: false,
            individualSave: false,
            keyExtend: "",
            idTemplateCetakan: "",
            idCetakanTemplateExtend: "",
            viewsType: "",
            roleType: "",
            reportSchema: {},
            contentTemplate: {},
        };
    },
    async created() {
        this.reportSchema = this.propSchemaDataReport
        this.isLoading = true;
        this.viewsType = this.propViewsType;
        this.roleType = this.propRoleType;
        this.keyExtend = this.propId;

        this.getReport(this.cetakanName)
    },
    computed: {
    },
    methods: {
        notEmpty(obj) {
            return notEmpty(obj);
        },
        async closeModal() {
            if (this.PropCanEdit && await confirmSwal('', 'Adakah anda pasti?')) {
                this.isModalVisible = false;
            } else {
                this.isModalVisible = false;
            }
        },
        async deleteCetakanExtend(id) {
            deleteTemplateExtend(id, this)
        },
        printDiv() {
            printTemplate(this)
        },

        getReport(cetakanName) {
            cetakanName
            this.suratName = "";
            this.isLoading = true;
            getDataSampleCustomTemplete(this.propId).then((result) => {
                this.isLoading = false;
                this.contentTemplate = result.data
                this.isModalVisible = true;
                this.$nextTick(() => {
                    this.printDiv()
                    this.isModalVisible = false;
                })

            }).catch((error) => {
                error
                this.isLoading = false;
            });
        },


    }
};
</script>

<style scoped></style>
