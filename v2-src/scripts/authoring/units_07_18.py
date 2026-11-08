from lib import unit, mc, gap, order, fix

G = 'present-perfect-past'
PP = 'Tulis bentuk present perfect.'

# ---------------------------------------------------------------- Unit 7
unit(7, G, 'Present perfect 1 (I have done)',
"""
Present perfect dibentuk dengan *have/has + past participle* (V3): *I have lost, she has finished, they have gone*. Untuk kata kerja beraturan, V3 sama dengan V2 (*worked, finished*). Kata kerja tidak beraturan punya bentuk sendiri (*go → gone, see → seen, eat → eaten*).

Bentuk ini dipakai untuk kejadian di masa lalu yang terkait dengan keadaan sekarang. Biasanya ini informasi baru. *I've lost my wallet* berarti dompetnya hilang dan sampai sekarang belum ketemu. Waktu persisnya tidak penting dan biasanya tidak disebut.

Present perfect sering dipakai dengan *just* (baru saja), *already* (sudah, lebih cepat dari dugaan), dan *yet* (sudah/belum, di kalimat tanya dan negatif). *just* dan *already* diletakkan di antara *have* dan V3: *I've just eaten. She's already left.* *yet* biasanya di akhir kalimat: *Have you finished yet? We haven't eaten yet.*

Dalam bahasa Indonesia, kata \"sudah\" bisa menandai banyak hal. Dalam bahasa Inggris, \"sudah\" yang terkait dengan sekarang biasanya diterjemahkan dengan present perfect. Catatan: dalam bahasa Inggris Amerika, past simple juga sering dipakai di sini (*I just ate*). Aplikasi ini mengikuti kebiasaan British.
""",
[
  ('I / you / we / they + have + V3', "I've finished my report."),
  ('he / she / it + has + V3', "She's gone out."),
  ('have/has + just/already + V3', "We've just arrived. He's already paid."),
  ("haven't/hasn't + V3 … yet", "I haven't decided yet."),
  ('Have/Has + subjek + V3 … yet?', 'Have you eaten yet?'),
],
[
  ("Oh no! I've lost my wallet.", 'Aduh! Dompet saya hilang.'),
  ("Is Dina here? – No, she's gone out.", 'Dina ada? – Tidak, dia sedang keluar.'),
  ("I've just got a message from Rio.", 'Saya baru saja dapat pesan dari Rio.'),
  ("My parents have already bought their tickets to Makassar.", 'Orang tua saya sudah membeli tiket ke Makassar.'),
  ("We haven't eaten yet, so I'm really hungry.", 'Kami belum makan, jadi saya lapar sekali.'),
  ('The price of chillies has gone up a lot this month.', 'Harga cabai naik banyak bulan ini.'),
],
[
  ('I have finish my work.', 'I have finished my work.', 'Setelah *have/has*, pakai V3 (past participle), bukan bentuk dasar.'),
  ('She has went home.', 'She has gone home.', '*went* adalah V2. Setelah *has* perlu V3: *gone*.'),
  ('I already finished.', "I've already finished.", 'Dalam British English, \"sudah\" yang terkait dengan sekarang memakai present perfect: *have/has + already + V3*.'),
],
[
  gap(PP, 'Oh no! I {{1}} my wallet.', [['have lost', "'ve lost"]], 'Kejadian lampau dengan akibat sekarang (dompetnya masih hilang): have lost.', ['lose']),
  gap(PP, 'Look! Somebody {{1}} the window.', [['has broken', "'s broken"]], 'Informasi baru dengan hasil terlihat sekarang: has broken (break → broken).', ['break']),
  gap(PP, 'Is Dina here? – No, she {{1}} out.', [['has gone', "'s gone"]], 'Dina pergi dan belum kembali: has gone.', ['go']),
  gap(PP, '{{1}} the report yet?', [['Have you finished']], 'Pertanyaan dengan yet: Have + subjek + V3.', ['you / finish']),
  gap(PP, "We {{1}} yet, so I'm really hungry.", [["haven't eaten"]], 'Negatif dengan yet: haven\'t + V3 (eat → eaten).', ['not / eat']),
  gap(PP, 'I {{1}} a message from Rio.', [['have just got', "'ve just got", 'have just received', "'ve just received"]], 'just diletakkan di antara have dan V3: have just got.', ['just / get']),
  gap(PP, 'My parents {{1}} their tickets to Makassar already.', [['have bought', "'ve bought"]], 'buy → bought (V3). already bisa juga di akhir kalimat.', ['buy']),
  gap(PP, 'The price of chillies {{1}} a lot this month.', [['has gone up', "'s gone up"]], 'Perubahan yang hasilnya terasa sekarang: has gone up.', ['go up']),
  mc('Pilih bentuk yang tepat.', "I can't find my glasses. ___ them?", [
      ('Have you seen', 'Benar. Pertanyaan tentang kejadian yang hasilnya penting sekarang: Have + you + V3.'),
      ('Did you saw', 'Setelah did harus bentuk dasar, dan kalimat ini lebih tepat memakai present perfect.'),
      ('Have you saw', 'saw adalah V2. Setelah have perlu V3: seen.'),
    ], 0, 'Have/Has + subjek + V3 untuk menanyakan kejadian yang terkait dengan sekarang.'),
  mc('Pilih bentuk yang tepat.', "Rafi isn't hungry. He ___ lunch.", [
      ('has already had', 'Benar. already diletakkan di antara has dan V3.'),
      ('has already have', 'Setelah has perlu V3 (had), bukan bentuk dasar.'),
      ('already has', 'Present simple tidak menyatakan kejadian yang sudah selesai; perlu has already had.'),
    ], 0, 'has + already + V3.'),
  mc('Pilih bentuk yang tepat.', '___ the new film at the cinema yet?', [
      ('Have you watched', 'Benar. Pertanyaan dengan yet memakai present perfect.'),
      ('Did you watch yet', 'yet tidak diletakkan langsung setelah kata kerja, dan dalam British English pertanyaan dengan yet memakai present perfect.'),
      ('Have you watch', 'Setelah have perlu V3: watched.'),
    ], 0, 'Have you + V3 … yet?'),
  mc('Pilih bentuk yang tepat.', 'Can I borrow your pen? I ___ mine at home.', [
      ("'ve left", 'Benar. Akibatnya terasa sekarang: pulpennya tidak ada di sini.'),
      ('leave', 'leave adalah bentuk sekarang/kebiasaan, padahal kejadiannya sudah terjadi.'),
      ('have leave', 'Setelah have perlu V3: left.'),
    ], 0, 'Kejadian lampau yang akibatnya terasa sekarang: present perfect.'),
  order('Saya baru saja makan.', 'I have just eaten .', 'have + just + V3.'),
  order('Apakah kamu sudah menelepon ibumu?', 'Have you called your mother yet ?', 'Have + subjek + V3 + … + yet?'),
  order('Mereka belum datang.', "They haven't arrived yet .", "haven't + V3 + yet.", alts=["They haven't yet arrived ."]),
  order('Dia sudah mengerjakan PR-nya.', 'She has already done her homework .', 'has + already + V3 (do → done).', alts=['She has done her homework already .']),
  fix(['I', 'have', 'finish', 'my work already.'], 2, ['finished'], 'Setelah have perlu V3: finished.'),
  fix(['She', 'has', 'went', 'home.'], 2, ['gone'], 'went adalah V2. V3 dari go adalah gone.'),
  fix(['Have', 'you', 'finish', 'your homework yet?'], 2, ['finished'], 'Setelah have perlu V3: finished.'),
  fix(['We', "haven't", 'saw', 'that film yet.'], 2, ['seen'], "Setelah haven't perlu V3: seen."),
])

