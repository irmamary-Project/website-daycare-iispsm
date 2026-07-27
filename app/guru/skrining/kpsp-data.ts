export interface KPSPQuestion {
  id: number;
  text: string;
  category: string;
}

export interface KPSPAgeGroup {
  months: number;
  label: string;
  tools: string;
  questions: KPSPQuestion[];
}

export const KPSP_DATA: KPSPAgeGroup[] = [
  {
    months: 3,
    label: "3 bulan",
    tools: "Wool Merah",
    questions: [
      { id: 1, text: "Pada waktu bayi telentang, apakah masing-masing lengan dan tungkai bergerak dengan mudah? Jawaban TIDAK bila salah satu atau kedua tungkai atau lengan bayi bergerak tak terarah/tak terkendali.", category: "Gerak Kasar" },
      { id: 2, text: "Pada waktu bayi telentang apakah ia melihat dan menatap wajah anda?", category: "Sosialisasi & Kemandirian" },
      { id: 3, text: "Apakah bayi dapat mengeluarkan suara-suara lain (ngoceh) selain menangis?", category: "Bicara dan Bahasa" },
      { id: 4, text: "Pada waktu Anda mengajak bayi berbicara dan tersenyum, apakah ia tersenyum kembali kepada Anda?", category: "Sosialisasi & Kemandirian" },
      { id: 5, text: "Apakah bayi suka tertawa keras walau tidak digelitik atau diraba-raba?", category: "Bicara & Bahasa" },
      { id: 6, text: "Ambil wol merah, letakkan diatas wajah didepan mata, gerakkan wol dari samping kiri kekanan kepala. Apakah ia dapat mengikuti gerakan anda dengan menggerakan kepala-nya dari kanan/kiri ke tengah?", category: "Gerak Halus" },
      { id: 7, text: "Ambil wol merah, letakkan diatas wajah didepan mata, gerakkan wol dari samping kiri kekanan kepala. Apakah ia dapat mengikuti gerakan anda dengan menggerakan kepala-nya dari satu sisi hampir pada sisi yang lain?", category: "Gerak Halus" },
      { id: 8, text: "Pada waktu bayi telungkup di alas yang datar, apakah ia dapat mengangkat kepalanya sehingga membentuk 30 derajat?", category: "Gerak Kasar" },
      { id: 9, text: "Pada waktu bayi telungkup di alas yang datar, apakah ia dapat mengangkat kepalanya sehingga membentuk sudut 45 derajat?", category: "Sosialisasi & Kemandirian" },
      { id: 10, text: "Pada waktu bayi telungkup di alas yang datar, apakah ia dapat mengangkat kepalanya sehingga membentuk sudut 90 derajat?", category: "Bicara & Bahasa" },
    ],
  },
  {
    months: 6,
    label: "6 bulan",
    tools: "Wool Merah, Kismis, Uang Logam",
    questions: [
      { id: 1, text: "Ambil wol merah, letakkan di atas wajah di depan mata, gerakkan wool dari samping kiri ke kanan kepala. Apakah ia dapat mengikuti gerakan anda dengan mengerahkan kepala sepenuhnya dari satu sisi ke sisi yang lain?", category: "Gerak Halus" },
      { id: 2, text: "Pada posisi bayi telentang, pegang kedua tangannya lalu tarik perlahan-lahan ke posisi duduk. Dapatkah bayi mempertahankan lehernya secara kaku? Jawab TIDAK bisa kepala bayi jatuh kembali.", category: "Gerak Kasar" },
      { id: 3, text: "Dapatkah bayi mempertahankan posisi kepala dalam keadaan tegak & stabil? Jawab TIDAK bila kepala bayi cenderung jatuh ke kanan/kiri atau ke dadanya.", category: "Gerak Kasar" },
      { id: 4, text: "Sentuhkan pensil di punggung atau ujung jari bayi (jangan meletakkan di atas telapak tangan bayi). Apakah bayi dapat menggenggam pensil itu selama beberapa detik?", category: "Gerak Halus" },
      { id: 5, text: "Dapatkah bayi mengarahkan matanya pada benda kecil sebesar kacang, kismis, atau uang logam? Jawab TIDAK jika ia tidak dapat mengarahkan matanya.", category: "Gerak Halus" },
      { id: 6, text: "Dapatkah bayi meraih mainan yang diletakkan agak jauh namun masih berada dalam jangkauan tangannya?", category: "Gerak Halus" },
      { id: 7, text: "Pernahkah bayi mengeluarkan suara gembira bernada tinggi atau memekik tapi bukan menangis?", category: "Bicara & Bahasa" },
      { id: 8, text: "Pernahkah bayi berbalik paling sedikit dua kali, dari telentang ke telungkap atau sebaliknya?", category: "Gerak Kasar" },
      { id: 9, text: "Pernahkah Anda melihat bayi tersenyum ketika melihat mainan yang lucu, gambar, atau binatang peliharaannya pada saat ia bermain sendiri?", category: "Sosialisasi & Kemandirian" },
      { id: 10, text: "Tanpa disangga oleh bantal, kursi atau dinding, dapatkah bayi duduk sendiri selama 60 detik?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 9,
    label: "9 bulan",
    tools: "Wool Merah, Kismis, 2 Kubus, Mainan",
    questions: [
      { id: 1, text: "Pada posisi bayi telentang, pegang kedua tangannya lalu tarik perlahan-lahan ke posisi duduk. Dapatkah bayi mempertahankan lehernya secara kaku? Jawab TIDAK bisa kepala bayi jatuh kembali.", category: "Gerak Kasar" },
      { id: 2, text: "Tarik perhatian bayi dengan memperlihatkan wol merah, kemudian jatuhkan ke lantai. Apakah bayi mencoba mencarinya? Misalnya mencari di bawah meja atau di belakang kursi?", category: "Gerak Halus" },
      { id: 3, text: "Taruh kubus di atas meja, buat agar bayi dapat memungut masing-masing kubus dengan masing-masing tangan dan memegang satu kubus pada masing-masing tangannya.", category: "Gerak Kasar" },
      { id: 4, text: "Taruh kismis di atas meja. Dapatkah bayi memungut dengan tangannya benda-benda kecil seperti kismis, kacang-kacangan, potongan biskuit, dengan gerakan miring atau menggerapai?", category: "Gerak Kasar" },
      { id: 5, text: "Letakkan suatu mainan yang diinginkannya di luar jangkauan bayi, apakah ia mencoba mendapatkannya dengan mengulurkan lengan atau badannya?", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Apakah pernah melihat bayi memindahkan mainan atau kue kering dari satu tangan ke tangan yang lain? Benda-benda panjang seperti sendok atau kerincingan bertangkai tidak ikut dinilai.", category: "Gerak Halus" },
      { id: 7, text: "Apakah bayi dapat makan buah potong sendiri?", category: "Sosialisasi & Kemandirian" },
      { id: 8, text: "Pada waktu bayi bermain sendiri dan teacher diam-diam datang berdiri di belakangnya seperti mendengar kedatangan Anda? Suara keras tidak ikut dihitung. Jawab YA hanya jika anda melihat reaksinya terhadap suara yang perlahan atau bisikan.", category: "Gerak Kasar" },
      { id: 9, text: "Jika anda mengangkat bayi melalui ketiaknya ke posisi berdiri, dapatkan ia menyangga sebagian berat badan dengan kedua kakinya? Jawab YA bila ia mencoba berdiri dan sebagian berat badan tertumpu pada kedua kakinya.", category: "Gerak Kasar" },
      { id: 10, text: "Tanpa disangga oleh bantal, kursi atau dinding, dapatkah bayi duduk sendiri selama 60 detik?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 12,
    label: "12 bulan",
    tools: "Wool Merah, Kismis, 2 Kubus, Mainan",
    questions: [
      { id: 1, text: "Letakkan pensil di telapak tangan bayi. Coba ambil pensil tersebut dengan perlahan-lahan. Sulitkah anda mendapatkan pensil itu kembali?", category: "Gerak Halus" },
      { id: 2, text: "Taruh kismis di atas meja. Dapatkah bayi memungut dengan tangannya benda-benda kecil seperti kismis, kacang-kacangan, potongan buah-buahan, dengan gerakan miring atau menggerapai?", category: "Gerak Halus" },
      { id: 3, text: "Tanpa bantuan, apakah anak dapat mempertemukan dua kubus kecil yang ia pegang?", category: "Gerak Halus" },
      { id: 4, text: "Sebut 2-3 kata yang dapat ditiru oleh anak (tidak perlu kata-kata yang lengkap). Apakah ia mencoba meniru menyebutkan kata-kata tadi?", category: "Bicara & Bahasa" },
      { id: 5, text: "Jika anda bersembunyi di belakang sesuatu/di pojok, kemudian muncul dan menghilang secara berulang-ulang di hadapan anda, apakah ia mencari Anda atau mengharapkan anda muncul kembali?", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Apakah anak dapat mengangkat badannya ke posisi berdiri tanpa bantuan Anda?", category: "Gerak Kasar" },
      { id: 7, text: "Apakah anak dapat membedakan Anda dengan orang yang belum ia kenal? Ia akan menunjukkan sikap malu-malu atau ragu-ragu pada saat permulaan bertemu dengan orang yang belum dikenalnya.", category: "Sosialisasi & Kemandirian" },
      { id: 8, text: "Apakah anak dapat duduk sendiri tanpa bantuan?", category: "Gerak Kasar" },
      { id: 9, text: 'Apakah anak dapat mengatakan 2 suku kata yang sama, misalnya: "ma-ma", "da-da", atau "pa-pa"? Jawab YA bila ia mengeluarkan salah satu suara tadi.', category: "Bicara dan Bahasa" },
      { id: 10, text: "Apakah anak dapat berdiri selama 30 detik atau lebih dengan berpegangan pada kursi/meja?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 15,
    label: "15 bulan",
    tools: "Kubus, Kismis, Bola Tenis",
    questions: [
      { id: 1, text: "Apakah anak anda dapat mengambil benda kecil seperti kacang, kismis, atau potongan biskuit dengan menggunakan ibu jari dan jari telunjuk?", category: "Gerak Halus" },
      { id: 2, text: "Gelindingkan bola tenis ke arah anak, apakah anak dapat menggelindingkan atau melempar bola kembali kepada Anda?", category: "Gerak Halus" },
      { id: 3, text: "Apakah anak dapat bertepuk tangan atau melambaikan tangan tanpa bantuan?", category: "Sosialisasi & Kemandirian" },
      { id: 4, text: 'Apakah anak dapat mengatakan "papa" ketika melihat atau memanggil ayahnya dan mengatakan "mama" ketika melihat atau memanggil ibunya?', category: "Bicara & Bahasa" },
      { id: 5, text: "Apakah anak dapat menunjukkan apa yang diinginkan tanpa menangis atau merengek?", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Apakah anak dapat minum dari cangkir/gelas sendiri tanpa tumpah?", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Apakah anak dapat berdiri kira-kira 5 detik tanpa pegangan?", category: "Gerak Kasar" },
      { id: 8, text: "Apakah anak dapat berdiri kira-kira lebih dari 30 detik tanpa pegangan?", category: "Gerak Kasar" },
      { id: 9, text: "Letakkan kubus di lantai, minta anak memungut. Apakah anak dapat memungut dan berdiri kembali tanpa berpegangan?", category: "Gerak Kasar" },
      { id: 10, text: "Minta anak berjalan sepanjang ruangan, dapatkah ia berjalan tanpa terhuyung/jatuh?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 18,
    label: "18 bulan",
    tools: "Kubus, Kismis, Bola Tenis",
    questions: [
      { id: 1, text: "Letakkan kismis di atas meja dekat anak, apakah anak dapat mengambil dengan ibu jari dan telunjuk?", category: "Gerak Halus" },
      { id: 2, text: "Gelindingkan bola tenis ke arah anak, apakah anak dapat menggelindingkan atau melempar bola kembali kepada anda?", category: "Gerak Halus" },
      { id: 3, text: "Beri kubus didepannya. Minta anak meletakkan 1 kubus di atas kubus lainnya (1 tingkat saja).", category: "Gerak Halus" },
      { id: 4, text: "Apakah anak dapat menunjukkan apa yang diinginkan tanpa menangis atau merengek?", category: "Sosialisasi & Kemandirian" },
      { id: 5, text: "Apakah anak dapat minum dari cangkir/gelas sendiri tanpa tumpah?", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Apakah anak suka meniru bila ibu sedang melakukan pekerjaan rumah tangga (menyapu, mencuci, dll)?", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Apakah anak dapat mengucapkan minimal 3 kata yang mempunyai arti (selain kata mama dan papa)?", category: "Bicara & Bahasa" },
      { id: 8, text: "Apakah anak pernah berjalan mundur minimal 5 langkah?", category: "Gerak Kasar" },
      { id: 9, text: "Letakkan kubus di lantai, minta anak memungut. Apakah anak dapat memungut dan berdiri kembali tanpa berpegangan?", category: "Gerak Kasar" },
      { id: 10, text: "Minta anak berjalan sepanjang ruangan, dapatkah ia berjalan tanpa terhuyung/jatuh?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 21,
    label: "21 bulan",
    tools: "Kubus, Bola Tenis",
    questions: [
      { id: 1, text: "Apakah anak dapat meletakkan satu kubus di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 2, text: "Tanpa bimbingan, petunjuk, atau bantuan anda, dapatkah anak menunjuk dengan benar paling sedikit sebagian badannya (rambut, mata, hidung, mulut, atau bagian badan yang lain)?", category: "Bicara & Bahasa" },
      { id: 3, text: "Apakah anak suka meniru bila ibu sedang melakukan pekerjaan rumah tangga (menyapu, mencuci, dll)?", category: "Sosialisasi & Kemandirian" },
      { id: 4, text: 'Apakah anak dapat mengucapkan paling sedikit 3 kata yang mempunyai arti selain "papa" dan "mama"?', category: "Bicara & Bahasa" },
      { id: 5, text: "Apakah anak dapat berjalan mundur 5 langkah atau lebih tanpa kehilangan keseimbangan?", category: "Gerak Kasar" },
      { id: 6, text: "Dapatkah anak melepas pakaiannya seperti baju, rok, atau celananya?", category: "Gerak Halus" },
      { id: 7, text: "Dapatkah anak berjalan naik tangga sendiri? Jawab YA jika ia naik tangga dengan posisi tegak atau berpegangan tangga. Jawab TIDAK jika ia naik dengan merangkak.", category: "Gerak Kasar" },
      { id: 8, text: "Dapatkah anak makan nasi sendiri tanpa banyak tumpah?", category: "Sosialisasi & Kemandirian" },
      { id: 9, text: "Dapatkah anak membantu memungut mainannya sendiri atau membantu mengangkat piring jika diminta?", category: "Bicara & Bahasa" },
      { id: 10, text: "Letakkan bola tenis di depan kakinya. Apakah ia dapat menendangnya, tanpa berpegangan pada apapun?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 24,
    label: "24 bulan",
    tools: "Kubus, Bola Tenis, Pensil, Form Gambar, Kertas",
    questions: [
      { id: 1, text: "Tanpa bimbingan, petunjuk, atau bantuan Anda, dapatkah anak menunjuk dengan benar paling sedikit sebagian badannya (rambut, mata, hidung, mulut, atau bagian badan yang lain)?", category: "Bicara dan Bahasa" },
      { id: 2, text: "Beri kubus di depannya. Dapatkah anak meletakkan 4 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 3, text: "Apakah anak dapat menyebut 2 di antara gambar-gambar ini tanpa bantuan? (menyebut dengan suara binatang tidak ikut dinilai)", category: "Bicara & Bahasa" },
      { id: 4, text: "Bila diberi pensil, apakah anak mencoret-coret kertas tanpa bantuan/petunjuk?", category: "Gerak Halus" },
      { id: 5, text: "Dapatkah anak melepas pakaiannya seperti baju, rok, atau celananya? (topi dan kaos kaki tidak ikut dinilai)", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Dapatkah anak berjalan naik tangga sendiri? Jawab YA jika ia naik tangga dengan posisi tegak atau berpegangan pada dinding atau pegangan tangga.", category: "Gerak Kasar" },
      { id: 7, text: "Dapatkah anak makan nasi sendiri tanpa banyak tumpah?", category: "Sosialisasi & Kemandirian" },
      { id: 8, text: "Dapatkah anak membantu memungut mainannya sendiri atau membantu mengangkat piring jika diminta?", category: "Bicara dan Bahasa" },
      { id: 9, text: 'Dapatkah anak menggunakan 2 kata pada saat berbicara seperti "minta minum", "mau tidur"? "Terima kasih" dan "dadaah" tidak ikut dinilai.', category: "Bicara dan Bahasa" },
      { id: 10, text: "Letakkan bola tenis di depan kakinya. Apakah ia dapat menendangnya, tanpa berpegangan pada apapun? Mendorong tidak dinilai.", category: "Gerak Kasar" },
    ],
  },
  {
    months: 30,
    label: "30 bulan",
    tools: "Kubus, Bola Tenis, Pensil, Form Gambar, Kertas",
    questions: [
      { id: 1, text: "Beri kubus di depannya. Dapatkah anak meletakkan 4 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 2, text: "Apakah anak dapat menyebut 2 diantara gambar-gambar ini tanpa bantuan? (menyebut dengan suara binatang tidak ikut dinilai)", category: "Bicara & Bahasa" },
      { id: 3, text: "Bila diberi pensil, apakah anak mencoret-coret kertas tanpa bantuan/petunjuk?", category: "Gerak Halus" },
      { id: 4, text: "Buat garis lurus ke bawah sepanjang sekurang-kurangnya 2,5 cm. Minta anak menggambar garis lain di samping garis ini. Jawab YA bila ia menggambar garis lurus.", category: "Gerak Halus" },
      { id: 5, text: 'Dapatkah anak menggunakan 2 kata pada saat berbicara seperti "minta minum", "mau tidur"? "Terima kasih" dan "dadaah" tidak ikut dinilai.', category: "Bicara & Bahasa" },
      { id: 6, text: "Dapatkah anak mengenakan sepatunya sendiri?", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", category: "Gerak Kasar" },
      { id: 8, text: 'Ikuti perintah ini dengan seksama: "Letakkan kertas ini di lantai". "Letakkan kertas ini di kursi". "Berikan kertas ini kepada ibu". Dapatkah anak melaksanakan perintah tadi?', category: "Bicara & Bahasa" },
      { id: 9, text: "Letakkan selembar kertas seukuran buku ini dilantai (kira-kira A5). Apakah anak dapat melompati bagian lebar kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", category: "Gerak Kasar" },
      { id: 10, text: "Beri bola tenis. Minta anak melemparkan ke arah dada anda. Dapatkah anak melempar bola lurus ke arah perut atau dada Anda dari jarak 1,5 meter?", category: "Gerak Kasar" },
    ],
  },
  {
    months: 36,
    label: "36 bulan",
    tools: "Kubus, Kertas, Pensil",
    questions: [
      { id: 1, text: "Beri kubus di depannya. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 2, text: "Beri Pensil dan kertas. Buatlah lingkaran di atas kertas tersebut. Mitra anak menirunya. Dapatkah anak menggambar lingkaran?", category: "Gerak Halus" },
      { id: 3, text: "Dapatkah anak mengenakan sepatunya sendiri?", category: "Sosialisasi & Kemandirian" },
      { id: 4, text: "Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", category: "Gerak Kasar" },
      { id: 5, text: "Apakah anak dapat mencuci tangannya sendiri dengan baik setelah makan?", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Apakah anak dapat mengikuti peraturan permainan bila bermain dengan teman-temannya? (misal: ular tangga, petak umpet, dll)", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa dibantu? (Tidak termasuk memasang kancing, gesper, atau ikat pinggang)", category: "Sosialisasi & Kemandirian" },
      { id: 8, text: "Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?", category: "Gerak Kasar" },
      { id: 9, text: "Letakkan selembar kertas seukuran buku ini di lantai (kira-kira A5). Apakah anak dapat melompati bagian panjang kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", category: "Gerak Kasar" },
      { id: 10, text: "Dapatkah anak menyebut nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia menyebut sebagian namanya atau ucapannya sulit dimengerti.", category: "Bicara & Bahasa" },
    ],
  },
  {
    months: 42,
    label: "42 bulan",
    tools: "Kubus, Kertas, Pensil",
    questions: [
      { id: 1, text: "Beri kubus di depannya. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 2, text: "Beri Pensil dan kertas. Buatlah lingkaran di atas kertas tersebut. Mitra anak menirunya. Dapatkah anak menggambar lingkaran?", category: "Gerak Halus" },
      { id: 3, text: "Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", category: "Gerak Kasar" },
      { id: 4, text: "Apakah anak dapat mencuci tangannya sendiri dengan baik setelah makan?", category: "Sosialisasi & Kemandirian" },
      { id: 5, text: "Apakah anak dapat mengikuti peraturan permainan bila bermain dengan teman-temannya? (misal: ular tangga, petak umpet, dll)", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa dibantu? (Tidak termasuk memasang kancing, gesper, atau ikat pinggang)", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Dapatkah anak menyebut nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia menyebut sebagian namanya atau ucapannya sulit dimengerti.", category: "Bicara & Bahasa" },
      { id: 8, text: "Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?", category: "Gerak Kasar" },
      { id: 9, text: "Letakkan selembar kertas seukuran buku ini di lantai (kira-kira A5). Apakah anak dapat melompati bagian panjang kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", category: "Gerak Kasar" },
      { id: 10, text: "Apakah anak dapat meniru menggambar garis vertikal setelah melihat contoh dari pemeriksa?", category: "Gerak Halus" },
    ],
  },
  {
    months: 48,
    label: "48 bulan",
    tools: "Kubus, Kertas, Pensil",
    questions: [
      { id: 1, text: "Beri kubus di depannya. Dapatkah anak meletakkan 8 buah kubus satu persatu di atas kubus yang lain tanpa menjatuhkan kubus itu?", category: "Gerak Halus" },
      { id: 2, text: "Beri Pensil dan kertas. Buatlah lingkaran di atas kertas tersebut. Mitra anak menirunya. Dapatkah anak menggambar lingkaran?", category: "Gerak Halus" },
      { id: 3, text: "Dapatkah anak mengayuh sepeda roda tiga sejauh sedikitnya 3 meter?", category: "Gerak Kasar" },
      { id: 4, text: "Apakah anak dapat mencuci tangannya sendiri dengan baik setelah makan?", category: "Sosialisasi & Kemandirian" },
      { id: 5, text: "Apakah anak dapat mengikuti peraturan permainan bila bermain dengan teman-temannya? (misal: ular tangga, petak umpet, dll)", category: "Sosialisasi & Kemandirian" },
      { id: 6, text: "Dapatkah anak mengenakan celana panjang, kemeja, baju atau kaos kaki tanpa dibantu? (Tidak termasuk memasang kancing, gesper, atau ikat pinggang)", category: "Sosialisasi & Kemandirian" },
      { id: 7, text: "Dapatkah anak menyebut nama lengkapnya tanpa dibantu? Jawab TIDAK jika ia menyebut sebagian namanya atau ucapannya sulit dimengerti.", category: "Bicara & Bahasa" },
      { id: 8, text: "Suruh anak berdiri satu kaki tanpa berpegangan. Jika perlu tunjukkan caranya dan beri anak anda kesempatan melakukannya 3 kali. Dapatkah ia mempertahankan keseimbangan dalam waktu 2 detik atau lebih?", category: "Gerak Kasar" },
      { id: 9, text: "Letakkan selembar kertas seukuran buku ini di lantai (kira-kira A5). Apakah anak dapat melompati bagian panjang kertas dengan mengangkat kedua kakinya secara bersamaan tanpa didahului lari?", category: "Gerak Kasar" },
      { id: 10, text: "Dapatkah anak menggambar garis lurus horizontal setelah melihat contoh dari pemeriksa?", category: "Gerak Halus" },
    ],
  },
];

export function getInterpretation(score: number): { label: string; code: string; color: string; description: string } {
  if (score >= 10) {
    return { label: "Sesuai", code: "S", color: "text-green-600 bg-green-50 border-green-200", description: "Perkembangan anak sesuai dengan usianya." };
  }
  if (score >= 7) {
    return { label: "Meragukan", code: "M", color: "text-yellow-600 bg-yellow-50 border-yellow-200", description: "Perkembangan anak perlu dipantau lebih lanjut. Disarankan pemeriksaan ulang dalam 1-2 bulan." };
  }
  return { label: "Penyimpangan", code: "P", color: "text-red-600 bg-red-50 border-red-200", description: "Perkembangan anak terdapat penyimpangan. Segera rujuk ke fasilitas kesehatan untuk pemeriksaan lebih lanjut." };
}
