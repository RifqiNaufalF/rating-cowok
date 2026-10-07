const ratingData = {
  1: {
    title: "NPC yang kebetulan lewat",
    text: "Belum meninggalkan jejak, selain mungkin jejak sandal. Tenang, aku masih punya 9 level buat bikin kamu berubah pikiran."
  },
  2: {
    title: "Lumayan buat bahan cerita",
    text: "Belum bikin deg-degan, tapi setidaknya nggak langsung di-skip. Anggap aja aku trailer yang perlu versi full movie."
  },
  3: {
    title: "Masih tahap tutorial",
    text: "Aku mulai paham tombol-tombolnya, tapi belum unlock hati kamu. Kasih waktu, siapa tahu achievement-nya: bikin kamu nyaman."
  },
  4: {
    title: "Ada potensi, tapi masih buffering",
    text: "Sinyalnya sudah masuk, koneksinya belum stabil. Mungkin perlu lebih banyak ketemu... demi troubleshooting, tentu saja."
  },
  5: {
    title: "50:50, tapi senyumnya curang",
    text: "Masih netral katanya. Tapi kalau kamu baca ini sambil senyum sedikit, aku anggap server sudah kasih respons positif."
  },
  6: {
    title: "Mulai bahaya, kepikiran pas gabut",
    text: "Aku sudah masuk tab yang belum kamu tutup. Belum jadi favorit, tapi anehnya sering kebuka lagi."
  },
  7: {
    title: "Sudah masuk daftar favorit",
    text: "Nilai segini bikin aku harus pura-pura kalem. Sedikit lagi aku mulai percaya kalau kehadiranku memang kamu tunggu."
  },
  8: {
    title: "Bikin standar cowok naik",
    text: "Ini bukan rating, ini tekanan psikologis buat aku mempertahankan performa. Untungnya, buat kamu aku lumayan niat."
  },
  9: {
    title: "Nyaris bikin curiga",
    text: "Kok tinggi banget? Kamu yakin ini survei, bukan kode halus? Kalau iya, kode diterima dengan sangat profesional."
  },
  10: {
    title: "Fix. Kalau ada 11, pilih 11 kan?",
    text: "Departemen perasaan menyatakan hasil ini sangat membahagiakan. Efek samping: aku bisa makin rajin bikin kamu senyum."
  }
};

const form = document.getElementById("ratingForm");
const grid = document.getElementById("ratingGrid");
const meaningCard = document.getElementById("meaningCard");
const selectedPill = document.getElementById("selectedPill");
const meterFill = document.getElementById("meterFill");
const meterWrap = document.getElementById("meterWrap");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const senderName = document.getElementById("senderName");
const message = document.getElementById("message");
const charCount = document.getElementById("charCount");
const avatarButton = document.getElementById("avatarButton");
const toast = document.getElementById("toast");
const successDialog = document.getElementById("successDialog");
const successTitle = document.getElementById("successTitle");
const successCopy = document.getElementById("successCopy");
const dialogClose = document.getElementById("dialogClose");
const rateAgain = document.getElementById("rateAgain");

let selectedRating = null;
let toastTimer;

for (let i = 1; i <= 10; i += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "rating-btn";
  button.dataset.rating = String(i);
  button.textContent = i;
  button.setAttribute("aria-label", `Rating ${i} dari 10`);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => selectRating(i, button));
  grid.appendChild(button);
}