# ---------------------------------------------------------------- Unit 8
unit(8, G, 'Present perfect 2 (I have done)',
"""
Present perfect juga dipakai untuk pengalaman sepanjang hidup sampai sekarang. Kita tidak menyebut kapan persisnya: *Have you ever been to Raja Ampat? I've never eaten durian.* *ever* (pernah) dipakai di kalimat tanya, sedangkan *never* (tidak pernah) di kalimat positif yang bermakna negatif. Keduanya diletakkan sebelum V3.

Setelah bentuk superlatif, kita juga memakai present perfect: *It's the best rendang I've ever tasted.*

Bentuk ini juga dipakai untuk periode waktu yang belum selesai, seperti *today, this week, this month, this year, recently, so far*: *I've drunk three cups of coffee today. We haven't had much rain this month.* Kalau periodenya sudah selesai (*yesterday, last month*), pakai past simple.

Pola *It's the first time …* selalu diikuti present perfect: *It's the first time I've been on a plane.* Penutur Indonesia sering menulis *It's the first time I fly*, padahal bentuk yang benar memakai *have + V3*.
""",
[
  ('Have you ever + V3 … ?', 'Have you ever climbed a mountain?'),
  ('subjek + have/has + never + V3', "I've never seen snow."),
  ("It's the first time + subjek + have/has + V3", "It's the first time I've driven a car."),
  ('superlatif + subjek + have/has + ever + V3', "It's the best film I've ever seen."),
  ('have/has + V3 + today / this week / so far', "I've had two meetings today."),
],
[
  ("Have you ever been to Raja Ampat? – No, never, but I'd love to go.", 'Kamu pernah ke Raja Ampat? – Belum, tapi saya ingin sekali.'),
  ("I've never eaten durian. I don't even want to try it.", 'Saya belum pernah makan durian. Mencoba pun saya tidak mau.'),
  ("It's the first time I've been on a plane.", 'Ini pertama kalinya saya naik pesawat.'),
  ("My father has drunk three cups of coffee today.", 'Ayah saya sudah minum tiga cangkir kopi hari ini.'),
  ("It's the best rendang I've ever tasted.", 'Ini rendang terenak yang pernah saya cicipi.'),
  ("I haven't seen Nina recently. Is she OK?", 'Akhir-akhir ini saya tidak melihat Nina. Dia baik-baik saja?'),
],
[
  ('This is the first time I ride a horse.', "This is the first time I've ridden a horse.", 'Pola *It\'s the first time …* memakai present perfect, bukan present simple.'),
  ('I never have been to Korea.', "I've never been to Korea.", '*never* diletakkan di antara *have* dan V3.'),
  ("It's the most beautiful beach I ever saw.", "It's the most beautiful beach I've ever seen.", 'Setelah superlatif, pakai present perfect: *I\'ve ever seen*.'),
],
[
  gap(PP, "{{1}} to Raja Ampat? – No, never, but I'd love to go.", [['Have you ever been']], 'Menanyakan pengalaman: Have you ever been to …?', ['you / ever / be']),
  gap(PP, "I {{1}} durian. I don't even want to try it.", [['have never eaten', "'ve never eaten"]], 'Pengalaman yang tidak pernah terjadi: have never + V3.', ['never / eat']),
  gap(PP, 'This is the first time I {{1}} on a plane.', [['have been', "'ve been", 'have ever been', "'ve ever been"]], 'Pola the first time + present perfect.', ['be']),
  gap(PP, 'My father {{1}} three cups of coffee today.', [['has drunk', "'s drunk"]], 'today belum selesai: has drunk (drink → drunk).', ['drink']),
  gap(PP, 'We {{1}} much rain this month.', [["haven't had"]], 'this month belum selesai: haven\'t had.', ['not / have']),
  gap(PP, "She's a great cook. It's the best rendang I {{1}}.", [['have ever tasted', "'ve ever tasted"]], 'Setelah superlatif (the best): have ever + V3.', ['ever / taste']),
  gap(PP, 'How many films {{1}} this month?', [['have you watched']], 'this month belum selesai: How many … have you watched?', ['you / watch']),
  gap(PP, 'I {{1}} Nina recently. Is she OK?', [["haven't seen"]], 'recently = akhir-akhir ini sampai sekarang: haven\'t seen.', ['not / see']),
  fix(['This is the first time', 'I', 'ride', 'a horse.'], 2, ['have ridden', 'have ever ridden'], 'the first time + present perfect: I have ridden (I\'ve ridden).'),
  fix(['I', 'never have been', 'to Korea.'], 1, ['have never been'], 'Urutannya: have + never + V3.'),
  fix(["It's the most beautiful beach", 'I', 'ever saw.'], 2, ['have ever seen.'], 'Setelah superlatif: have ever + V3 (see → seen).'),
  fix(['We', 'have visited', 'Bali last year.'], 1, ['visited'], 'last year adalah waktu yang sudah selesai, jadi pakai past simple: visited.'),
  order('Apakah kamu pernah naik gunung?', 'Have you ever climbed a mountain ?', 'Have + you + ever + V3?'),
  order('Saya belum pernah melihat salju.', 'I have never seen snow .', 'have + never + V3.'),
  order('Ini pertama kalinya dia memasak untuk kami.', "It's the first time she has cooked for us .", 'the first time + present perfect.'),
  order('Kami sudah minum tiga gelas teh hari ini.', 'We have drunk three glasses of tea today .', 'today belum selesai: have drunk.'),
  mc('Pilih bentuk yang tepat.', '___ a famous person? – Yes, I once met a famous footballer at an airport.', [
      ('Have you ever met', 'Benar. Menanyakan pengalaman: Have you ever + V3.'),
      ('Do you ever meet', 'Ini menanyakan kebiasaan sekarang, bukan pengalaman.'),
      ('Have you ever meet', 'Setelah have perlu V3: met.'),
    ], 0, 'Pengalaman sampai sekarang: Have you ever …?'),
  mc('Pilih bentuk yang tepat.', 'This is the first time I ___ a speech in English.', [
      ('give', 'Pola the first time tidak memakai present simple.'),
      ('have given', 'Benar. the first time + present perfect.'),
      ('am giving', 'Pola the first time memakai present perfect, bukan present continuous.'),
    ], 1, "It's the first time + have/has + V3."),
  mc('Pilih bentuk yang tepat.', 'I ___ any emails today. The internet is down.', [
      ("haven't sent", 'Benar. today belum selesai, jadi pakai present perfect.'),
      ("haven't send", "Setelah haven't perlu V3: sent."),
      ("don't send", 'Ini menyatakan kebiasaan, bukan keadaan hari ini sampai sekarang.'),
    ], 0, 'Periode yang belum selesai (today, this week) memakai present perfect.'),
  mc('Pilih keterangan waktu yang tepat.', 'Riko has worked at three different companies ___.', [
      ('so far', 'Benar. so far (sejauh ini) cocok dengan present perfect.'),
      ('yesterday', 'yesterday sudah selesai, jadi butuh past simple.'),
      ('last year', 'last year sudah selesai, jadi butuh past simple.'),
    ], 0, 'Present perfect cocok dengan so far, recently, today, this year.'),
])

# ---------------------------------------------------------------- Unit 9
unit(9, G, 'Present perfect continuous (I have been doing)',
"""
Present perfect continuous dibentuk dengan *have/has been + V-ing*. Ada dua pemakaian utama.

Pertama, untuk aktivitas yang baru saja berhenti atau masih berlangsung, dan hasilnya terlihat sekarang: *The ground is wet. It's been raining.* (hujannya mungkin sudah berhenti). *You're out of breath. Have you been running?*

Kedua, untuk menyatakan berapa lama sebuah aktivitas sudah berlangsung sampai sekarang, sering dengan *how long, for, since*: *We've been waiting for half an hour. Ani has been learning English since she was ten.*

Bandingkan dengan present continuous. *I'm waiting* hanya berarti saya sedang menunggu sekarang. Kalau ada keterangan berapa lama sampai sekarang, bentuknya harus present perfect continuous: *I've been waiting for an hour* (bukan *I'm waiting for an hour*).
""",
[
  ('have/has + been + V-ing', "I've been working all morning."),
  ('How long + have/has + subjek + been + V-ing … ?', 'How long have you been waiting?'),
  ('… been + V-ing + for + durasi / since + titik awal', "She's been studying since 8 a.m."),
],
[
  ("The ground is wet. It's been raining.", 'Tanahnya basah. Tadi hujan.'),
  ("You're out of breath. Have you been running?", 'Napasmu terengah-engah. Kamu habis berlari?'),
  ("We've been waiting for the bus for half an hour.", 'Kami sudah menunggu bus selama setengah jam.'),
  ('Ani has been learning English since she was ten.', 'Ani sudah belajar bahasa Inggris sejak umur sepuluh tahun.'),
  ("My eyes hurt because I've been looking at a screen all day.", 'Mata saya sakit karena seharian menatap layar.'),
  ('My neighbours have been playing loud music since this morning.', 'Tetangga saya memutar musik keras sejak tadi pagi.'),
],
[
  ("I'm waiting here since ten o'clock.", "I've been waiting here since ten o'clock.", 'Durasi sampai sekarang (*since*, *for*) tidak memakai present continuous. Pakai *have been + V-ing*.'),
  ('She has been study all night.', 'She has been studying all night.', 'Setelah *been* perlu bentuk *-ing*.'),
  ('How long are you learning to drive?', 'How long have you been learning to drive?', '*How long* sampai sekarang memakai present perfect continuous.'),
],
[
  gap('Tulis bentuk present perfect continuous.', "You're out of breath. {{1}}?", [['Have you been running']], 'Hasilnya terlihat sekarang (terengah-engah): Have you been running?', ['you / run']),
  gap('Tulis bentuk present perfect continuous.', 'The ground is wet. It {{1}}.', [['has been raining', "'s been raining"]], 'Aktivitas yang baru berhenti dengan hasil terlihat: has been raining.', ['rain']),
  gap('Tulis bentuk present perfect continuous.', 'We {{1}} for the bus for half an hour.', [['have been waiting', "'ve been waiting"]], 'Durasi sampai sekarang (for half an hour): have been waiting.', ['wait']),
  gap('Tulis bentuk present perfect continuous.', 'Ani {{1}} English since she was ten.', [['has been learning', "'s been learning"]], 'since + titik awal: has been learning.', ['learn']),
  gap('Tulis bentuk yang tepat.', 'How long {{1}} for this company?', [['have you been working', 'have you worked']], 'Untuk work, present perfect simple dan continuous sama-sama benar.', ['you / work']),
  gap('Tulis bentuk present perfect continuous.', 'My eyes hurt because I {{1}} at a screen all day.', [['have been looking', "'ve been looking"]], 'Aktivitas panjang yang hasilnya terasa sekarang (mata sakit).', ['look']),
  gap('Tulis bentuk present perfect continuous.', 'Why are your hands so dirty? – I {{1}} the motorbike.', [['have been fixing', "'ve been fixing"]], 'Aktivitas yang baru selesai, dan buktinya tangan kotor: have been fixing.', ['fix']),
  gap('Tulis bentuk present perfect continuous.', 'My neighbours {{1}} loud music since this morning.', [['have been playing', "'ve been playing"]], 'since this morning: have been playing.', ['play']),
  mc('Pilih bentuk yang tepat.', "Sorry I'm late. ___ long?", [
      ('Have you been waiting', 'Benar. Menanyakan durasi aktivitas sampai sekarang.'),
      ('Are you waiting', 'Pertanyaan dengan long (berapa lama sampai sekarang) tidak memakai present continuous.'),
      ('Do you wait', 'Ini menanyakan kebiasaan.'),
    ], 0, 'Durasi sampai sekarang: have been + V-ing.'),
  mc('Pilih bentuk yang tepat.', "She's tired because she ___ all morning.", [
      ('has been cleaning', 'Benar. Aktivitas panjang yang hasilnya terasa sekarang (lelah).'),
      ('is cleaning', 'Kalimat ini menjelaskan penyebab lelahnya dengan all morning, jadi perlu present perfect continuous.'),
      ('cleans', 'Ini menyatakan kebiasaan.'),
    ], 0, 'all morning sampai sekarang + hasil terlihat: has been + V-ing.'),
  mc('Pilih bentuk yang tepat.', "He ___ for an hour, and he's still talking!", [
      ('has been talking', 'Benar. Durasi sampai sekarang dan masih berlangsung.'),
      ('is talking', 'for an hour (sampai sekarang) tidak dipakai dengan present continuous.'),
      ('talked', 'Kalimatnya menyatakan aktivitas yang masih berlangsung.'),
    ], 0, 'for + durasi sampai sekarang: have/has been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'I ___ in Bandung since 2020.', [
      ('am living', 'since tidak dipakai dengan present continuous.'),
      ('have been living', 'Benar. since + titik awal sampai sekarang.'),
      ('lived', 'lived berarti sudah tidak tinggal di sana lagi.'),
    ], 1, 'since + titik awal: present perfect (continuous).'),
  fix(['I', 'am waiting', "here since ten o'clock."], 1, ['have been waiting', 'have waited'], 'since + titik awal: have been waiting.'),
  fix(['She looks exhausted. She', 'has been study', 'all night.'], 1, ['has been studying'], 'Setelah been perlu bentuk -ing: has been studying.'),
  fix(['How long', 'are you learning', 'to drive? – For six months now.'], 1, ['have you been learning'], 'How long sampai sekarang: have you been learning.'),
  fix(['They', 'have been', 'play', 'games since lunch.'], 2, ['playing'], 'Setelah been perlu bentuk -ing: playing.'),
  order('Sudah berapa lama kamu menunggu?', 'How long have you been waiting ?', 'How long + have + subjek + been + V-ing.'),
  order('Dia sudah menangis sejak tadi pagi.', 'She has been crying since this morning .', 'has been + V-ing + since.'),
  order('Kami sudah belajar selama dua jam.', 'We have been studying for two hours .', 'have been + V-ing + for + durasi.'),
  order('Apa saja kegiatanmu akhir-akhir ini?', 'What have you been doing lately ?', 'What + have + you + been + doing.'),
])

