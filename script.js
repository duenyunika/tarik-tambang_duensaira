const $ = id => document.getElementById(id);

let skorKamu = 0;
let skorBot = 0;
let ronde = 0;
let posisiTali = 0;
let soalSekarang = null;
let sudahMenjawab = false;
let pelajaran = "matematika";
let level = "mudah";

const soalMatematika = {
  mudah: [
    { t: "5 + 3 = ?", a: 8, o: [6, 7, 8, 9] },
    { t: "12 - 4 = ?", a: 8, o: [6, 8, 9, 10] },
    { t: "3 × 4 = ?", a: 12, o: [7, 10, 12, 16] },
    { t: "20 ÷ 5 = ?", a: 4, o: [2, 4, 5, 10] },
    { t: "√25 = ?", a: 5, o: [3, 4, 5, 6] }
  ],
  sedang: [
    { t: "15 + 27 = ?", a: 42, o: [32, 40, 42, 45] },
    { t: "9 × 7 = ?", a: 63, o: [54, 56, 63, 72] },
    { t: "81 ÷ 9 = ?", a: 9, o: [7, 8, 9, 10] },
    { t: "√144 = ?", a: 12, o: [10, 11, 12, 14] },
    { t: "50 - 18 = ?", a: 32, o: [28, 30, 32, 38] }
  ],
  sulit: [
    { t: "125 + 275 = ?", a: 400, o: [350, 375, 400, 425] },
    { t: "15 × 12 = ?", a: 180, o: [150, 170, 180, 200] },
    { t: "225 ÷ 15 = ?", a: 15, o: [12, 14, 15, 18] },
    { t: "√289 = ?", a: 17, o: [15, 16, 17, 19] },
    { t: "144 - 67 = ?", a: 77, o: [67, 73, 77, 87] }
  ]
};

const soalPemrograman = {
  mudah: [
    { t: 'Apa fungsi print("Halo") di Python?', a: "Menampilkan teks", o: ["Menghapus teks", "Menampilkan teks", "Menghitung angka", "Mematikan program"] },
    { t: "Tipe data untuk teks disebut ...", a: "String", o: ["Integer", "String", "Boolean", "Float"] },
    { t: "Simbol untuk komentar Python adalah ...", a: "#", o: ["//", "#", "<!--", "**"] },
    { t: "Variabel digunakan untuk ...", a: "Menyimpan nilai", o: ["Menghias layar", "Menyimpan nilai", "Mematikan komputer", "Menghapus kode"] },
    { t: "Tipe data untuk bilangan bulat adalah ...", a: "Integer", o: ["String", "Integer", "Boolean", "List"] }
  ],
  sedang: [
    { t: "Apa hasil dari 3 + 2 * 2?", a: "7", o: ["10", "7", "8", "12"] },
    { t: "Perintah input() digunakan untuk ...", a: "Menerima masukan", o: ["Mencetak teks", "Menerima masukan", "Mengulang kode", "Mengakhiri program"] },
    { t: "if digunakan untuk ...", a: "Mengecek kondisi", o: ["Mengecek kondisi", "Membuat gambar", "Menyimpan file", "Menghapus variabel"] },
    { t: "Tipe data True atau False adalah ...", a: "Boolean", o: ["String", "Float", "Boolean", "Integer"] },
    { t: "for biasanya digunakan untuk ...", a: "Perulangan", o: ["Perulangan", "Menghapus data", "Membuat komentar", "Menghentikan komputer"] }
  ],
  sulit: [
    { t: "Apa hasil len('Python')?", a: "6", o: ["5", "6", "7", "8"] },
    { t: "Apa hasil 10 % 3?", a: "1", o: ["0", "1", "2", "3"] },
    { t: "Operator sama dengan dalam perbandingan adalah ...", a: "==", o: ["=", "==", "!=", "=>"] },
    { t: "Apa hasil bool(0) di Python?", a: "False", o: ["True", "False", "0.0", "None"] },
    { t: "Perintah untuk membuat fungsi Python adalah ...", a: "def", o: ["func", "function", "def", "make"] }
  ]
};

function acak(daftar) {
  return [...daftar].sort(() => Math.random() - 0.5);
}

function mulaiGame() {
  skorKamu = 0;
  skorBot = 0;
  ronde = 0;
  posisiTali = 0;

  pelajaran = $("pelajaran").value;
  level = $("level").value;

  $("menu").classList.add("hidden");
  $("hasil").classList.add("hidden");
  $("arena").classList.remove("hidden");

  tampilSkor();
  soalBerikutnya();
}

