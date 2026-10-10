const endPoint = "jadwal.json";
main();

document.querySelector(".tombol_tambah_alarm").addEventListener("click", () => tampilkanModalJadwalAlarm({}));

async function main() {
  try {
    let seluruhJadwalAlarm = await ambilDataJadwal();
    // Menampilkan Jadwal ke halaman
    let halamanJadwalAlarm = "";
    seluruhJadwalAlarm.forEach((jadwalAlarm, index) => {
      halamanJadwalAlarm += `
       <div class="jadwal_alarm">
                <p class="label">${jadwalAlarm.label}</p>
                <p class="waktu">${jadwalAlarm.jam < 10 ? "0" + jadwalAlarm.jam : jadwalAlarm.jam}:${jadwalAlarm.menit < 10 ? "0" + jadwalAlarm.menit : jadwalAlarm.menit}</p>
                <p class="hari">${ambilHariYangAktif(jadwalAlarm.hari)}</p>
                <input type="checkbox" id="checkboxInput_${index}" class="input_checkbox" ${jadwalAlarm.status ? "checked" : ""}>
                <label for="checkboxInput_${index}" class="toggleSwitch"></label>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="red">
                    <path fill="none"
                        d="m17.004 20-.001-12h-10v12h10.001zm-4.001-10h2v8h-2v-8zm-4 0h2v8h-2v-8zm0-6h6v2h-6z" />
                    <path
                        d="M5.003 20c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V8h2V6h-4V4c0-1.103-.897-2-2-2h-6c-1.103 0-2 .897-2 2v2h-4v2h2v12zm4-16h6v2h-6V4zm-1 4h9l.001 12H7.003V8h1z" />
                    <path d="M9.003 10h2v8h-2zm4 0h2v8h-2z" />
                </svg>
            </div>
      `;
    });

    const pembungkusSemuaJadwalAlarm = document.querySelector(".semua_jadwal_alarm");
    pembungkusSemuaJadwalAlarm.innerHTML = halamanJadwalAlarm;
    // Menambahkan Event Listener
    for (let i = 0; i < pembungkusSemuaJadwalAlarm.childElementCount; i++) {
      // 1. Ketika tombol Toggle di klik : ubah status jadwal
      pembungkusSemuaJadwalAlarm.children[i].children[3].addEventListener("click", function (event) {
        event.stopPropagation();
      });
      pembungkusSemuaJadwalAlarm.children[i].children[4].addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("label");
      });
      // 2. Ketika tong sampah diklik : hapus jadwal alarm
      pembungkusSemuaJadwalAlarm.children[i].children[5].addEventListener("click", function (event) {
        event.stopPropagation();
        console.log("sampah");
      });
      // 3. Ketika Area Jadwal alarm diklik : edit jadwal alarm (dengan menampikan modal)
      pembungkusSemuaJadwalAlarm.children[i].addEventListener("click", () => {
        tampilkanModalJadwalAlarm(seluruhJadwalAlarm[i]);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// ================== MODAL JADWAL ALARM ==================
function tampilkanModalJadwalAlarm(jadwalAlarm) {
  document.querySelector(".modal").innerHTML = ambilHalamaModalJadwalAlarm(jadwalAlarm);
  // Menambahkan Event Listener
  // 1.tutup Modal
  document.querySelector(".tutup_modal_tambah_alarm").addEventListener("click", () => {
    document.querySelector(".modal").innerHTML = "";
  });
  // 2. Setting waktu
  document.querySelectorAll(".main_modal .set_waktu button").forEach((e) => {
    e.addEventListener("click", () => settingWaktu(e));
    e.addEventListener("pointerdown", () => {
      const idSettingWaktu = setInterval(() => {
        settingWaktu(e);
      }, 100);
      e.addEventListener("pointerup", () => clearInterval(idSettingWaktu));
    });
  });
  // 3. Setting hari
  document.querySelectorAll(".main_modal .set_hari span").forEach((elemen) => {
    elemen.addEventListener("click", () => {
      elemen.classList.toggle("hari_aktif");
    });
  });
  // 4. Setting Label
  document.querySelector(".main_modal .set_label").addEventListener("click", () => {
    document.querySelector(".handler_modal_nama_alarm").style.display = "flex";
    document.querySelector(".modal-conten.nama_alarm input").value = document.querySelector(".main_modal .set_label p").innerHTML;
  });
  // 4.1 Simpan / Batal Setting Label
  document.querySelectorAll(".handler_modal_nama_alarm button").forEach((elemen, i) => {
    elemen.addEventListener("click", () => {
      if (i == 1) {
        const inputLabel = document.querySelector(".modal-conten.nama_alarm input").value;
        if (inputLabel) document.querySelector(".main_modal .set_label p").innerHTML = inputLabel;
      }
      document.querySelector(".handler_modal_nama_alarm").style.display = "none";
    });
  });
  // 5 Setting nada dering
  document.querySelector(".set_nada_alarm").addEventListener("click", (e) => {
    if (e.target.classList.contains("kurang_set_nada") || e.target.classList.contains("tambah_set_nada")) {
      e.target.parentElement.children[1].innerHTML = parseInt(e.target.parentElement.children[1].innerHTML) + (e.target.classList.contains("kurang_set_nada") ? -1 : 1);
      if (e.target.parentElement.children[1].innerHTML < 0) e.target.parentElement.children[1].innerHTML = 0;
      if (e.target.parentElement.children[1].innerHTML < 10) e.target.parentElement.children[1].innerHTML = "0" + e.target.parentElement.children[1].innerHTML;
    }
  });
  // 5.1 Setting speaker aktif atau tidak
  document.querySelector(".set_nada_alarm svg").addEventListener("click", function () {
    if (this.dataset.statusSpeaker == "aktif") {
      this.dataset.statusSpeaker = "nonAktif";
      this.innerHTML = `<path d="M10.6 5L13 3V8M3 3L21 21M13 18V21L7 16H5C3.89543 16 3 15.1046 3 14V10C3 9.63571 3.09739 9.29417 3.26756 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      this.dataset.statusSpeaker = "aktif";
      this.innerHTML = `
           <path opacity="0.15"
              d="M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" fill="#000000" />
          <path
              d="M16 8.99998C16.5 9.49999 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z"
              stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`;
    }
  });
}
function ambilDataJadwal() {
  return fetch(endPoint).then((response) => response.json());
}
function ambilHariYangAktif(hari) {
  if (hari == 127) {
    return "Setiap Hari";
  }
  const hariHari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  let hariYangAktif = "";
  for (let i = 0; i < 7; i++) {
    if ((hari >> i) & 1) {
      hariYangAktif += ` ${hariHari[i]} `;
    }
  }
  return hariYangAktif;
}
function settingWaktu(e) {
  if (e.classList.contains("tambah_jam") || e.classList.contains("kurang_jam")) {
    e.parentElement.children[1].innerHTML = parseInt(e.parentElement.children[1].innerHTML) + (e.classList.contains("tambah_jam") ? 1 : -1);
    if (e.parentElement.children[1].innerHTML < 0) e.parentElement.children[1].innerHTML = "23";
    if (e.parentElement.children[1].innerHTML > 23) e.parentElement.children[1].innerHTML = "0";
    if (e.parentElement.children[1].innerHTML < 10) e.parentElement.children[1].innerHTML = "0" + e.parentElement.children[1].innerHTML;
  } else {
    e.parentElement.children[1].innerHTML = parseInt(e.parentElement.children[1].innerHTML) + (e.classList.contains("tambah_menit") ? 1 : -1);
    if (e.parentElement.children[1].innerHTML < 0) e.parentElement.children[1].innerHTML = "59";
    if (e.parentElement.children[1].innerHTML > 59) e.parentElement.children[1].innerHTML = "0";
    if (e.parentElement.children[1].innerHTML < 10) e.parentElement.children[1].innerHTML = "0" + e.parentElement.children[1].innerHTML;
  }
}

function ambilHalamaModalJadwalAlarm(dataAlarm) {
  const dataAlarmTersedia = dataAlarm.label == undefined ? false : true;
  return `<div class="latar_belakang_modal handler_modal_tambah_alarm">
            <div class="modal-conten conten_tambah_alarm">
                <div class="header_modal">
                    <svg fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" class="tutup_modal_tambah_alarm">
                        <path
                            d="M13.414 12l4.95-4.95a1 1 0 0 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 0 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414-1.414z" />
                    </svg>
                    <p>${dataAlarmTersedia ? "Edit" : "Tambah"} Alarm</p>
                    <svg fill="#000000" width="30px" height="30px" viewBox="0 0 24 24">
                        <path
                            d="M9.172 18.657a1 1 0 0 1-.707-.293l-5.657-5.657a1 1 0 0 1 1.414-1.414l4.95 4.95L19.778 5.636a1 1 0 0 1 1.414 1.414L9.879 18.364a1 1 0 0 1-.707.293z" />
                    </svg>
                </div>
                <div class="main_modal">
                    <div class="set_waktu">
                        <div class="jam">
                            <button class="tambah_jam">+</button>
                            <d>${dataAlarmTersedia ? (dataAlarm.jam < 10 ? "0" + dataAlarm.jam : dataAlarm.jam) : "00"}</d>
                            <button class="kurang_jam">-</button>
                        </div>
                        <span>:</span>
                        <div class="menit">
                            <button class="tambah_menit">+</button>
                            <div>${dataAlarmTersedia ? (dataAlarm.menit < 10 ? "0" + dataAlarm.menit : dataAlarm.menit) : "00"}</div>
                            <button class="kurang_menit">-</button>
                        </div>
                    </div>
                    <div class="set_hari">
                        <span class="${(dataAlarm.hari >> 0) & 1 ? "hari_aktif" : ""}">Sen</span>
                        <span class="${(dataAlarm.hari >> 1) & 1 ? "hari_aktif" : ""}">Sel</span>
                        <span class="${(dataAlarm.hari >> 2) & 1 ? "hari_aktif" : ""}">Rab</span>
                        <span class="${(dataAlarm.hari >> 3) & 1 ? "hari_aktif" : ""}">Kam</span>
                        <span class="${(dataAlarm.hari >> 4) & 1 ? "hari_aktif" : ""}">Jum</span>
                        <span class="${(dataAlarm.hari >> 5) & 1 ? "hari_aktif" : ""}">Sab</span>
                        <span class="${(dataAlarm.hari >> 6) & 1 ? "hari_aktif" : ""}">Min</span>
                    </div>
                    <hr>
                    <div class="set_label">
                        <h3>Label</h3>
                        <p>${dataAlarm.label ? dataAlarm.label : "Alarm baru"}</p>
                    </div>
                    <hr>
                    <div class="set_nada_alarm">
                        <h3>Nada Alarm</h3>
                        <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" data-status-speaker="nonAktif">
                                  <path d="M10.6 5L13 3V8M3 3L21 21M13 18V21L7 16H5C3.89543 16 3 15.1046 3 14V10C3 9.63571 3.09739 9.29417 3.26756 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>
                            <button class="kurang_set_nada">-</button>
                            <span>${dataAlarm.dering ? (dataAlarm.dering < 10 ? "0" + dataAlarm.dering : dataAlarm.dering) : "00"}</span>
                            <button class="tambah_set_nada">+</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="latar_belakang_modal handler_modal_nama_alarm">
            <div class="modal-conten nama_alarm">
                <h3>Nama Alarm</h3>
                <input type="text" placeholder="Masukan nama alarm" maxlength="11">
                <div>
                    <button>Batal</button>
                    <button>Simpan</button>
                </div>
            </div>
        </div>`;
}