# ---------------------------------------------------------------- Unit 10
unit(10, G, 'Present perfect continuous and simple (I have been doing and I have done)',
"""
Kedua bentuk ini sama-sama menghubungkan masa lalu dengan sekarang, tetapi fokusnya berbeda.

*have been doing* (continuous) berfokus pada aktivitasnya. Aktivitas itu mungkin belum selesai: *I've been painting the bedroom* (belum tentu selesai, tangan saya penuh cat). Bentuk ini juga dipakai untuk menyatakan berapa lama: *Lia has been writing her novel since January.*

*have done* (simple) berfokus pada hasil atau sesuatu yang sudah selesai: *I've painted the bedroom* (sudah selesai). Bentuk ini juga dipakai untuk menyatakan berapa banyak atau berapa kali: *Lia has written three novels. How many cups of coffee have you drunk?*

Kata kerja keadaan seperti *know, like, believe, have* (memiliki) hanya memakai bentuk simple: *I've known Rahmat since we were children* (bukan *have been knowing*).
""",
[
  ('have been + V-ing = aktivitas / berapa lama', "I've been reading this book for weeks."),
  ('have + V3 = hasil / selesai', "I've read the whole book."),
  ('have + V3 = berapa banyak / berapa kali', "I've read 100 pages."),
  ('know / like / believe → hanya simple', "We've known each other for years."),
],
[
  ("I've been reading this book for weeks, but I've only read 100 pages.", 'Saya sudah berminggu-minggu membaca buku ini, tetapi baru seratus halaman.'),
  ("Lia has been writing a novel since January.", 'Lia sedang menulis novel sejak Januari.'),
  ('Lia has written three novels.', 'Lia sudah menulis tiga novel.'),
  ("Your clothes are dirty. What have you been doing?", 'Bajumu kotor. Kamu habis ngapain?'),
  ("The kitchen looks great! You've cleaned it.", 'Dapurnya terlihat bagus! Kamu sudah membersihkannya.'),
  ("I've known Rahmat since we were children.", 'Saya sudah kenal Rahmat sejak kami kecil.'),
],
[
  ('I have been knowing her for years.', "I've known her for years.", '*know* adalah kata kerja keadaan, jadi tidak memakai bentuk *-ing*.'),
  ('He has been drinking four cups of coffee today.', 'He has drunk four cups of coffee today.', 'Untuk menyatakan jumlah (*four cups*), pakai present perfect simple.'),
  ('We have been painting five rooms so far.', 'We have painted five rooms so far.', 'Jumlah yang sudah selesai (*five rooms*) memakai bentuk simple.'),
],
[
  mc('Pilih bentuk yang tepat.', "I ___ my keys. I can't find them anywhere.", [
      ('have been losing', 'lose adalah kejadian sesaat dengan hasil sekarang, bukan aktivitas yang berlangsung lama.'),
      ('have lost', 'Benar. Fokus pada hasil: kuncinya hilang sekarang.'),
      ('am losing', 'Kuncinya sudah hilang, bukan sedang dalam proses hilang.'),
    ], 1, 'Hasil yang terasa sekarang: have + V3.'),
  mc('Pilih bentuk yang tepat.', 'Your clothes are dirty. What ___?', [
      ('have you been doing', 'Benar. Menanyakan aktivitas yang meninggalkan bukti sekarang.'),
      ('have you done', 'What have you done? biasanya menanyakan hasil, misalnya kerusakan yang kamu buat.'),
      ('are you doing', 'Ini menanyakan aktivitas saat ini, bukan penyebab baju kotor.'),
    ], 0, 'Aktivitas dengan bukti yang terlihat: have been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'Lia ___ three novels this year.', [
      ('has written', 'Benar. Jumlah (three novels) memakai bentuk simple.'),
      ('has been writing', 'Bentuk continuous tidak dipakai untuk menyatakan jumlah yang sudah selesai.'),
      ('writes', 'this year dan jumlah yang sudah tercapai butuh present perfect.'),
    ], 0, 'Berapa banyak: have/has + V3.'),
  mc('Pilih bentuk yang tepat.', 'Lia ___ a novel since January. She hopes to finish it soon.', [
      ('has written', 'Novelnya belum selesai, jadi fokusnya pada aktivitas.'),
      ('has been writing', 'Benar. Aktivitas yang belum selesai, dengan since.'),
      ('is writing', 'since + titik awal tidak dipakai dengan present continuous.'),
    ], 1, 'Aktivitas yang belum selesai + since: have been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'How many cups of coffee ___ today?', [
      ('have you drunk', 'Benar. How many (jumlah) memakai bentuk simple.'),
      ('have you been drinking', 'Untuk menanyakan jumlah yang sudah dicapai (how many cups), pakai bentuk simple.'),
      ('do you drink', 'today belum selesai dan yang ditanyakan jumlah sampai sekarang.'),
    ], 0, 'How many / How much + have + V3.'),
  mc('Pilih bentuk yang tepat.', 'I ___ Rahmat since we were children.', [
      ('have known', 'Benar. know adalah kata kerja keadaan.'),
      ('have been knowing', 'know tidak dipakai dalam bentuk continuous.'),
      ('know', 'since sampai sekarang butuh present perfect.'),
    ], 0, 'Kata kerja keadaan memakai present perfect simple.'),
  mc('Pilih bentuk yang tepat.', "Sorry about the mess. I ___ the kitchen, and I haven't finished yet.", [
      ('have been cleaning', 'Benar. Aktivitasnya belum selesai.'),
      ('have cleaned', 'have cleaned berarti sudah selesai, padahal belum.'),
      ('cleaned', 'Past simple tidak menghubungkan aktivitas dengan keadaan sekarang.'),
    ], 0, 'Aktivitas yang belum selesai: have been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'The kitchen looks great! You ___ it.', [
      ('have cleaned', 'Benar. Fokusnya pada hasil yang sudah selesai.'),
      ('have been cleaning', 'Kalimatnya memuji hasil yang sudah selesai, bukan aktivitasnya.'),
      ('are cleaning', 'Dapurnya sudah bersih, jadi aktivitasnya sudah selesai.'),
    ], 0, 'Hasil yang selesai: have + V3.'),
  gap('Tulis bentuk yang tepat.', 'I {{1}} this book for weeks, but I {{2}} only 100 pages.', [['have been reading', "'ve been reading"], ['have read', "'ve read"]], 'Aktivitas berminggu-minggu: have been reading. Jumlah halaman: have read.', ['read', 'read']),
  gap('Tulis bentuk yang tepat.', 'We {{1}} each other for ten years.', [['have known', "'ve known"]], 'know hanya memakai bentuk simple: have known.', ['know']),
  gap('Tulis bentuk yang tepat.', 'She {{1}} the guitar all afternoon. Her fingers hurt.', [['has been practising', "'s been practising", 'has been practicing', "'s been practicing"]], 'Aktivitas panjang dengan akibat sekarang (jari sakit). Ejaan British: practise.', ['practise']),
  gap('Tulis bentuk yang tepat.', 'Look! I {{1}} my exam! I got 90.', [['have passed', "'ve passed"]], 'Hasil yang sudah tercapai: have passed.', ['pass']),
  fix(['I', 'have been knowing', 'her', 'for years.'], 1, ['have known'], 'know tidak memakai bentuk -ing: have known.'),
  fix(['He', 'has been drinking', 'four cups of coffee', 'today.'], 1, ['has drunk', 'has had'], 'Jumlah (four cups) memakai bentuk simple: has drunk.'),
  fix(['I', 'have read', 'since this morning,', "and I'm tired."], 1, ['have been reading'], 'Aktivitas sejak pagi yang membuat lelah: have been reading.'),
  fix(['We', 'have been painting', 'five rooms', 'so far.'], 1, ['have painted'], 'Jumlah yang sudah selesai: have painted.'),
  order('Saya sudah menulis tiga email pagi ini.', 'I have written three emails this morning .', 'Jumlah: have + V3.', alts=['this morning I have written three emails .']),
  order('Dia sudah bekerja sejak jam tujuh.', 'She has been working since seven .', 'Aktivitas + since: has been + V-ing.'),
  order('Berapa banyak foto yang sudah kamu ambil?', 'How many photos have you taken ?', 'How many + have + subjek + V3.'),
  order('Kami sudah saling kenal sejak SD.', 'We have known each other since primary school .', 'know: have + V3.'),
])