function caraBermain() {
  $("petunjuk").textContent =
    "Pilih jawaban yang benar untuk menarik tali ke arahmu. " +
    "Jawaban salah membuat bot menarik tali. " +
    "Permainan terdiri dari 5 ronde. Raih 3 poin untuk menang!";
}

function keMenu() {
  $("arena").classList.add("hidden");
  $("hasil").classList.add("hidden");
  $("menu").classList.remove("hidden");
}

function buatSoal() {
  let daftar = [];

  if (pelajaran === "matematika" || pelajaran === "campuran") {
    daftar = daftar.concat(soalMatematika[level]);
  }

  if (pelajaran === "pemrograman" || pelajaran === "campuran") {
    daftar = daftar.concat(soalPemrograman[level]);
  }

  return acak(daftar);
}

let daftarSoal = [];

function soalBerikutnya() {
  if (skorKamu >= 3 || skorBot >= 3 || ronde >= 5) {
    selesai();
    return;
  }

  if (daftarSoal.length === 0) {
    daftarSoal = buatSoal();
  }

  soalSekarang = daftarSoal.pop();
  ronde++;
  sudahMenjawab = false;

  $("ronde").textContent = "Ronde " + ronde + " dari 5";
  $("pertanyaan").textContent = soalSekarang.t;
  $("feedback").textContent = "";
  $("lanjut").classList.add("hidden");

  const pilihan = $("pilihan");
  pilihan.innerHTML = "";

  acak(soalSekarang.o).forEach(jawaban => {
    const tombol = document.createElement("button");
    tombol.textContent = jawaban;
    tombol.onclick = () => periksaJawaban(jawaban, tombol);
    pilihan.appendChild(tombol);
  });
}

function periksaJawaban(jawaban, tombolDipilih) {
  if (sudahMenjawab) return;
  sudahMenjawab = true;

  const benar = String(jawaban) === String(soalSekarang.a);
  const semuaTombol = $("pilihan").querySelectorAll("button");

  semuaTombol.forEach(tombol => {
    tombol.disabled = true;

    if (String(tombol.textContent) === String(soalSekarang.a)) {
      tombol.classList.add("correct");
    }
  });

  if (benar) {
    skorKamu++;
    posisiTali = Math.min(posisiTali + 20, 100);
    $("feedback").textContent = "Benar! Hebat! Kamu menarik tali! 🎉";
  } else {
    skorBot++;
    posisiTali = Math.max(posisiTali - 20, -100);
    tombolDipilih.classList.add("wrong");
    $("feedback").textContent =
      "Belum tepat! Jawaban benar: " + soalSekarang.a;
  }

  $("rope").style.transform = "translateX(" + posisiTali + "%)";
  tampilSkor();

  $("lanjut").classList.remove("hidden");
  $("lanjut").textContent =
    (skorKamu >= 3 || skorBot >= 3 || ronde >= 5)
      ? "Lihat Hasil"
      : "Soal Berikutnya →";
}

function tampilSkor() {
  $("skorKamu").textContent = skorKamu;
  $("skorBot").textContent = skorBot;
}

function selesai() {
  $("arena").classList.add("hidden");
  $("hasil").classList.remove("hidden");

  if (skorKamu > skorBot) {
    $("judulHasil").textContent = "🏆 Kamu Menang!";
    $("pesanHasil").textContent =
      "Hebat! Skormu " + skorKamu + " dan skor bot " + skorBot + ".";
  } else if (skorBot > skorKamu) {
    $("judulHasil").textContent = "🤖 Bot Menang!";
    $("pesanHasil").textContent =
      "Skormu " + skorKamu + " dan skor bot " + skorBot +
      ". Ayo coba lagi!";
  } else {
    $("judulHasil").textContent = "🤝 Seri!";
    $("pesanHasil").textContent =
      "Kamu dan bot sama-sama mendapat " + skorKamu + " poin.";
  }
}

$("lanjut").addEventListener("click", () => {
  // Penanganan klik dilakukan oleh fungsi soalBerikutnya.
});

// Siapkan soal baru setiap kali memulai permainan.
const mulaiGameAsli = mulaiGame;
mulaiGame = function() {
  daftarSoal = [];
  mulaiGameAsli();
};
