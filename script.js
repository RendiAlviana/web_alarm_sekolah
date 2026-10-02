// ============ MODAL TAMBAH ALARM =============
document.querySelector(".tombol_tambah_alarm").addEventListener("click", () => {
  document.querySelector(".header_modal_tambah_alarm").style.display = "flex";
});

document.querySelector(".tutup_modal_tambah_alarm").addEventListener("click", () => {
  document.querySelector(".header_modal_tambah_alarm").style.display = "none";
});

document.querySelectorAll(".main_modal .set_waktu button").forEach((e) => {
  e.addEventListener("click", () => {
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
  });
});

document.querySelector(".set_nada_alarm").addEventListener("click", (e) => {
  if (e.target.classList.contains("kurang_set_nada") || e.target.classList.contains("tambah_set_nada")) {
    e.target.parentElement.children[1].innerHTML = parseInt(e.target.parentElement.children[1].innerHTML) + (e.target.classList.contains("kurang_set_nada") ? -1 : 1);
  }
});