# ---------------------------------------------------------------- Unit 11
unit(11, G, 'how long have you (been) … ?',
"""
Untuk menanyakan sudah berapa lama sesuatu berlangsung sampai sekarang, pakai *How long* + present perfect. Untuk aktivitas, bentuk continuous paling umum: *How long have you been studying Indonesian?* Untuk kata kerja keadaan (*know, have, be, like*), pakai bentuk simple: *How long have you known Dinda? How long have you had your car?*

Penutur Indonesia sering memakai bentuk sekarang (*How long are you here?*). Bentuk *Are you* hanya menanyakan keadaan sekarang. Kalau yang ditanyakan durasi sampai sekarang, pakai *have you been*: *How long have you been here?*

Untuk *live* dan *work*, bentuk simple dan continuous sama-sama benar: *She has lived / has been living in Malang since 2017.*

Kalimat negatif dengan *since* atau *for* biasanya memakai present perfect simple: *I haven't seen my grandparents for months. I haven't eaten since breakfast.*
""",
[
  ('How long + have/has + subjek + been + V-ing … ?', 'How long have you been learning to drive?'),
  ('How long + have/has + subjek + V3 (keadaan) … ?', 'How long have you known her?'),
  ('How long + have/has + subjek + been + tempat/keadaan?', 'How long have you been in Jakarta?'),
  ("haven't/hasn't + V3 + for/since", "I haven't seen him since March."),
],
[
  ('How long have you had your car?', 'Sudah berapa lama kamu punya mobil itu?'),
  ("Fajar is in hospital. He's been there since Sunday.", 'Fajar dirawat di rumah sakit. Dia sudah di sana sejak hari Minggu.'),
  ('How long have you been studying Indonesian? – For about a year.', 'Sudah berapa lama kamu belajar bahasa Indonesia? – Sekitar setahun.'),
  ("They've been married for twenty years.", 'Mereka sudah menikah selama dua puluh tahun.'),
  ('She has lived in Malang since 2017.', 'Dia sudah tinggal di Malang sejak 2017.'),
  ("I haven't seen my grandparents for months. I should visit them.", 'Sudah berbulan-bulan saya tidak bertemu kakek-nenek. Saya harus mengunjungi mereka.'),
],
[
  ('I know her for five years.', "I've known her for five years.", 'Durasi sampai sekarang memakai present perfect, walaupun bahasa Indonesianya cukup \"kenal\".'),
  ('How long are you in Jakarta?', 'How long have you been in Jakarta?', '*How long* sampai sekarang memakai *have you been*.'),
  ('He is working here since March.', 'He has been working here since March.', '*since* tidak dipakai dengan present continuous.'),
],
[
  gap('Tulis bentuk yang tepat.', 'How long {{1}} your car?', [['have you had']], 'have (memiliki) adalah keadaan: How long have you had …?', ['you / have']),
  gap('Tulis bentuk yang tepat.', 'Fajar is in hospital. He {{1}} there since Sunday.', [['has been', "'s been"]], 'Keadaan sampai sekarang: has been there since Sunday.', ['be']),
  gap('Tulis bentuk yang tepat.', 'How long {{1}} Indonesian? – For about a year.', [['have you been studying', 'have you studied']], 'Aktivitas sampai sekarang: bentuk continuous paling umum, tetapi simple juga benar.', ['you / study']),
  gap('Tulis bentuk yang tepat.', 'I {{1}} my grandparents for months. I should visit them.', [["haven't seen"]], 'Negatif dengan for: haven\'t + V3.', ['not / see']),
  gap('Tulis bentuk yang tepat.', 'They {{1}} married for twenty years.', [['have been', "'ve been"]], 'Keadaan menikah sampai sekarang: have been married.', ['be']),
  gap('Tulis bentuk yang tepat.', 'She {{1}} in Malang since 2017.', [['has lived', 'has been living', "'s lived", "'s been living"]], 'live boleh simple atau continuous.', ['live']),
  gap('Tulis bentuk yang tepat.', 'How long {{1}} each other?', [['have you and Dinda known']], 'know adalah keadaan: How long have … known …?', ['you and Dinda / know']),
  gap('Tulis bentuk yang tepat.', 'I {{1}} anything since breakfast.', [["haven't eaten"]], 'Negatif dengan since: haven\'t + V3.', ['not / eat']),
  fix(['I', 'know', 'her', 'for five years.'], 1, ['have known'], 'Durasi sampai sekarang: have known.'),
  fix(['How long', 'are you', 'in Jakarta? – Since May.'], 1, ['have you been'], 'Jawabannya Since May, jadi yang ditanyakan durasi sampai sekarang: have you been.'),
  fix(['He', 'is working', 'here', 'since March.'], 1, ['has been working', 'has worked'], 'since + titik awal: has been working (atau has worked).'),
  fix(['We', "haven't", 'see', 'each other since 2020.'], 2, ['seen'], "Setelah haven't perlu V3: seen."),
  order('Sudah berapa lama kamu punya kucing ini?', 'How long have you had this cat ?', 'How long + have + you + had.'),
  order('Saya sudah tinggal di sini sejak kecil.', 'I have lived here since I was a child .', 'have lived + since + kalimat lampau.'),
  order('Dia tidak menelepon saya selama seminggu.', "She hasn't called me for a week .", "hasn't + V3 + for + durasi."),
  order('Sudah berapa lama kamu belajar menyetir?', 'How long have you been learning to drive ?', 'How long + have + you + been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'Ana ___ in the same office for ten years.', [
      ('has worked', 'Benar. Durasi sampai sekarang: present perfect.'),
      ('is working', 'for ten years sampai sekarang tidak dipakai dengan present continuous.'),
      ('works', 'Present simple tidak menyatakan berapa lama sampai sekarang.'),
    ], 0, 'Durasi sampai sekarang: have/has + V3 (atau been + V-ing).'),
  mc('Pilih bentuk yang tepat.', 'How long ___ this phone?', [
      ('have you had', 'Benar. have (memiliki) adalah keadaan, jadi pakai bentuk simple.'),
      ('have you been having', 'have dengan arti memiliki tidak dipakai dalam bentuk continuous.'),
      ('do you have', 'Ini tidak menanyakan durasi sampai sekarang.'),
    ], 0, 'Kata kerja keadaan: How long have you + V3?'),
  mc('Pilih bentuk yang tepat.', "I'm learning to swim. – Oh, how long ___?", [
      ('have you been learning', 'Benar. Durasi aktivitas sampai sekarang.'),
      ('are you learning', 'How long sampai sekarang tidak memakai present continuous.'),
      ('do you learn', 'Ini bukan pertanyaan tentang kebiasaan.'),
    ], 0, 'How long + have/has + been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'I ___ to a concert for ages.', [
      ("haven't been", 'Benar. Negatif dengan for: haven\'t + V3.'),
      ("don't go", 'Present simple tidak menyatakan berapa lama sampai sekarang.'),
      ("am not going", 'Present continuous tidak dipakai dengan for ages sampai sekarang.'),
    ], 0, "haven't + V3 + for/since."),
])