function selectRating(value, clickedButton) {
  selectedRating = value;

  document.querySelectorAll(".rating-btn").forEach((btn) => {
    const active = Number(btn.dataset.rating) === value;
    btn.classList.toggle("selected", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const data = ratingData[value];
  meaningCard.innerHTML = `
    <div class="meaning-content">
      <div class="meaning-kicker">LEVEL ${value}/10</div>
      <h3>${data.title}</h3>
      <p>${data.text}</p>
    </div>
  `;

  selectedPill.textContent = `${value}/10 terpilih`;
  meterFill.style.width = `${value * 10}%`;
  meterWrap.classList.add("active");
  submitBtn.disabled = false;

  if (navigator.vibrate) navigator.vibrate(12);
  createBurst(clickedButton, value >= 8 ? 8 : 5);
}

function createBurst(target, count = 6) {
  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = i % 2 ? "♡" : "♥";
    heart.style.left = `${cx}px`;
    heart.style.top = `${cy}px`;
    heart.style.fontSize = `${12 + Math.random() * 12}px`;
    heart.style.setProperty("--x", `${(Math.random() - 0.5) * 120}px`);
    heart.style.setProperty("--y", `${-35 - Math.random() * 95}px`);
    heart.style.setProperty("--r", `${(Math.random() - 0.5) * 80}deg`);
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function rainHearts() {
  const symbols = ["♥", "♡", "💗", "💖"];
  for (let i = 0; i < 26; i += 1) {
    const heart = document.createElement("span");
    heart.className = "confetti-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${-10 - Math.random() * 20}px`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    heart.style.animationDelay = `${Math.random() * .45}s`;
    heart.style.setProperty("--drift", `${(Math.random() - .5) * 180}px`);
    heart.style.setProperty("--spin", `${(Math.random() - .5) * 720}deg`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

function showToast(text, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
}

message.addEventListener("input", () => {
  charCount.textContent = String(message.value.length);
});

avatarButton.addEventListener("click", () => {
  avatarButton.classList.remove("pop");
  void avatarButton.offsetWidth;
  avatarButton.classList.add("pop");
  createBurst(avatarButton, 9);
  if (navigator.vibrate) navigator.vibrate([10, 25, 10]);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedRating) {
    showToast("Pilih angka dulu ya. Masa perasaan disuruh menebak sendiri?", true);
    grid.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (document.getElementById("honey").value) return;

  const data = ratingData[selectedRating];
  const originalText = submitText.textContent;
  submitBtn.disabled = true;
  submitText.textContent = "Mengirim perasaan...";

  const payload = new FormData();
  payload.append("_subject", `💘 Rating baru: ${selectedRating}/10`);
  payload.append("_template", "table");
  payload.append("_captcha", "false");
  payload.append("Rating", `${selectedRating}/10`);
  payload.append("Arti Rating", data.title);
  payload.append("Nama Pengirim", senderName.value.trim() || "Anonim");
  payload.append("Pesan", message.value.trim() || "Tidak ada pesan tambahan");
  payload.append("Waktu", new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }));

  try {
    const response = await fetch("https://formsubmit.co/ajax/naufalrifqi203@gmail.com", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload
    });

    if (!response.ok) throw new Error("Submit failed");

    const result = await response.json().catch(() => ({}));
    if (result.success === "false" || result.success === false) throw new Error("Submit rejected");

    if (selectedRating >= 9) {
      successTitle.textContent = "Oke... ini bikin aku senyum sendiri.";
      successCopy.textContent = "Nilainya sudah terkirim. Aku akan berusaha tetap kalem walaupun hasilnya sangat tidak membantu.";
    } else if (selectedRating >= 6) {
      successTitle.textContent = "Noted. Masih punya harapan besar nih.";
      successCopy.textContent = "Makasih udah jujur. Departemen perasaan akan mempelajari feedback ini dengan serius, tapi tetap sambil senyum.";
    } else {
      successTitle.textContent = "Pedih, tapi data tetap data.";
      successCopy.textContent = "Nilainya sudah terkirim. Tenang, aku anggap ini roadmap improvement, bukan penolakan terhadap masa depan.";
    }

    rainHearts();
    if (typeof successDialog.showModal === "function") {
      successDialog.showModal();
    } else {
      showToast("Rating terkirim! Makasih sudah jujur 💗");
    }
  } catch (error) {
    showToast("Belum berhasil terkirim. Coba lagi sebentar ya.", true);
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = originalText;
  }
});

function closeDialog() {
  if (successDialog.open) successDialog.close();
}

dialogClose.addEventListener("click", closeDialog);
rateAgain.addEventListener("click", closeDialog);

successDialog.addEventListener("click", (event) => {
  if (event.target === successDialog) closeDialog();
});