# ---------------------------------------------------------------- Unit 13
unit(13, G, 'Present perfect and past 1 (I have done and I did)',
"""
Saat menyampaikan berita atau informasi baru, kita sering memakai present perfect karena kejadiannya terkait dengan sekarang: *I've lost my keys. Somebody has stolen my bike!*

Begitu percakapan berlanjut ke detail, seperti kapan, di mana, atau bagaimana, kita beralih ke past simple. Kejadiannya kini dilihat sebagai peristiwa di masa lalu: *Where did you lose them? I left them on the bus this morning.*

Pertanyaan dengan *When*, *What time*, atau keterangan waktu yang sudah selesai (*yesterday, last night, this morning* jika pagi sudah lewat) memakai past simple. Present perfect tidak dipakai bersama keterangan waktu yang selesai: *She has left two days ago* salah, yang benar *She left two days ago*.
""",
[
  ('Berita baru: have/has + V3', "I've found a new job!"),
  ('Detail berikutnya: past simple', 'I started on Monday.'),
  ('When / What time / Where … + did … ?', 'When did it happen?'),
],
[
  ("I've found a new job! – Really? Where did you find it?", 'Saya dapat kerja baru! – Oh ya? Dapat di mana?'),
  ('Somebody has stolen my bike! – When did that happen?', 'Sepeda saya dicuri! – Kapan kejadiannya?'),
  ("I've lost my phone. I left it on the train this morning.", 'HP saya hilang. Tadi pagi tertinggal di kereta.'),
  ('Have you found your passport? – Yes, I found it under the bed.', 'Paspormu sudah ketemu? – Sudah, ketemu di bawah kasur.'),
  ('Dina has had a baby! It was born on Tuesday.', 'Dina sudah melahirkan! Bayinya lahir hari Selasa.'),
  ("We've moved house. We moved on 3 March.", 'Kami sudah pindah rumah. Kami pindah tanggal 3 Maret.'),
],
[
  ('Where have you bought those shoes?', 'Where did you buy those shoes?', 'Pertanyaan tentang detail kejadian (di mana, kapan) memakai past simple.'),
  ('Andi has won the lottery last week.', 'Andi won the lottery last week.', 'Keterangan waktu yang sudah selesai (*last week*) tidak dipakai dengan present perfect.'),
  ('We have moved on 3 March.', 'We moved on 3 March.', 'Tanggal yang disebut membuat kejadiannya menjadi masa lalu yang selesai.'),
],
[
  mc('Pilih bentuk yang tepat.', 'Guess what! I ___ a new job.', [
      ("'ve found", 'Benar. Berita baru yang terkait dengan sekarang.'),
      ('find', 'Ini bentuk sekarang/kebiasaan, padahal kejadiannya sudah terjadi.'),
      ('am finding', 'Kejadiannya sudah terjadi, bukan sedang berlangsung.'),
    ], 0, 'Menyampaikan berita: present perfect.'),
  mc('Pilih bentuk yang tepat.', "I've found a new job! – Really? Where ___ it?", [
      ('did you find', 'Benar. Menanyakan detail kejadian di masa lalu.'),
      ('have you found', 'Pertanyaan tentang detail (di mana) biasanya memakai past simple.'),
      ('do you find', 'Ini bentuk sekarang.'),
    ], 0, 'Detail kejadian: past simple.'),
  mc('Pilih bentuk yang tepat.', 'Oh no! Somebody ___ my bike!', [
      ('has stolen', 'Benar. Berita baru dan akibatnya terasa sekarang.'),
      ('steals', 'Ini bentuk sekarang/kebiasaan.'),
      ('is stealing', 'Pencuriannya sudah terjadi.'),
    ], 0, 'Berita baru dengan akibat sekarang: has + V3.'),
  mc('Pilih bentuk yang tepat.', 'Somebody has stolen my bike! – Oh no! When ___?', [
      ('did that happen', 'Benar. When menanyakan titik waktu di masa lalu.'),
      ('has that happened', 'When tidak dipakai dengan present perfect.'),
      ('does that happen', 'Ini menanyakan kebiasaan.'),
    ], 0, 'When + past simple.'),
  mc('Pilih bentuk yang tepat.', 'The police ___ the thief. They caught him at the station last night.', [
      ('have arrested', 'Benar. Kalimat pertama menyampaikan berita, lalu detailnya memakai past simple.'),
      ('arrest', 'Ini bentuk sekarang/kebiasaan.'),
      ('are arresting', 'Penangkapannya sudah terjadi.'),
    ], 0, 'Berita: present perfect. Detail: past simple.'),
  mc('Pilih bentuk yang tepat.', 'I ___ my laptop in a taxi yesterday.', [
      ('left', 'Benar. yesterday adalah waktu yang sudah selesai.'),
      ('have left', 'Present perfect tidak dipakai dengan yesterday.'),
      ('leave', 'Kejadiannya kemarin.'),
    ], 0, 'Waktu yang selesai (yesterday): past simple.'),
  mc('Pilih bentuk yang tepat.', '___ your passport? – Yes, I found it under the bed.', [
      ('Have you found', 'Benar. Menanyakan hasil yang penting sekarang (paspor sudah ketemu atau belum).'),
      ('Do you find', 'Ini bentuk sekarang/kebiasaan.'),
      ('Are you finding', 'Ini bukan aktivitas yang sedang berlangsung.'),
    ], 0, 'Menanyakan hasil yang terkait dengan sekarang: Have you + V3?'),
  mc('Pilih bentuk yang tepat.', 'Dina has had a baby! It ___ on Tuesday.', [
      ('was born', 'Benar. Detail kejadian (hari lahir) memakai past simple.'),
      ('has been born', 'Hari kelahiran adalah waktu yang sudah selesai.'),
      ('is born', 'Kelahirannya sudah terjadi.'),
    ], 0, 'Detail dengan waktu tertentu: past simple.'),
  fix(["I've lost my phone.", 'I', 'have left', 'it on the train this morning.'], 2, ['left'], 'Detail kejadian (tadi pagi, di kereta): left.'),
  fix(['Where', 'have you bought', 'those shoes?', 'They look great.'], 1, ['did you buy'], 'Menanyakan detail kejadian: did you buy.'),
  fix(['Have you heard the news?', 'Andi', 'has won', 'the lottery last week.'], 2, ['won'], 'last week sudah selesai: won.'),
  fix(["We've moved house.", 'We', 'have moved', 'on 3 March.'], 2, ['moved'], 'Tanggal tertentu: moved.'),
  gap('Tulis bentuk present perfect (berita baru).', "I {{1}} my keys. I can't get into my flat.", [['have lost', "'ve lost"]], 'Berita baru dengan akibat sekarang: have lost.', ['lose']),
  gap('Tulis bentuk past simple (detail kejadian).', "I've lost my keys. – Where {{1}} them?", [['did you lose']], 'Menanyakan detail: did + you + bentuk dasar.', ['you / lose']),
  gap('Tulis bentuk present perfect (berita baru).', 'Rina {{1}} her leg. She fell off her bike yesterday.', [['has broken', "'s broken"]], 'Berita: has broken. Detailnya (yesterday) memakai past simple: fell.', ['break']),
  gap('Tulis bentuk present perfect (berita baru).', 'Prices {{1}} up again. Last month a kilo of rice cost less.', [['have gone', "'ve gone"]], 'Berita/perubahan yang terasa sekarang: have gone up.', ['go']),
  order('Kamu sampai jam berapa?', 'What time did you arrive ?', 'What time + did + subjek + bentuk dasar.'),
  order('Saya sudah menyelesaikan skripsi saya!', 'I have finished my thesis !', 'Berita baru: have + V3.'),
  order('Kapan kamu membelinya?', 'When did you buy it ?', 'When + did + subjek + bentuk dasar.'),
  order('Ada yang sudah memakan kue saya.', 'Somebody has eaten my cake .', 'Berita dengan akibat sekarang: has + V3.'),
])

# ---------------------------------------------------------------- Unit 14
unit(14, G, 'Present perfect and past 2 (I have done and I did)',
"""
Aturan paling penting di unit ini: present perfect tidak dipakai bersama keterangan waktu yang sudah selesai. Kalau ada *yesterday, last week, two years ago, in 2019, when I was a child*, pakai past simple: *I saw Rudi yesterday. We went to Jogja two years ago.*

Sebaliknya, kalau periodenya belum selesai, pakai present perfect: *today, this week, this year, so far, recently, since …*. Contohnya *I haven't seen Rudi this week. It has rained a lot so far this month.*

Pertanyaan *When …?* dan *What time …?* selalu memakai past simple karena menanyakan titik waktu yang sudah lewat: *When did you finish your degree?*

Hal yang sudah berakhir juga memakai past simple, walaupun tanpa keterangan waktu, misalnya kegiatan orang yang sudah meninggal atau pekerjaan yang sudah berhenti: *My grandfather wrote many poems. I worked there from 2018 to 2021.*
""",
[
  ('V2 + yesterday / ago / last … / in 2019', 'We went to Jogja two years ago.'),
  ('have/has + V3 + today / this week / so far / since', "I haven't seen Rudi this week."),
  ('When / What time + did … ?', 'When did you graduate?'),
],
[
  ('I saw Rudi yesterday.', 'Saya bertemu Rudi kemarin.'),
  ("I haven't seen Rudi this week.", 'Minggu ini saya belum bertemu Rudi.'),
  ('My grandmother was born in 1950.', 'Nenek saya lahir tahun 1950.'),
  ('It has rained a lot so far this month.', 'Sejauh ini bulan ini sudah sering hujan.'),
  ('I worked there for three years, from 2018 to 2021.', 'Saya bekerja di sana selama tiga tahun, dari 2018 sampai 2021.'),
  ("Ten years ago I didn't know a single word of English.", 'Sepuluh tahun lalu saya tidak tahu satu kata pun bahasa Inggris.'),
],
[
  ('I have seen that film last night.', 'I saw that film last night.', '*last night* sudah selesai, jadi pakai past simple.'),
  ('When have you arrived?', 'When did you arrive?', '*When* tidak dipakai dengan present perfect.'),
  ("We didn't see Ana since the wedding.", "We haven't seen Ana since the wedding.", '*since* menghubungkan masa lalu dengan sekarang, jadi pakai present perfect.'),
],
[
  mc('Pilih bentuk yang tepat.', 'I ___ Rudi yesterday.', [
      ('saw', 'Benar. yesterday sudah selesai.'),
      ('have seen', 'Present perfect tidak dipakai dengan yesterday.'),
      ('see', 'Kejadiannya kemarin.'),
    ], 0, 'Waktu yang selesai: past simple.'),
  mc('Pilih bentuk yang tepat.', 'I ___ Rudi so far this week.', [
      ("haven't seen", 'Benar. so far this week belum selesai dan menghubungkan dengan sekarang.'),
      ("don't see", 'Ini bentuk sekarang/kebiasaan.'),
      ("am not seeing", 'so far menghubungkan dengan sekarang, jadi butuh present perfect, bukan present continuous.'),
    ], 0, 'Periode yang belum selesai (so far, this week): present perfect.'),
  mc('Pilih bentuk yang tepat.', 'We ___ to Jogja two years ago.', [
      ('went', 'Benar. ago menunjuk waktu yang sudah selesai.'),
      ('have gone', 'Present perfect tidak dipakai dengan ago.'),
      ('have been', 'Present perfect tidak dipakai dengan ago.'),
    ], 0, 'ago → past simple.'),
  mc('Pilih bentuk yang tepat.', 'When ___ your degree? – In 2022.', [
      ('did you finish', 'Benar. When + past simple.'),
      ('have you finished', 'When tidak dipakai dengan present perfect.'),
      ('do you finish', 'Ini bentuk sekarang.'),
    ], 0, 'When + did + subjek + bentuk dasar.'),
  mc('Pilih bentuk yang tepat.', 'My grandmother ___ in 1950.', [
      ('was born', 'Benar. Tahun tertentu di masa lalu.'),
      ('has been born', 'Present perfect tidak dipakai dengan tahun yang sudah lewat.'),
      ('is born', 'Kelahirannya di masa lalu.'),
    ], 0, 'in + tahun yang lewat: past simple.'),
  mc('Pilih bentuk yang tepat.', 'It ___ a lot so far this month.', [
      ('has rained', 'Benar. so far this month belum selesai.'),
      ('rained', 'so far menghubungkan dengan sekarang, jadi butuh present perfect.'),
      ('rains', 'Ini bentuk sekarang/kebiasaan.'),
    ], 0, 'so far / this month: present perfect.'),
  mc('Pilih bentuk yang tepat.', 'My grandfather, who died in 2010, ___ many poems.', [
      ('wrote', 'Benar. Hidupnya sudah berakhir, jadi kegiatannya memakai past simple.'),
      ('has written', 'Present perfect menghubungkan dengan sekarang, padahal hidupnya sudah berakhir.'),
      ('writes', 'Ini bentuk sekarang.'),
    ], 0, 'Periode yang sudah berakhir: past simple.'),
  mc('Pilih bentuk yang tepat.', 'I ___ there for three years, from 2018 to 2021.', [
      ('worked', 'Benar. Periodenya sudah selesai (2018–2021).'),
      ('have worked', 'Periodenya sudah selesai, jadi tidak memakai present perfect.'),
      ('work', 'Ini bentuk sekarang.'),
    ], 0, 'Periode yang sudah selesai: past simple.'),
  fix(['I', 'have seen', 'that film', 'last night.'], 1, ['saw'], 'last night: saw.'),
  fix(['When', 'have you arrived', 'in Bali?'], 1, ['did you arrive'], 'When + did you arrive.'),
  fix(['She', 'has left', 'the company', 'two months ago.'], 1, ['left'], 'ago: left.'),
  fix(['We', "didn't see", 'Ana', 'since the wedding.'], 1, ["haven't seen"], "since sampai sekarang: haven't seen."),
  gap('Tulis bentuk yang tepat.', 'I {{1}} to Lombok in 2019.', [['went']], 'in 2019 sudah lewat: went.', ['go']),
  gap('Tulis bentuk yang tepat.', '{{1}} any emails today?', [['Have you received']], 'today belum selesai: Have you received …?', ['you / receive']),
  gap('Tulis bentuk yang tepat.', 'Ten years ago I {{1}} a single word of English.', [["didn't know"]], 'ago: past simple (didn\'t know).', ['not / know']),
  gap('Tulis bentuk yang tepat.', 'We {{1}} three tests so far this semester.', [['have had', "'ve had"]], 'so far this semester: have had.', ['have']),
  order('Saya pindah ke Jakarta tiga tahun lalu.', 'I moved to Jakarta three years ago .', 'ago: past simple.', alts=['three years ago I moved to Jakarta .']),
  order('Saya belum minum kopi hari ini.', "I haven't had any coffee today .", "today: haven't + V3."),
  order('Kapan kamu lulus?', 'When did you graduate ?', 'When + did + subjek + bentuk dasar.'),
  order('Kami sudah tinggal di sini sejak 2019.', 'We have lived here since 2019 .', 'since: have + V3.'),
])

# ---------------------------------------------------------------- Unit 15
unit(15, G, 'Past perfect (I had done)',
"""
Past perfect dibentuk dengan *had + V3* untuk semua subjek: *I had left, she had finished*. Bentuk ini dipakai ketika kita sedang bercerita tentang masa lalu dan ingin menunjukkan bahwa sesuatu sudah terjadi lebih dulu sebelum titik itu.

Contohnya *When we got to the station, the train had already left.* Keretanya berangkat dulu, baru kami tiba. Bandingkan dengan *When we got to the station, the train left*, yang berarti kami tiba dan setelah itu keretanya berangkat.

Past perfect adalah \"masa lalu dari masa lalu\". Bandingkan dengan present perfect yang berpatokan pada sekarang: *I'm not hungry. I've just eaten* (sekarang). *I wasn't hungry. I'd just eaten* (saat itu).

Past perfect juga dipakai untuk pengalaman sampai suatu titik di masa lalu: *I had never eaten durian before I came to Medan.*
""",
[
  ('had + V3 (semua subjek)', 'She had already left.'),
  ('When + past simple, … had + V3', 'When we arrived, the film had started.'),
  ('had never + V3 + before …', 'I had never flown before.'),
  ('Had + subjek + V3 … ?', 'Had you met her before?'),
],
[
  ('When we got to the station, the train had already left.', 'Waktu kami sampai di stasiun, keretanya sudah berangkat.'),
  ("I didn't recognise Tono. He had changed a lot.", 'Saya tidak mengenali Tono. Dia sudah banyak berubah.'),
  ("She wasn't hungry because she'd just had lunch.", 'Dia tidak lapar karena baru saja makan siang.'),
  ('I had never eaten durian before I came to Medan.', 'Saya belum pernah makan durian sebelum datang ke Medan.'),
  ('When I arrived at the party, most of the guests had gone home.', 'Waktu saya tiba di pesta, kebanyakan tamu sudah pulang.'),
  ('Had you met her before the meeting?', 'Apakah kamu sudah pernah bertemu dia sebelum rapat itu?'),
],
[
  ('When I arrived, the meeting has already started.', 'When I arrived, the meeting had already started.', 'Patokannya masa lalu (*arrived*), jadi pakai *had*, bukan *has*.'),
  ('She had forget her password.', 'She had forgotten her password.', 'Setelah *had* perlu V3 (*forgotten*).'),
  ('They had went home.', 'They had gone home.', '*went* adalah V2. V3 dari *go* adalah *gone*.'),
],
[
  gap('Tulis bentuk past perfect.', 'When we got to the station, the train {{1}}.', [['had already left', "'d already left", 'had left already', "'d left already"]], 'Keretanya berangkat sebelum kami tiba: had already left.', ['already / leave']),
  gap('Tulis bentuk past perfect.', "I didn't recognise Tono. He {{1}} a lot.", [['had changed', "'d changed"]], 'Perubahannya terjadi sebelum saya bertemu dia: had changed.', ['change']),
  gap('Tulis bentuk past perfect.', "She wasn't hungry because she {{1}} lunch.", [['had just had', "'d just had"]], 'Patokannya masa lalu (wasn\'t): had just had.', ['just / have']),
  gap('Tulis bentuk past perfect.', 'I {{1}} durian before I came to Medan.', [['had never eaten', "'d never eaten"]], 'Pengalaman sampai titik di masa lalu: had never eaten.', ['never / eat']),
  gap('Tulis bentuk past perfect.', 'When I arrived at the party, most of the guests {{1}} home.', [['had gone', "'d gone"]], 'Mereka pulang sebelum saya tiba: had gone.', ['go']),
  gap('Tulis bentuk past perfect.', 'The film {{1}} when we got to the cinema.', [['had already started', "'d already started", 'had started already', "'d started already"]], 'Filmnya mulai sebelum kami tiba: had already started.', ['already / start']),
  gap('Tulis bentuk past perfect.', '{{1}} her before the meeting?', [['Had you met']], 'Pertanyaan past perfect: Had + subjek + V3.', ['you / meet']),
  gap('Tulis bentuk past perfect (simple atau continuous).', 'We were tired because we {{1}} for hours.', [['had walked', 'had been walking', "'d walked", "'d been walking"]], 'Penyebab di masa lalu: had walked (atau had been walking).', ['walk']),
  order('Saya sudah mengunci pintu sebelum pergi.', 'I had locked the door before I left .', 'had + V3 + before + past simple.', alts=['before I left I had locked the door .']),
  order('Dia belum pernah naik pesawat sebelumnya.', 'She had never been on a plane before .', 'had never + V3.'),
  order('Waktu kami sampai, filmnya sudah mulai.', 'When we arrived , the film had already started .', 'When + past simple, … had already + V3.'),
  order('Apakah kamu sudah makan sebelum datang?', 'Had you eaten before you came ?', 'Had + subjek + V3 + before …?'),
  mc('Pilih bentuk yang tepat.', 'When I got home, I found that someone ___ into the house.', [
      ('had broken', 'Benar. Pembobolannya terjadi sebelum saya pulang.'),
      ('has broken', 'Patokannya masa lalu (got, found), jadi pakai had.'),
      ('breaks', 'Ini bentuk sekarang.'),
    ], 0, 'Terjadi lebih dulu dari kejadian lampau lain: had + V3.'),
  mc('Pilih bentuk yang tepat.', 'I ___ the book, so I knew the ending of the film.', [
      ('had read', 'Benar. Membaca bukunya terjadi sebelum menonton film.'),
      ('have read', 'Patokannya masa lalu (knew), jadi pakai had.'),
      ('was reading', 'was reading berarti sedang membaca, tidak menjelaskan kenapa saya sudah tahu akhir ceritanya.'),
    ], 0, 'had + V3 untuk sesuatu yang selesai lebih dulu.'),
  mc('Pilih bentuk yang tepat.', "When Ani called, I ___ to bed yet, so I answered the phone.", [
      ("hadn't gone", 'Benar. Saat Ani menelepon, saya belum tidur.'),
      ("haven't gone", 'Patokannya masa lalu (called), jadi pakai hadn\'t.'),
      ("don't go", 'Ini bentuk sekarang.'),
    ], 0, "hadn't + V3 … yet: belum (pada saat itu)."),
  mc('Kalimat mana yang berarti Rina sudah pergi sebelum saya datang?', '(Pilih satu.)', [
      ('When I arrived, Rina left.', 'Ini berarti Rina pergi setelah saya datang.'),
      ('When I arrived, Rina had left.', 'Benar. had left = sudah pergi lebih dulu.'),
      ('When I arrived, Rina was leaving.', 'Ini berarti Rina sedang bersiap pergi saat saya datang.'),
    ], 1, 'Past perfect menunjukkan urutan: kejadian itu lebih dulu.'),
  fix(['When I arrived,', 'the meeting', 'has already started.'], 2, ['had already started.', 'had started already.'], 'Patokannya masa lalu: had already started.'),
  fix(['She', 'had', 'forget', 'her password.'], 2, ['forgotten'], 'Setelah had perlu V3: forgotten.'),
  fix(["I wasn't hungry", 'because I', 'have already eaten.'], 2, ['had already eaten.', 'had eaten already.'], 'Patokannya masa lalu (wasn\'t): had already eaten.'),
  fix(['They', 'had', 'went', 'home before the rain started.'], 2, ['gone'], 'V3 dari go: gone.'),
])

# ---------------------------------------------------------------- Unit 16
unit(16, G, 'Past perfect continuous (I had been doing)',
"""
Past perfect continuous dibentuk dengan *had been + V-ing*. Bentuk ini dipakai untuk aktivitas yang sudah berlangsung sampai suatu titik di masa lalu. Bisa juga aktivitas yang baru berhenti sebelum titik itu dan hasilnya masih terlihat: *The ground was wet. It had been raining.*

Bentuk ini sering dipakai dengan *how long, for, since* untuk menyatakan durasi sampai titik di masa lalu: *We had been waiting for an hour when the bus finally came.*

Bandingkan tiga bentuk ini. *have been doing* berpatokan pada sekarang. *had been doing* berpatokan pada masa lalu. *was doing* hanya berarti sedang berlangsung pada saat itu, tanpa keterangan sudah berapa lama. Jadi *We were talking when the teacher came in* benar. Tetapi kalau ada *for ten minutes*, bentuknya *We had been talking for ten minutes when the teacher came in.*

Kata kerja keadaan (*know, like, want*) tetap memakai past perfect simple: *I had known him for years* (bukan *had been knowing*).
""",
[
  ('had been + V-ing (semua subjek)', 'She had been crying.'),
  ('had been + V-ing + for … when + past simple', 'We had been waiting for an hour when it came.'),
  ('How long + had + subjek + been + V-ing … ?', 'How long had you been looking for a job?'),
  ('know / like → had + V3', 'I had known him for years.'),
],
[
  ('The ground was wet. It had been raining.', 'Tanahnya basah. Sebelumnya hujan.'),
  ('We had been waiting for an hour when the bus finally came.', 'Kami sudah menunggu sejam waktu busnya akhirnya datang.'),
  ('Her eyes were red because she had been crying.', 'Matanya merah karena habis menangis.'),
  ('He had been living in Japan for five years before he moved back to Indonesia.', 'Dia sudah tinggal di Jepang lima tahun sebelum pindah kembali ke Indonesia.'),
  ('The children were dirty because they had been playing in the garden.', 'Anak-anak kotor karena habis bermain di kebun.'),
  ('I had known him for years before we became friends.', 'Saya sudah lama kenal dia sebelum kami berteman.'),
],
[
  ('She was tired because she has been studying all night.', 'She was tired because she had been studying all night.', 'Patokannya masa lalu (*was*), jadi pakai *had been*.'),
  ('He had been knowing her for years.', 'He had known her for years.', '*know* tidak memakai bentuk *-ing*.'),
  ('I was waiting for two hours when she called.', 'I had been waiting for two hours when she called.', 'Durasi sampai titik di masa lalu (*for two hours*) memakai *had been + V-ing*.'),
],
[
  gap('Tulis bentuk past perfect continuous.', 'The ground was wet. It {{1}}.', [['had been raining', "'d been raining"]], 'Aktivitas yang baru berhenti sebelum titik di masa lalu: had been raining.', ['rain']),
  gap('Tulis bentuk past perfect continuous.', 'We {{1}} for an hour when the bus finally came.', [['had been waiting', "'d been waiting"]], 'Durasi sampai bus datang: had been waiting.', ['wait']),
  gap('Tulis bentuk past perfect continuous.', 'Her eyes were red because she {{1}}.', [['had been crying', "'d been crying"]], 'Penyebab yang terlihat di masa lalu: had been crying.', ['cry']),
  gap('Tulis bentuk past perfect (simple atau continuous).', 'He {{1}} in Japan for five years before he moved back to Indonesia.', [['had been living', 'had lived', "'d been living", "'d lived"]], 'live boleh simple atau continuous: had been living / had lived.', ['live']),
  gap('Tulis bentuk past perfect continuous.', 'I was exhausted. I {{1}} all day.', [['had been working', "'d been working"]], 'Aktivitas seharian sebelum titik di masa lalu: had been working.', ['work']),
  gap('Tulis bentuk past perfect continuous.', 'How long {{1}} before you got the job?', [['had you been looking']], 'How long + had + you + been + V-ing.', ['you / look']),
  gap('Tulis bentuk past perfect continuous.', 'The children were dirty because they {{1}} in the garden.', [['had been playing', "'d been playing"]], 'Penyebab di masa lalu: had been playing.', ['play']),
  gap('Tulis bentuk past perfect.', 'I {{1}} him for years before we became friends.', [['had known', "'d known"]], 'know tidak memakai -ing: had known.', ['know']),
  mc('Pilih bentuk yang tepat.', 'When I woke up, the streets were wet. It ___ in the night.', [
      ('had been raining', 'Benar. Hujannya berlangsung sebelum saya bangun.'),
      ('has been raining', 'Patokannya masa lalu (woke up, were), jadi pakai had.'),
      ('is raining', 'Ini bentuk sekarang.'),
    ], 0, 'Patokan masa lalu: had been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'Rudi was out of breath. He ___.', [
      ('had been running', 'Benar. Penyebab napas terengah-engah saat itu.'),
      ('has been running', 'Patokannya masa lalu (was), jadi pakai had.'),
      ('runs', 'Ini bentuk sekarang/kebiasaan.'),
    ], 0, 'Penyebab keadaan di masa lalu: had been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'We ___ for ten minutes when the teacher came in.', [
      ('had been talking', 'Benar. for ten minutes = durasi sampai guru masuk.'),
      ('were talking', 'were talking benar tanpa for ten minutes, tetapi durasi sampai titik di masa lalu butuh had been + V-ing.'),
      ('have been talking', 'Patokannya masa lalu (came in).'),
    ], 0, 'Durasi sampai titik di masa lalu: had been + V-ing.'),
  mc('Pilih bentuk yang tepat.', 'I ___ the answer before the teacher told us.', [
      ('had known', 'Benar. know adalah kata kerja keadaan.'),
      ('had been knowing', 'know tidak dipakai dalam bentuk -ing.'),
      ('have known', 'Patokannya masa lalu (told).'),
    ], 0, 'Kata kerja keadaan: had + V3.'),
  fix(['She', 'was tired', 'because she', 'has been studying all night.'], 3, ['had been studying all night.'], 'Patokannya masa lalu: had been studying.'),
  fix(['We', 'had been wait', 'for hours', 'when the doctor arrived.'], 1, ['had been waiting'], 'Setelah been perlu bentuk -ing: had been waiting.'),
  fix(['He', 'had been knowing', 'her', 'for years.'], 1, ['had known'], 'know tidak memakai -ing: had known.'),
  fix(['I', 'was waiting', 'for two hours', 'when she finally called.'], 1, ['had been waiting'], 'Durasi sampai titik di masa lalu: had been waiting.'),
  order('Kami sudah berjalan selama tiga jam waktu itu.', 'We had been walking for three hours .', 'had been + V-ing + for + durasi.'),
  order('Dia sudah bekerja di sana sepuluh tahun sebelum pensiun.', 'He had been working there for ten years before he retired .', 'had been + V-ing … before + past simple.', alts=['before he retired he had been working there for ten years .']),
  order('Sudah berapa lama mereka menunggu (waktu itu)?', 'How long had they been waiting ?', 'How long + had + subjek + been + V-ing.'),
  order('Tangan saya kotor karena saya habis berkebun.', 'My hands were dirty because I had been gardening .', 'Penyebab di masa lalu: had been + V-ing.'),
])

# ---------------------------------------------------------------- Unit 17
unit(17, G, 'have and have got',
"""
*have* dan *have got* sama-sama berarti \"punya\" atau \"memiliki\". Keduanya dipakai untuk barang, hubungan keluarga, penyakit, dan janji temu: *I've got a headache. She has two brothers. We've got a meeting at three.* *have got* lebih umum dalam bahasa lisan British.

Untuk kalimat tanya dan negatif, ada tiga bentuk:
*Do you have a car? / Have you got a car? / Have you a car?* (yang terakhir jarang dipakai).
*I don't have a car. / I haven't got a car.*
Jangan mencampur kedua pola: *Do you have got* salah.

Untuk masa lalu, pakai *had* tanpa *got*: *When I was a child, I had a bicycle. Did you have a phone then?*

*have* juga dipakai untuk aksi, seperti *have lunch, have a bath, have fun, have a look, have a rest*. Dalam pemakaian ini, *got* tidak boleh dipakai, dan bentuk continuous diperbolehkan: *We're having lunch. She has a shower every morning.*
""",
[
  ('have got / has got = punya (sekarang)', "I've got two sisters."),
  ('Do you have … ? / Have you got … ?', 'Have you got a pen?'),
  ("don't have / haven't got", "He doesn't have a car. / He hasn't got a car."),
  ('had (lampau, tanpa got)', 'I had a bike when I was a child.'),
  ('have + breakfast / a shower / a good time (tanpa got)', 'We had a great time.'),
],
[
  ('Have you got a pen I can borrow?', 'Kamu punya pulpen yang bisa saya pinjam?'),
  ('She has got two brothers and a sister.', 'Dia punya dua kakak laki-laki dan seorang adik perempuan.'),
  ("I've got a headache. Do you have any medicine?", 'Kepala saya pusing. Kamu punya obat?'),
  ("Sorry, I can't come. I've got a dentist appointment at three.", 'Maaf, saya tidak bisa datang. Saya ada janji dengan dokter gigi jam tiga.'),
  ('We usually have lunch at a warung near the office.', 'Kami biasanya makan siang di warung dekat kantor.'),
  ('They had a great time at the party last night.', 'Mereka bersenang-senang di pesta tadi malam.'),
],
[
  ('Do you have got a car?', 'Do you have a car? / Have you got a car?', 'Jangan mencampur *do* dengan *have got*.'),
  ('We had got a great time at the party.', 'We had a great time at the party.', '*have a good time* adalah aksi, jadi tidak memakai *got*.'),
  ('She has got a shower every morning.', 'She has a shower every morning.', 'Untuk aksi rutin (mandi, makan), pakai *have* saja.'),
],
[
  mc('Pilih bentuk yang tepat.', '___ a pen I can borrow?', [
      ('Have you got', 'Benar. Pertanyaan dengan have got: Have + subjek + got.'),
      ('Do you got', 'got tidak dipakai setelah do.'),
      ('Are you having', 'have dengan arti memiliki tidak dipakai dalam bentuk continuous.'),
    ], 0, 'Have you got …? atau Do you have …?'),
  mc('Pilih bentuk yang tepat.', 'She ___ two brothers and a sister.', [
      ('has got', 'Benar. Subjek she: has got.'),
      ('have got', 'Subjek she membutuhkan has.'),
      ('is having', 'Memiliki saudara bukan aktivitas, jadi tidak memakai continuous.'),
    ], 0, 'he/she/it + has got.'),
  mc('Pilih bentuk yang tepat.', 'We ___ breakfast at seven every day.', [
      ('have', 'Benar. have breakfast adalah aksi, jadi tanpa got.'),
      ('have got', 'got tidak dipakai untuk aksi seperti makan atau mandi.'),
      ('are having got', 'Bentuk ini tidak ada.'),
    ], 0, 'have + breakfast/lunch/a shower (tanpa got).'),
  mc('Pilih bentuk yang tepat.', 'I ___ a headache. Do you have any medicine?', [
      ("'ve got", 'Benar. Sakit/penyakit: have got.'),
      ("'m having got", 'Bentuk ini tidak ada.'),
      ('got have', 'Urutannya salah.'),
    ], 0, 'Penyakit: I have / I\'ve got a headache, a cold, a fever.'),
  mc('Pilih bentuk yang tepat.', '___ any brothers or sisters?', [
      ('Do you have', 'Benar. Pertanyaan dengan have: Do you have …?'),
      ('Are you having', 'have dengan arti memiliki tidak dipakai dalam bentuk continuous.'),
      ('Do you have got', 'Jangan mencampur do dengan have got.'),
    ], 0, 'Do you have …? / Have you got …?'),
  mc('Pilih bentuk yang tepat.', 'When I was a child, I ___ a bicycle.', [
      ('had', 'Benar. Masa lalu: had tanpa got.'),
      ('had got', 'Untuk kepemilikan di masa lalu, pakai had saja.'),
      ('have got', 'Kalimatnya tentang masa lalu.'),
    ], 0, 'Lampau: had.'),
  mc('Pilih bentuk yang tepat.', 'They ___ a great time at the party last night.', [
      ('had', 'Benar. have a good time adalah aksi, dan bentuk lampaunya had.'),
      ('had got', 'got tidak dipakai untuk aksi.'),
      ('have got', 'Kalimatnya tentang masa lalu, dan got tidak dipakai untuk aksi.'),
    ], 0, 'have a good/great time → had a good/great time.'),
  mc('Pilih bentuk yang tepat.', "Sorry, I can't come. I ___ a dentist appointment at three.", [
      ("'ve got", 'Benar. Janji temu: have got.'),
      ("'m got", 'am tidak digabung dengan got.'),
      ('has got', 'Subjek I memakai have got, bukan has got.'),
    ], 0, 'Janji temu: I\'ve got / I have an appointment.'),
  fix(['Do you', 'have got', 'a car?'], 1, ['have'], 'Dengan do, pakai have saja: Do you have a car?'),
  fix(['We', 'had got', 'a great time', 'at the party.'], 1, ['had'], 'have a great time adalah aksi, jadi tanpa got. Lampaunya: had.'),
  fix(['She', 'has got', 'a shower', 'every morning.'], 1, ['has'], 'Aksi rutin: has a shower (tanpa got).'),
  fix(['He', "don't have", 'any money', 'right now.'], 1, ["doesn't have", "hasn't got"], "Subjek he: doesn't have atau hasn't got."),
  gap('Tulis bentuk yang tepat.', '{{1}} any time to help me this afternoon?', [['Have you got']], 'Pertanyaan have got: Have + you + got.', ['you / have got']),
  gap('Tulis bentuk yang tepat.', "I {{1}} a cold, so I'm staying at home.", [['have got', "'ve got"]], 'Penyakit: have got.', ['have got']),
  gap('Tulis bentuk yang tepat.', 'We usually {{1}} lunch at a warung near the office.', [['have']], 'Aksi makan siang: have (tanpa got).', ['have']),
  gap('Tulis bentuk yang tepat.', 'My brother {{1}} a job at the moment.', [["doesn't have", "hasn't got"]], "Negatif untuk he: doesn't have / hasn't got.", ['not / have']),
  order('Apakah kamu punya waktu sebentar?', 'Have you got a minute ?', 'Have + you + got + …?'),
  order('Dia tidak punya mobil.', "She doesn't have a car .", "doesn't have + kata benda."),
  order('Kami bersenang-senang di pantai.', 'We had a great time at the beach .', 'have a great time → had (lampau).'),
  order('Berapa anak yang mereka punya?', 'How many children have they got ?', 'How many + kata benda + have + subjek + got?'),
])

# ---------------------------------------------------------------- Unit 18
unit(18, G, 'used to (do)',
"""
*used to + V1* dipakai untuk kebiasaan atau keadaan di masa lalu yang sekarang sudah tidak berlaku. Padanannya dalam bahasa Indonesia adalah \"dulu (sering)\": *I used to take sugar in my tea* (sekarang tidak lagi). *There used to be a cinema here* (sekarang sudah tidak ada).

*used to* hanya ada dalam bentuk lampau. Tidak ada bentuk sekarang *I use to*. Untuk kebiasaan sekarang, pakai present simple, misalnya *I usually get up early.*

Untuk kalimat tanya dan negatif, pakai *did/didn't + use to* (tanpa *d*): *Did you use to play football? She didn't use to like vegetables.* Bisa juga *never used to*.

Jangan tertukar dengan dua bentuk lain. *I was doing* berarti sedang berlangsung pada satu saat (*I was waiting for the bus when …*). *be used to + -ing* berarti sudah terbiasa (dibahas di Unit 61): *I'm used to getting up early.*
""",
[
  ('used to + V1 = dulu (sekarang tidak lagi)', 'I used to live in Surabaya.'),
  ("didn't use to + V1", "We didn't use to have a TV."),
  ('Did + subjek + use to + V1 … ?', 'Did you use to play football?'),
  ('There used to be …', 'There used to be a market here.'),
],
[
  ("I used to take sugar in my tea, but now I don't.", 'Dulu saya pakai gula di teh, sekarang tidak lagi.'),
  ('There used to be a bookshop on this corner, but it closed years ago.', 'Dulu di pojok ini ada toko buku, tetapi sudah tutup bertahun-tahun lalu.'),
  ('Did you use to play football when you were at school?', 'Dulu kamu main sepak bola waktu sekolah?'),
  ("She didn't use to like vegetables, but now she loves them.", 'Dulu dia tidak suka sayur, tetapi sekarang suka sekali.'),
  ('My grandfather used to be a farmer before he moved to the city.', 'Kakek saya dulu petani sebelum pindah ke kota.'),
  ('Dimas used to smoke a lot, but he stopped last year.', 'Dulu Dimas perokok berat, tetapi dia berhenti tahun lalu.'),
],
[
  ('I use to walk to school.', 'I used to walk to school.', 'Bentuk positifnya selalu *used to* (dengan *d*).'),
  ('Did you used to live here?', 'Did you use to live here?', 'Setelah *did*, pakai *use to* (tanpa *d*).'),
  ('My father used to working in a bank.', 'My father used to work in a bank.', 'Setelah *used to*, pakai bentuk dasar. Bentuk *-ing* dipakai setelah *be used to*.'),
  ('I used to get up early now.', 'I usually get up early now.', '*used to* tidak punya bentuk sekarang. Untuk kebiasaan sekarang, pakai present simple.'),
],
[
  gap('Tulis bentuk used to yang tepat.', "I {{1}} sugar in my tea, but now I don't.", [['used to take']], 'Kebiasaan dulu yang sudah berhenti: used to + V1.', ['use to / take']),
  gap('Tulis bentuk used to yang tepat.', 'There {{1}} a bookshop on this corner, but it closed years ago.', [['used to be']], 'Keadaan dulu: There used to be …', ['use to / be']),
  gap('Tulis bentuk used to yang tepat.', '{{1}} play football when you were at school?', [['Did you use to']], 'Pertanyaan: Did + you + use to (tanpa d).', ['you / use to']),
  gap('Tulis bentuk used to yang tepat.', 'She {{1}} like vegetables, but now she loves them.', [["didn't use to", 'never used to', 'used not to']], "Negatif: didn't use to (atau never used to / used not to).", ['not / use to']),
  gap('Tulis bentuk used to yang tepat.', 'My grandfather {{1}} a farmer before he moved to the city.', [['used to be']], 'Keadaan dulu: used to be.', ['use to / be']),
  gap('Tulis bentuk used to yang tepat.', 'We {{1}} in a small house near the river when I was a child.', [['used to live']], 'Keadaan di masa kecil: used to live.', ['use to / live']),
  gap('Tulis bentuk used to yang tepat.', 'Where {{1}} before you moved here?', [['did you use to work']], 'Pertanyaan dengan kata tanya: Where + did + you + use to + V1.', ['you / use to / work']),
  gap('Tulis bentuk used to yang tepat.', 'Dimas {{1}} a lot, but he stopped last year.', [['used to smoke']], 'Kebiasaan dulu: used to smoke.', ['use to / smoke']),
  fix(['When I was young,', 'I', 'use to', 'walk to school.'], 2, ['used to'], 'Bentuk positif: used to.'),
  fix(['Did you', 'used to', 'live', 'in Surabaya?'], 1, ['use to'], 'Setelah did: use to.'),
  fix(['My father', 'used to', 'working', 'in a bank.'], 2, ['work'], 'Setelah used to: bentuk dasar (work).'),
  fix(['I', "didn't used to", 'like', 'fish.'], 1, ["didn't use to", 'never used to', 'used not to'], "Setelah didn't, pakai use to tanpa d: I didn't use to like fish."),
  order('Dulu saya takut gelap.', 'I used to be afraid of the dark .', 'used to + be + kata sifat.'),
  order('Dulu kamu tinggal di mana?', 'Where did you use to live ?', 'Where + did + you + use to + V1.'),
  order('Dulu kami tidak punya TV.', "We didn't use to have a TV .", "didn't use to + V1."),
  order('Dulu dia sering bermain di sungai ini.', 'He used to play in this river .', 'used to + V1.'),
  mc('Pilih bentuk yang tepat.', 'I ___ coffee, but now I drink it every day.', [
      ("didn't use to drink", 'Benar. Negatif used to: didn\'t use to + V1.'),
      ("don't use to drink", 'used to tidak punya bentuk sekarang.'),
      ("wasn't used to drink", 'be used to diikuti -ing dan artinya \"terbiasa\", bukan \"dulu\".'),
    ], 0, "didn't use to + V1."),
  mc('Pilih bentuk yang tepat.', 'Ana ___ in Bandung. Now she lives in Bali.', [
      ('used to live', 'Benar. Keadaan dulu yang sudah berubah.'),
      ('uses to live', 'used to tidak punya bentuk sekarang.'),
      ('is used to live', 'be used to bermakna lain (terbiasa) dan diikuti -ing.'),
    ], 0, 'used to + V1 = dulu, sekarang tidak lagi.'),
  mc('Pilih bentuk yang tepat.', 'I ___ the bus when I saw the accident.', [
      ('was waiting for', 'Benar. Sedang berlangsung pada saat itu: past continuous.'),
      ('used to wait for', 'used to adalah kebiasaan dulu, bukan aksi yang sedang berlangsung pada satu saat.'),
      ('use to wait for', 'Bentuk use to tanpa did tidak benar.'),
    ], 0, 'Satu kejadian yang sedang berlangsung: was/were + V-ing.'),
  mc('Kalimat mana yang berarti "Dulu saya sering main gitar, sekarang tidak lagi"?', '(Pilih satu.)', [
      ('I used to play the guitar.', 'Benar. used to = kebiasaan dulu.'),
      ("I'm used to playing the guitar.", 'Ini berarti saya sudah terbiasa bermain gitar.'),
      ('I use to play the guitar.', 'Bentuk use to tanpa did tidak benar.'),
    ], 0, 'used to + V1 vs be used to + V-ing.'),
])
print('units 7-18 ok')
