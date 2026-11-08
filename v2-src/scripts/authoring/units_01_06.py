from lib import unit, mc, gap, order, fix

G = 'present-past'
FIX = 'Ketuk bagian yang salah, lalu tulis perbaikannya.'

# ---------------------------------------------------------------- Unit 1
unit(1, G, 'Present continuous (I am doing)',
"""
Present continuous dibentuk dengan *am/is/are + kata kerja -ing*. Bentuk ini dipakai untuk aksi yang sedang berlangsung dan belum selesai. Biasanya aksinya terjadi saat kita berbicara (*She's cooking now*). Bisa juga sesuatu yang sedang kita jalani akhir-akhir ini walaupun tidak sedang dilakukan detik ini: *I'm reading a novel about Aceh* berarti saya sudah mulai membacanya dan belum selesai.

Present continuous juga dipakai dengan periode di sekitar sekarang, seperti *today, this week, this semester, these days*: *Dimas is working from home this week.*

Bentuk ini juga dipakai untuk perubahan yang sedang terjadi, sering dengan *get, become, change, rise, increase, start*: *It's getting dark. Prices are going up.*

Penutur Indonesia sering melupakan *am/is/are* karena kata \"sedang\" cukup satu kata. Dalam bahasa Inggris, bentuk *-ing* saja tidak cukup. Harus ada *am/is/are* di depannya.
""",
[
  ('I am + V-ing', "I'm studying for my exam."),
  ('he / she / it is + V-ing', "She's cooking fried rice."),
  ('we / you / they are + V-ing', "They're playing futsal."),
  ('Negatif: am/is/are + not + V-ing', "It isn't raining now."),
  ('Tanya: Am/Is/Are + subjek + V-ing … ?', 'Are you listening?'),
],
[
  ('Please be quiet. The baby is sleeping.', 'Tolong tenang. Bayinya sedang tidur.'),
  ("Rudi isn't answering his phone. Maybe he's driving.", 'Rudi tidak mengangkat telepon. Mungkin dia sedang menyetir.'),
  ("I'm reading a novel about the history of Aceh at the moment.", 'Saat ini saya sedang membaca novel tentang sejarah Aceh.'),
  ('My sister is learning Japanese because she wants to work in Osaka.', 'Adik saya sedang belajar bahasa Jepang karena ingin bekerja di Osaka.'),
  ('Are you working from home this week?', 'Minggu ini kamu bekerja dari rumah?'),
  ('Prices at the market are going up again.', 'Harga di pasar naik lagi.'),
],
[
  ('She cooking in the kitchen.', 'She is cooking in the kitchen.', 'Kata \"sedang\" tidak punya padanan satu kata. Present continuous selalu butuh *am/is/are* + *-ing*.'),
  ('Look! It rains.', "Look! It's raining.", 'Hujan yang sedang turun sekarang memakai present continuous, bukan present simple.'),
  ('Listen! Somebody sings next door.', 'Listen! Somebody is singing next door.', 'Aksi yang terjadi saat kita berbicara memakai present continuous.'),
  ('I am agree with you.', 'I agree with you.', '*agree* adalah kata kerja, bukan kata sifat, jadi tidak memakai *am*. Ini kesalahan yang sangat sering muncul.'),
],
[
  gap('Tulis bentuk present continuous.', 'Shh! The children {{1}} their homework.', [['are doing']], 'Aksi yang sedang berlangsung sekarang: are + doing (subjek jamak).', ['do']),
  gap('Tulis bentuk present continuous.', 'Why {{1}}? Is something wrong?', [['are you crying']], 'Pertanyaan present continuous: Are + you + crying.', ['you / cry']),
  gap('Tulis bentuk present continuous.', "Sari can't come to the phone right now. She {{1}} a shower.", [['is having', "'s having"]], 'Sedang terjadi sekarang (right now): is having.', ['have']),
  gap('Tulis bentuk present continuous.', 'Look outside. It {{1}} any more, so we can go.', [['is not raining', "'s not raining"]], 'Negatif present continuous: is not (isn\'t) + raining.', ['not / rain']),
  gap('Tulis bentuk present continuous.', "My cousin {{1}} for a new job these days, but it's not easy.", [['is looking', "'s looking"]], 'these days = periode di sekitar sekarang. Dia sedang dalam proses mencari kerja.', ['look']),
  gap('Tulis bentuk present continuous.', 'Hurry up! It {{1}} late.', [['is getting', "'s getting"]], 'Perubahan yang sedang terjadi: it is getting late (hari makin larut).', ['get']),
  gap('Tulis bentuk present continuous.', '{{1}} at this hotel all week, or just tonight?', [['Are you staying']], 'Pertanyaan tentang situasi sementara: Are you staying …?', ['you / stay']),
  gap('Tulis bentuk present continuous.', 'Rani {{1}} hard this semester because she wants a scholarship.', [['is studying', "'s studying"]], 'this semester = periode di sekitar sekarang.', ['study']),
  mc('Pilih bentuk yang tepat.', "I can't talk now. I ___ dinner.", [
      ('cook', 'Present simple untuk kebiasaan, bukan untuk aksi yang sedang terjadi sekarang.'),
      ('am cooking', 'Benar. Aksinya sedang berlangsung saat ini.'),
      ('cooking', 'Bentuk -ing butuh am di depannya.'),
    ], 1, 'Aksi yang sedang terjadi saat berbicara: am/is/are + V-ing.'),
  mc('Pilih bentuk yang tepat.', "Where's Budi? – He ___ in the garden.", [
      ('works', 'works menyatakan kebiasaan. Pertanyaan Where\'s Budi? menanyakan keadaan sekarang.'),
      ('is working', 'Benar. Budi sedang bekerja di kebun saat ini.'),
      ('work', 'Subjek he butuh is working (atau works), bukan work.'),
    ], 1, 'Untuk menjawab apa yang sedang dilakukan seseorang sekarang, pakai present continuous.'),
  mc('Pilih bentuk yang tepat.', 'Look! The bus ___.', [
      ('comes', 'Look! menunjukkan sesuatu yang sedang terjadi, jadi bukan present simple.'),
      ('is coming', 'Benar. Busnya sedang datang saat ini.'),
      ('come', 'Subjek tunggal the bus tidak memakai come, dan maknanya juga perlu continuous.'),
    ], 1, 'Look! dan Listen! biasanya diikuti present continuous.'),
  mc('Pilih kalimat yang benar.', '(Harga bensin terus naik.)', [
      ('The price of petrol is rising.', 'Benar. Perubahan yang sedang terjadi memakai is + rising.'),
      ('The price of petrol rising.', 'Tidak ada is sebelum rising.'),
      ('The price of petrol is rise.', 'Setelah is perlu bentuk -ing (rising), bukan bentuk dasar.'),
    ], 0, 'Perubahan yang sedang berlangsung: is/are + V-ing (rising, getting, increasing).'),
  fix(['My brother', 'watching', 'a football match', 'on TV right now.'], 1, ['is watching'], 'Bentuk -ing harus didahului is: My brother is watching …'),
  fix(['Please be quiet.', 'I try', 'to concentrate.'], 1, ['I am trying'], 'Aksi yang sedang dilakukan sekarang: I am trying (I\'m trying).'),
  fix(['Are', 'you', 'enjoy', 'the party so far?'], 2, ['enjoying'], 'Pertanyaan present continuous: Are you + V-ing.'),
  fix(['They', 'are not', 'listen', 'to me right now.'], 2, ['listening'], 'Setelah are not perlu bentuk -ing: are not listening.'),
  order('Kenapa kamu tertawa?', 'Why are you laughing ?', 'Pertanyaan present continuous: kata tanya + are + you + V-ing.'),
  order('Dia sedang menunggu bus.', 'She is waiting for the bus .', 'Subjek + is + waiting + for + the bus.'),
  order('Udaranya makin dingin.', 'It is getting colder .', 'Perubahan yang sedang terjadi: It is getting + kata sifat bentuk -er.'),
  order('Kami tidak sedang menonton TV.', 'We are not watching TV .', 'Negatif: are + not + V-ing.'),
])

# ---------------------------------------------------------------- Unit 2
unit(2, G, 'Present simple (I do)',
"""
Present simple dipakai untuk hal yang umum: fakta, kebiasaan, dan sesuatu yang terjadi berulang kali. Contohnya *The sun rises in the east* atau *I usually take the KRL to work.* Bentuk ini tidak menyatakan aksi yang sedang berlangsung saat ini.

Untuk *he, she, it* (dan satu orang atau satu benda), kata kerja diberi akhiran *-s* atau *-es*: *she works, he watches, it goes*. Kata *have* menjadi *has*. Untuk *I, you, we, they*, kata kerja tetap bentuk dasar.

Kalimat tanya dan negatif memakai *do/does*. Setelah *does* atau *doesn't*, kata kerja kembali ke bentuk dasar tanpa *-s*: *Does she work here? She doesn't eat meat.* Pertanyaan tentang arti kata juga memakai *does*: *What does this word mean?*

Untuk menyatakan seberapa sering, pakai *always, usually, often, sometimes, rarely, never*. Kata-kata ini diletakkan sebelum kata kerja utama (*She never drinks coffee*). Untuk bertanya, pakai *How often …?*

Ada juga kata kerja yang tindakannya terjadi saat diucapkan, misalnya *I promise, I apologise, I suggest, I agree*. Semua kata kerja ini memakai present simple.
""",
[
  ('I / you / we / they + V1', 'I work in Surabaya.'),
  ('he / she / it + V1-s/es', 'She works in a hospital. He watches the news.'),
  ('do/does + not + V1', "We don't eat pork. He doesn't smoke."),
  ('Do/Does + subjek + V1 … ?', 'Does your brother live here?'),
  ('subjek + always/usually/never + V', 'I usually walk to the office.'),
],
[
  ('My father takes the 6.15 train to Bogor every morning.', 'Ayah saya naik kereta jam 6.15 ke Bogor setiap pagi.'),
  ('Water freezes at 0 degrees Celsius.', 'Air membeku pada suhu 0 derajat Celsius.'),
  ("Siti doesn't drink coffee after lunch.", 'Siti tidak minum kopi setelah makan siang.'),
  ('How often do you call your parents?', 'Seberapa sering kamu menelepon orang tuamu?'),
  ('The museum closes at four on Mondays.', 'Museum tutup jam empat setiap hari Senin.'),
  ("I promise I'll pay you back next week.", 'Saya janji akan mengembalikan uangmu minggu depan.'),
],
[
  ('My sister work in a bank.', 'My sister works in a bank.', 'Subjek tunggal orang ketiga (my sister = she) membutuhkan akhiran *-s*. Bahasa Indonesia tidak punya aturan ini, jadi akhiran ini sering terlupa.'),
  ("He don't like spicy food.", "He doesn't like spicy food.", 'Untuk *he/she/it*, bentuk negatifnya *doesn\'t*, bukan *don\'t*.'),
  ('Does she lives near here?', 'Does she live near here?', 'Setelah *does*, kata kerja kembali ke bentuk dasar. Akhiran *-s* sudah \"pindah\" ke *does*.'),
  ('What means this word?', 'What does this word mean?', 'Pertanyaan present simple membutuhkan *do/does* sebelum subjek.'),
],
[
  gap('Tulis bentuk present simple.', 'My father {{1}} the 6.15 train to Bogor every morning.', [['takes']], 'Kebiasaan + subjek he (my father): takes.', ['take']),
  gap('Tulis bentuk present simple.', 'Water {{1}} at 0 degrees Celsius.', [['freezes']], 'Fakta umum + subjek it (water): freezes.', ['freeze']),
  gap('Lengkapi dengan do/does dan kata kerja yang tepat.', 'Where {{1}} your sister {{2}}? – In a hotel in Surabaya.', [['does'], ['work']], 'Subjek your sister (she) memakai does, lalu kata kerja bentuk dasar (work).', ['', 'work']),
  gap('Tulis bentuk present simple.', 'I {{1}} coffee in the evening because it keeps me awake.', [["don't drink"]], 'Negatif untuk I: don\'t (do not) + bentuk dasar.', ['not / drink']),
  gap('Tulis bentuk present simple.', 'My little brother {{1}} his homework without help.', [['never does']], 'never diletakkan sebelum kata kerja utama, dan kata kerjanya tetap diberi -s: never does.', ['never / do']),
  gap('Lengkapi dengan do/does dan kata kerja yang tepat.', 'What {{1}} this word {{2}}?', [['does'], ['mean']], 'Pertanyaan tentang arti kata: What does … mean?', ['', 'mean']),
  gap('Tulis bentuk present simple.', 'The shop {{1}} at 9 a.m. on weekdays.', [['opens']], 'Jadwal tetap + subjek it (the shop): opens.', ['open']),
  gap('Tulis bentuk present simple.', 'How often {{1}} to the gym?', [['do you go']], 'Pertanyaan How often + do + you + bentuk dasar.', ['you / go']),
  fix(['Rina', 'work', 'at a bank', 'in Medan.'], 1, ['works', 'is working', 'worked'], 'Subjek Rina (she) membutuhkan works.'),
  fix(['Pak Budi', "don't", 'like', 'spicy food.'], 1, ["doesn't", "didn't"], 'Negatif untuk he: doesn\'t (does not).'),
  fix(['Does', 'your father', 'drives', 'to work?'], 2, ['drive'], 'Setelah does, kata kerja kembali ke bentuk dasar: drive.'),
  fix(['Sinta', 'usually go', 'to bed', 'at ten.'], 1, ['usually goes', 'usually went'], 'Subjek she membutuhkan goes, dan usually tetap di depan kata kerja.'),
  order('Kamu biasanya bangun jam berapa?', 'What time do you usually get up ?', 'Kata tanya + do + subjek + usually + kata kerja dasar.'),
  order('Dia tidak makan daging.', "She doesn't eat meat .", 'Negatif untuk she: doesn\'t + bentuk dasar (eat).'),
  order('Kereta terakhir berangkat jam sebelas.', 'The last train leaves at eleven .', 'Jadwal tetap memakai present simple, dan subjek tunggal membutuhkan leaves.'),
  order('Saya janji tidak akan terlambat lagi.', "I promise I won't be late again .", 'I promise diucapkan sambil berjanji, jadi memakai present simple.'),
  mc('Pilih bentuk yang tepat.', 'Andi ___ English very well.', [
      ('speak', 'Subjek Andi (he) membutuhkan akhiran -s.'),
      ('speaks', 'Benar. Kemampuan atau fakta umum + subjek he: speaks.'),
      ('is speak', 'is tidak digabung dengan bentuk dasar kata kerja.'),
    ], 1, 'he/she/it + kata kerja -s.'),
  mc('Pilih kata yang tepat.', '___ your parents live near here?', [
      ('Do', 'Benar. your parents = they, jadi pakai Do.'),
      ('Does', 'Does untuk he/she/it. your parents jamak.'),
      ('Are', 'Are + live tidak benar. Pertanyaan present simple dengan kata kerja live memakai do/does.'),
    ], 0, 'Do untuk I/you/we/they, Does untuk he/she/it.'),
  mc('Pilih bentuk yang tepat.', 'I ___ for the mistake in your bill.', [
      ('apologise', 'Benar. Permintaan maaf terjadi saat diucapkan, jadi pakai present simple.'),
      ('am apologising', 'Kata kerja seperti apologise dan promise memakai present simple saat tindakannya terjadi bersamaan dengan ucapannya.'),
      ('apologising', 'Kalimat ini tidak punya kata kerja lengkap.'),
    ], 0, 'I promise / I apologise / I suggest memakai present simple.'),
  mc('Pilih jawaban yang tepat.', 'How often do you eat out? – ___', [
      ('Twice a week.', 'Benar. How often menanyakan frekuensi.'),
      ('For two weeks.', 'Ini menjawab How long, bukan How often.'),
      ('Since Monday.', 'Ini menjawab sejak kapan, bukan seberapa sering.'),
    ], 0, 'How often + present simple menanyakan frekuensi (once a day, twice a week, every month).'),
])

# ---------------------------------------------------------------- Unit 3
unit(3, G, 'Present continuous and present simple 1 (I am doing and I do)',
"""
Kedua bentuk ini sering tertukar karena bahasa Indonesia memakai kata kerja yang sama untuk keduanya. Kuncinya adalah melihat jenis situasinya.

Present continuous (*I am doing*) dipakai untuk sesuatu yang terjadi saat ini atau di sekitar sekarang, dan belum selesai: *The milk is boiling. Turn it off!* Bentuk ini juga untuk situasi sementara: *I'm staying with my aunt until I find a room.*

Present simple (*I do*) dipakai untuk hal umum, kebiasaan, dan fakta: *Milk boils at about 100 degrees.* Bentuk ini juga untuk situasi permanen atau berjangka panjang: *My grandparents live in Yogyakarta.*

Ada satu pola khusus: *always* dengan present continuous (*He's always borrowing my charger*). Pola ini berarti sesuatu terjadi terlalu sering, dan biasanya pembicara merasa kesal. Bandingkan dengan *He always borrows my charger*, yang hanya menyatakan kebiasaan.
""",
[
  ('am/is/are + V-ing = sekarang / sementara', "I'm working at a café this month."),
  ('V1 / V1-s = umum / kebiasaan / permanen', 'She works at a bank.'),
  ('always + V1 = setiap kali', 'He always takes the 7 a.m. bus.'),
  ('am/is/are + always + V-ing = terlalu sering (kesal)', "She's always losing her keys!"),
],
[
  ('Turn down the stove. The milk is boiling.', 'Kecilkan kompornya. Susunya sedang mendidih.'),
  ('My neighbour is from Korea, but he speaks Indonesian really well.', 'Tetangga saya dari Korea, tetapi bahasa Indonesianya sangat bagus.'),
  ("I'm staying with my aunt until I find my own room.", 'Saya menumpang di rumah bibi sampai menemukan kamar sendiri.'),
  ('My grandparents live in Yogyakarta.', 'Kakek dan nenek saya tinggal di Yogyakarta.'),
  ('Online shopping is becoming more and more popular.', 'Belanja online makin lama makin populer.'),
  ("Reza is always borrowing my charger and never giving it back!", 'Reza selalu saja meminjam charger saya dan tidak pernah mengembalikannya!'),
],
[
  ('Listen! Somebody knocks at the door.', 'Listen! Somebody is knocking at the door.', 'Sesuatu yang terjadi saat ini memakai present continuous.'),
  ('Cats are sleeping a lot.', 'Cats sleep a lot.', 'Fakta umum tentang semua kucing memakai present simple.'),
  ('Usually I am walking to school.', 'Usually I walk to school.', '*usually* menunjukkan kebiasaan, jadi memakai present simple.'),
],
[
  mc('Pilih bentuk yang tepat.', 'Ice ___ when it gets warm.', [
      ('melts', 'Benar. Ini fakta umum, jadi pakai present simple.'),
      ('is melting', 'is melting dipakai kalau es sedang mencair saat ini, bukan untuk fakta umum.'),
      ('melt', 'Subjek ice (it) membutuhkan akhiran -s: melts.'),
    ], 0, 'Fakta umum memakai present simple.'),
  mc('Pilih bentuk yang tepat.', 'Turn down the stove. The milk ___.', [
      ('boils', 'boils menyatakan fakta umum. Di sini susunya sedang mendidih saat ini.'),
      ('is boiling', 'Benar. Sedang terjadi sekarang, jadi pakai present continuous.'),
      ('boil', 'Subjek the milk (it) tidak memakai bentuk dasar, dan aksinya sedang terjadi.'),
    ], 1, 'Peringatan tentang sesuatu yang sedang terjadi: present continuous.'),
  mc('Pilih bentuk yang tepat.', 'My neighbour is from Korea, but he ___ Indonesian really well.', [
      ('speaks', 'Benar. Kemampuan umum, bukan aksi yang sedang terjadi.'),
      ('is speaking', 'is speaking berarti dia sedang berbicara sekarang. Kalimat ini menyatakan kemampuan umum.'),
      ('speak', 'Subjek he membutuhkan akhiran -s: speaks.'),
    ], 0, 'Kemampuan dan fakta umum memakai present simple.'),
  mc('Pilih bentuk yang tepat.', 'I ___ with my aunt until I find my own room.', [
      ('stay', 'Present simple untuk situasi permanen. Di sini situasinya sementara.'),
      ('am staying', 'Benar. Situasi sementara (sampai menemukan kamar) memakai present continuous.'),
      ('am stay', 'Setelah am perlu bentuk -ing: am staying.'),
    ], 1, 'Situasi sementara: present continuous.'),
  mc('Pilih bentuk yang tepat.', "My grandparents ___ in Yogyakarta. They've been there all their lives.", [
      ('live', 'Benar. Situasi permanen memakai present simple.'),
      ('are living', 'are living menyiratkan situasi sementara, padahal mereka tinggal di sana seumur hidup.'),
      ('lives', 'My grandparents jamak (they), jadi kata kerjanya tanpa -s.'),
    ], 0, 'Situasi permanen atau berjangka panjang: present simple.'),
  mc('Pilih bentuk yang tepat.', 'Why ___ so much noise? The baby is asleep.', [
      ('do you make', 'Ini akan menanyakan kebiasaan. Kebisingannya sedang terjadi sekarang.'),
      ('are you making', 'Benar. Pertanyaan tentang sesuatu yang sedang terjadi.'),
      ('you are making', 'Dalam pertanyaan, are diletakkan sebelum subjek: are you making.'),
    ], 1, 'Aksi yang sedang berlangsung saat ini: present continuous.'),
  mc('Kalimat mana yang menunjukkan pembicara kesal?', '(Pilih satu.)', [
      ('Reza always takes the 7 o\'clock bus.', 'Ini hanya menyatakan kebiasaan, tanpa rasa kesal.'),
      ('Reza is always borrowing my charger and never giving it back.', 'Benar. always + present continuous = terlalu sering, dan pembicara merasa kesal.'),
      ('Reza takes the bus every day.', 'Ini kebiasaan biasa.'),
    ], 1, 'am/is/are + always + V-ing menunjukkan sesuatu terjadi terlalu sering (biasanya menjengkelkan).'),
  mc('Pilih bentuk yang tepat.', 'Online shopping ___ more and more popular.', [
      ('becomes', 'Perubahan yang sedang berlangsung lebih tepat memakai present continuous.'),
      ('is becoming', 'Benar. more and more menunjukkan perubahan yang sedang terjadi.'),
      ('becoming', 'Bentuk -ing butuh is di depannya.'),
    ], 1, 'Perubahan yang sedang berlangsung: is becoming, is getting, is increasing.'),
  fix(['Listen!', 'Somebody', 'knocks', 'at the door.'], 2, ['is knocking'], 'Listen! menunjukkan sesuatu yang terjadi sekarang: is knocking.'),
  fix(['I', 'am going', 'to the gym three times a week', 'and have done for years.'], 1, ['go'], 'Kebiasaan yang sudah bertahun-tahun (permanen) memakai present simple: go.'),
  fix(['Turn off the TV.', 'Nobody', 'watches', 'it.'], 2, ['is watching'], 'Saat ini tidak ada yang menonton: is watching.'),
  fix(['Usually', "I'm walking", 'to school,', "but today I'm taking a taxi."], 1, ['I walk'], 'Usually menunjukkan kebiasaan: I walk. Bagian today memang memakai continuous karena hanya hari ini.'),
  gap('Tulis bentuk yang tepat: present simple atau present continuous.', 'Mira {{1}} tea, but today she {{2}} coffee.', [['usually drinks'], ['is drinking', "'s drinking"]], 'usually = kebiasaan (usually drinks). today = hanya hari ini (is drinking).', ['usually / drink', 'drink']),
  gap('Tulis bentuk yang tepat: present simple atau present continuous.', '{{1}} to me? I\'m talking to you!', [['Are you listening']], 'Sedang terjadi sekarang: Are you listening?', ['you / listen']),
  gap('Tulis bentuk yang tepat: present simple atau present continuous.', 'The River Musi {{1}} through Palembang.', [['flows']], 'Fakta geografis yang tetap: present simple.', ['flow']),
  gap('Tulis bentuk yang tepat: present simple atau present continuous.', "What {{1}}? – He's a pilot.", [['does your brother do']], 'What does … do? menanyakan pekerjaan (fakta umum), jadi memakai present simple.', ['your brother / do']),
  order('Dia sedang mencari kunci mobilnya.', 'She is looking for her car keys .', 'Aksi yang sedang terjadi: is + looking for.'),
  order('Kami biasanya makan malam jam tujuh.', 'We usually have dinner at seven .', 'Kebiasaan: usually + present simple.', alts=['usually we have dinner at seven .']),
  order('Adikmu selalu saja mengeluh!', 'Your brother is always complaining !', 'Rasa kesal: is + always + V-ing.'),
  order('Apa yang sedang terjadi di luar?', 'What is happening outside ?', 'Sedang terjadi sekarang: What is happening …?'),
])

# ---------------------------------------------------------------- Unit 4
unit(4, G, 'Present continuous and present simple 2 (I am doing and I do)',
"""
Ada kata kerja yang menyatakan keadaan, bukan aksi. Kata kerja seperti ini biasanya tidak dipakai dalam bentuk continuous, walaupun maknanya \"sekarang\". Contohnya *know, understand, believe, remember, mean, like, love, hate, want, need, prefer, belong, contain, seem*. Jadi yang benar *I know*, bukan *I am knowing*.

*think* punya dua makna. Kalau artinya \"berpendapat\", pakai simple: *What do you think of the new café?* Kalau artinya \"sedang menimbang atau memikirkan\", continuous boleh dipakai: *She's thinking about changing jobs.*

*see, hear, smell, taste* biasanya memakai present simple: *Do you see that man? This soup tastes great.* Untuk *look* (terlihat) dan *feel* (merasa) yang menggambarkan keadaan sekarang, simple maupun continuous sama-sama benar: *How do you feel? / How are you feeling?*

*am/is/are being* dipakai untuk perilaku seseorang saat ini saja: *He's being very rude today* (biasanya tidak begitu). Bandingkan dengan *He's rude*, yang berarti sifatnya memang begitu.
""",
[
  ('know / understand / like / want / need + simple', 'I understand. I need a break.'),
  ('think = berpendapat → simple', 'I think he is right.'),
  ('think = menimbang → continuous boleh', "I'm thinking of moving to Bandung."),
  ('look / feel (keadaan sekarang) → keduanya benar', 'You look tired. / You\'re looking tired.'),
  ('is being + sifat = berperilaku sekarang', "She's being very patient today."),
],
[
  ("I don't remember her name, but I know her face.", 'Saya tidak ingat namanya, tetapi saya kenal wajahnya.'),
  ('This bag belongs to my sister.', 'Tas ini milik kakak saya.'),
  ('What do you think of the new teacher?', 'Bagaimana pendapatmu tentang guru baru itu?'),
  ("Don't disturb Ayu. She's thinking about her thesis.", 'Jangan ganggu Ayu. Dia sedang memikirkan skripsinya.'),
  ('This sambal tastes amazing!', 'Sambal ini rasanya luar biasa!'),
  ("Budi is usually quiet, but he's being very loud tonight.", 'Budi biasanya pendiam, tetapi malam ini dia berisik sekali.'),
],
[
  ('I am knowing the answer.', 'I know the answer.', '*know* adalah kata kerja keadaan, jadi tidak memakai bentuk *-ing*.'),
  ('Are you understanding?', 'Do you understand?', '*understand* memakai present simple walaupun maknanya \"sekarang\".'),
  ('I am needing your help.', 'I need your help.', '*need* dan *want* tidak dipakai dalam bentuk continuous.'),
],
[
  mc('Pilih bentuk yang tepat.', 'I ___ what you mean.', [
      ('understand', 'Benar. understand adalah kata kerja keadaan.'),
      ('am understanding', 'understand biasanya tidak dipakai dalam bentuk continuous.'),
      ('am understand', 'am tidak digabung dengan bentuk dasar kata kerja.'),
    ], 0, 'Kata kerja keadaan (know, understand, mean) memakai present simple.'),
  mc('Pilih bentuk yang tepat.', 'This bag ___ to my sister.', [
      ('belongs', 'Benar. Kepemilikan adalah keadaan, jadi pakai present simple.'),
      ('is belonging', 'belong tidak dipakai dalam bentuk continuous.'),
      ('belong', 'Subjek this bag (it) membutuhkan -s: belongs.'),
    ], 0, 'belong, own, contain memakai present simple.'),
  mc('Pilih bentuk yang tepat.', 'What ___ of the new teacher?', [
      ('do you think', 'Benar. Menanyakan pendapat: think dalam bentuk simple.'),
      ('are you thinking', 'Kalau artinya pendapat, think tidak dipakai dalam bentuk continuous.'),
      ('you think', 'Pertanyaan present simple butuh do sebelum subjek.'),
    ], 0, 'think = berpendapat → present simple.'),
  mc('Pilih bentuk yang tepat.', "Don't disturb Ayu. She ___ about her thesis.", [
      ('thinks', 'Kalimat ini membicarakan apa yang sedang dia lakukan saat ini, jadi bukan simple.'),
      ('is thinking', 'Benar. think = sedang memikirkan/menimbang, jadi continuous boleh dipakai.'),
      ('think', 'Subjek she tidak memakai bentuk dasar, dan aksinya sedang berlangsung.'),
    ], 1, 'think = memikirkan/menimbang → bisa continuous.'),
  mc('Pilih bentuk yang tepat.', 'This soup ___ delicious.', [
      ('tastes', 'Benar. taste (terasa) memakai present simple.'),
      ('is tasting', 'taste dengan arti \"terasa\" tidak dipakai dalam bentuk continuous.'),
      ('taste', 'Subjek this soup (it) membutuhkan -s: tastes.'),
    ], 0, 'taste, smell, sound (terasa, tercium, terdengar) memakai present simple.'),
  mc('Pilih bentuk yang tepat.', "___ that man over there? He's my uncle.", [
      ('Do you see', 'Benar. see (melihat) biasanya memakai present simple.'),
      ('Are you seeing', 'see dengan arti \"melihat\" biasanya tidak dipakai dalam bentuk continuous.'),
      ('Are you see', 'are tidak digabung dengan bentuk dasar kata kerja.'),
    ], 0, 'see dan hear biasanya memakai present simple.'),
  mc('Kalimat mana yang berarti "dia bersikap egois hari ini saja"?', '(Pilih satu.)', [
      ('He is selfish.', 'Ini berarti sifatnya memang egois.'),
      ('He is being selfish.', 'Benar. is being + sifat = berperilaku begitu saat ini saja.'),
      ('He has selfish.', 'have tidak dipakai dengan kata sifat seperti ini.'),
    ], 1, 'am/is/are being + kata sifat = perilaku saat ini, bukan sifat permanen.'),
  mc('Pilih bentuk yang tepat.', 'I ___ a new phone. Mine is broken.', [
      ('need', 'Benar. need adalah kata kerja keadaan.'),
      ('am needing', 'need tidak dipakai dalam bentuk continuous.'),
      ('needs', 'Subjek I tidak memakai akhiran -s.'),
    ], 0, 'need dan want memakai present simple.'),
  fix(['I', 'am knowing', 'the answer.'], 1, ['know', 'knew'], 'know adalah kata kerja keadaan: I know.'),
  fix(['This box', 'is containing', 'old photos.'], 1, ['contains', 'contained'], 'contain memakai present simple: contains.'),
  fix(['Are you believing', 'in ghosts?'], 0, ['Do you believe'], 'believe memakai present simple: Do you believe …?'),
  fix(['She', 'is seeming', 'tired today.'], 1, ['seems', 'seemed'], 'seem adalah kata kerja keadaan: seems.'),
  gap('Tulis bentuk yang tepat.', 'I {{1}} her name.', [["don't remember", "can't remember"]], 'remember memakai present simple. Negatifnya don\'t remember.', ['not / remember']),
  gap('Tulis bentuk present continuous.', 'We {{1}} of moving to Bandung next year.', [['are thinking']], 'think of + -ing = sedang menimbang, jadi continuous: are thinking.', ['think']),
  gap('Tulis bentuk yang tepat.', 'This jacket {{1}} me any more.', [["doesn't fit"]], 'fit (pas ukurannya) adalah keadaan: doesn\'t fit.', ['not / fit']),
  gap('Tulis bentuk yang tepat.', 'How {{1}} now? – Much better, thanks.', [['are you feeling', 'do you feel']], 'Untuk feel (keadaan sekarang), simple dan continuous sama-sama benar.', ['you / feel']),
  order('Kamu mau minum apa?', 'What do you want to drink ?', 'want memakai present simple: What do you want …?'),
  order('Saya lebih suka teh daripada kopi.', 'I prefer tea to coffee .', 'prefer A to B, dalam present simple.'),
  order('Dia sedang menimbang untuk pindah kerja.', 'She is thinking about changing jobs .', 'think = menimbang → is thinking about + -ing.'),
  order('Apakah kamu mengerti pertanyaannya?', 'Do you understand the question ?', 'understand memakai present simple: Do you understand …?'),
])

# ---------------------------------------------------------------- Unit 5
unit(5, G, 'Past simple (I did)',
"""
Past simple dipakai untuk kejadian yang sudah selesai di masa lalu, sering dengan keterangan waktu seperti *yesterday, last week, in 2019, two days ago*.

Kebanyakan kata kerja cukup ditambah *-ed*: *work → worked, visit → visited, stop → stopped*. Kata kerja tidak beraturan punya bentuk sendiri yang harus dihafal: *go → went, buy → bought, see → saw, eat → ate, teach → taught*.

Untuk kalimat tanya dan negatif, pakai *did/didn't* + kata kerja bentuk dasar: *Did you see the news? I didn't sleep well.* Karena penanda lampaunya sudah ada di *did*, kata kerja berikutnya tidak diubah lagi (bukan *didn't went*).

Bentuk lampau *be* adalah *was* (untuk *I, he, she, it*) dan *were* (untuk *you, we, they*). Kalimat tanya dan negatifnya tidak memakai *did*: *Were you at home? It wasn't expensive.*

Bahasa Indonesia cukup memakai kata seperti \"kemarin\" atau \"tadi\" tanpa mengubah kata kerja. Dalam bahasa Inggris, kata kerjanya juga harus berubah.
""",
[
  ('V2 (V1 + -ed / bentuk tidak beraturan)', 'We visited Lake Toba. She bought a phone.'),
  ("did not (didn't) + V1", "I didn't sleep well."),
  ('Did + subjek + V1 … ?', 'Did you go to the party?'),
  ('I / he / she / it + was; you / we / they + were', 'The film was boring. We were tired.'),
],
[
  ('We visited Lake Toba last year.', 'Kami mengunjungi Danau Toba tahun lalu.'),
  ('Dewi bought a new phone yesterday.', 'Dewi membeli HP baru kemarin.'),
  ("I didn't sleep well last night.", 'Saya tidak tidur nyenyak tadi malam.'),
  ('Where were you on Saturday?', 'Kamu di mana hari Sabtu?'),
  ('My grandfather taught at a village school for thirty years.', 'Kakek saya mengajar di sekolah desa selama tiga puluh tahun.'),
  ('The film was boring, so we left early.', 'Filmnya membosankan, jadi kami pulang lebih awal.'),
],
[
  ('Yesterday I go to the market.', 'Yesterday I went to the market.', 'Kata kerja harus berubah ke bentuk lampau. Kata *yesterday* saja tidak cukup.'),
  ('Did you saw the news?', 'Did you see the news?', 'Setelah *did*, pakai bentuk dasar (*see*), bukan bentuk lampau.'),
  ("She didn't came to class.", "She didn't come to class.", 'Setelah *didn\'t*, kata kerja kembali ke bentuk dasar.'),
  ('We was very tired.', 'We were very tired.', '*we, you, they* memakai *were*, bukan *was*.'),
],
[
  gap('Tulis bentuk past simple.', 'We {{1}} Lake Toba last year.', [['visited']], 'Kata kerja beraturan: visit → visited.', ['visit']),
  gap('Tulis bentuk past simple.', 'Dewi {{1}} a new phone yesterday.', [['bought']], 'Kata kerja tidak beraturan: buy → bought.', ['buy']),
  gap('Tulis bentuk past simple.', 'I {{1}} well last night.', [["didn't sleep"]], 'Negatif lampau: didn\'t + bentuk dasar (sleep).', ['not / sleep']),
  gap('Tulis bentuk past simple.', '{{1}} to the party on Saturday?', [['Did you go']], 'Pertanyaan lampau: Did + subjek + bentuk dasar.', ['you / go']),
  gap('Tulis bentuk past simple.', 'The film {{1}} boring, so we {{2}} early.', [['was'], ['left']], 'be → was (the film = it). leave → left.', ['be', 'leave']),
  gap('Tulis bentuk past simple.', 'Where {{1}} last night? I called you twice.', [['were you']], 'Pertanyaan dengan be tidak memakai did: Where were you?', ['you / be']),
  gap('Tulis bentuk past simple.', 'My grandfather {{1}} at a village school for thirty years.', [['taught']], 'teach → taught. Masa mengajarnya sudah selesai.', ['teach']),
  gap('Tulis bentuk past simple.', 'When I was a child, I {{1}} vegetables.', [["didn't like"]], 'Masa kecil sudah lewat: didn\'t like.', ['not / like']),
  fix(['Yesterday I', 'go', 'to the market and bought some fish.'], 1, ['went'], 'Kejadian kemarin: go → went.'),
  fix(['Did', 'you', 'saw', 'the news?'], 2, ['see'], 'Setelah did, pakai bentuk dasar: see.'),
  fix(['She', "didn't", 'came', 'to class today.'], 2, ['come'], 'Setelah didn\'t, pakai bentuk dasar: come.'),
  fix(['We', 'was', 'very tired after the trip.'], 1, ['were'], 'Subjek we memakai were.'),
  order('Kapan kamu sampai di rumah?', 'When did you get home ?', 'When + did + subjek + bentuk dasar.'),
  order('Saya tidak melihat kucingmu.', "I didn't see your cat .", 'Negatif: didn\'t + bentuk dasar (see).'),
  order('Mereka menikah tahun 2018.', 'They got married in 2018 .', 'get married → got married. Tahun memakai in.'),
  order('Apa yang kamu makan tadi pagi?', 'What did you eat this morning ?', 'What + did + subjek + bentuk dasar (eat).'),
  mc('Pilih bentuk yang tepat.', 'Last night I ___ a strange dream.', [
      ('have', 'last night menunjukkan masa lalu, jadi perlu bentuk lampau.'),
      ('had', 'Benar. have → had.'),
      ('haved', 'have tidak beraturan, jadi tidak ada bentuk haved.'),
    ], 1, 'have adalah kata kerja tidak beraturan: had.'),
  mc('Pilih kata yang tepat.', '___ your trip to Lombok?', [
      ('How was', 'Benar. your trip = it, jadi pakai was.'),
      ('How did', 'did perlu diikuti kata kerja lain. Di sini kata kerjanya be.'),
      ('How were', 'were untuk you/we/they atau benda jamak.'),
    ], 0, 'Pertanyaan dengan be di masa lalu: How was …? / Where were …?'),
  mc('Pilih bentuk yang tepat.', 'They ___ the bus because they woke up late.', [
      ('missed', 'Benar. miss → missed (beraturan).'),
      ('miss', 'Kalimatnya tentang masa lalu (woke up), jadi perlu bentuk lampau.'),
      ('were miss', 'were tidak digabung dengan bentuk dasar kata kerja.'),
    ], 0, 'Kejadian yang sudah selesai: past simple.'),
  mc('Pilih ejaan yang benar.', 'The past form of "stop" is ___.', [
      ('stoped', 'Kata pendek dengan pola konsonan-vokal-konsonan menggandakan huruf terakhirnya.'),
      ('stopped', 'Benar. stop → stopped (huruf p digandakan).'),
      ('stopt', 'Ini bukan ejaan baku.'),
    ], 1, 'stop → stopped, plan → planned, travel → travelled (British).'),
])

# ---------------------------------------------------------------- Unit 6
unit(6, G, 'Past continuous (I was doing)',
"""
Past continuous dibentuk dengan *was/were + V-ing*. Bentuk ini dipakai untuk sesuatu yang sedang berlangsung pada satu waktu tertentu di masa lalu: *At 9 p.m. yesterday I was watching a film.* Pada pukul 9 aksinya sudah dimulai dan belum selesai.

Bandingkan dengan past simple, yang menyatakan aksi utuh yang sudah selesai. *I was walking home* menceritakan prosesnya. *I walked home* menceritakan seluruh kejadiannya.

Kedua bentuk ini sering dipakai bersama. Aksi panjang (latar) memakai past continuous, sedangkan aksi pendek yang terjadi di tengahnya memakai past simple: *While Sinta was cooking, the phone rang. When the lights went off, we were having dinner.*

Kata kerja keadaan seperti *know, want, understand* tetap memakai past simple: *I didn't know what to do* (bukan *wasn't knowing*).
""",
[
  ('I / he / she / it + was + V-ing', 'I was sleeping at midnight.'),
  ('you / we / they + were + V-ing', 'They were playing cards.'),
  ('While + past continuous, past simple', 'While I was walking home, it started to rain.'),
  ('past simple when + past simple (berurutan)', 'When she arrived, we started eating.'),
],
[
  ('At 9 p.m. yesterday I was watching a film.', 'Jam 9 malam kemarin saya sedang menonton film.'),
  ('When the electricity went off, we were having dinner.', 'Waktu listrik padam, kami sedang makan malam.'),
  ('While Sinta was cooking, the phone rang.', 'Saat Sinta sedang memasak, teleponnya berdering.'),
  ('Dodi fell off his bike while he was riding home.', 'Dodi jatuh dari sepeda saat sedang bersepeda pulang.'),
  ('It was raining when I left the office, so I took a taxi.', 'Hujan sedang turun waktu saya keluar kantor, jadi saya naik taksi.'),
  ("I didn't know what to do, so I asked my boss.", 'Saya tidak tahu harus berbuat apa, jadi saya bertanya kepada atasan.'),
],
[
  ('I was walking home when it was starting to rain.', 'I was walking home when it started to rain.', 'Aksi pendek yang memotong aksi panjang memakai past simple.'),
  ('I was seeing an accident on my way home.', 'I saw an accident on my way home.', '*see* adalah aksi singkat dan kata kerja keadaan, jadi memakai past simple.'),
  ('When the guests arrived, we still cooked the rice.', 'When the guests arrived, we were still cooking the rice.', 'Prosesnya sedang berlangsung saat tamu datang.'),
],
[
  gap('Tulis bentuk past continuous.', "At 9 o'clock last night I {{1}} a film.", [['was watching']], 'Sedang berlangsung pada waktu tertentu di masa lalu: was watching.', ['watch']),
  gap('Tulis bentuk past continuous.', 'When the electricity went off, we {{1}} dinner.', [['were having']], 'Aksi yang sedang berlangsung saat kejadian lain terjadi: were having.', ['have']),
  gap('Tulis bentuk past continuous.', 'What {{1}} when I called you?', [['were you doing']], 'Pertanyaan past continuous: What were you doing …?', ['you / do']),
  gap('Tulis bentuk past continuous.', 'It {{1}} when I left the office, so I took a taxi.', [['was raining']], 'Latar kejadian: hujan sedang turun.', ['rain']),
  gap('Tulis bentuk yang tepat: past continuous atau past simple.', 'While Sinta {{1}}, the phone {{2}}.', [['was cooking'], ['rang']], 'Aksi panjang: was cooking. Aksi pendek yang memotongnya: rang (ring → rang).', ['cook', 'ring']),
  gap('Tulis bentuk past continuous.', 'I {{1}} when the teacher explained the homework.', [["wasn't listening"]], 'Negatif past continuous: wasn\'t (was not) listening.', ['not / listen']),
  gap('Tulis bentuk yang tepat: past continuous atau past simple.', 'Dodi {{1}} off his bike while he {{2}} home.', [['fell'], ['was riding']], 'Aksi pendek: fell (fall → fell). Aksi panjang: was riding.', ['fall', 'ride']),
  gap('Tulis bentuk past continuous.', 'We {{1}} along the beach when we saw a turtle.', [['were walking']], 'Aksi panjang yang sedang berlangsung: were walking.', ['walk']),
  mc('Pilih bentuk yang tepat.', 'I ___ my phone while I was running for the bus.', [
      ('dropped', 'Benar. Aksi singkat yang terjadi di tengah aksi panjang memakai past simple.'),
      ('was dropping', 'Menjatuhkan HP adalah aksi singkat, bukan proses yang berlangsung lama.'),
      ('drop', 'Kalimatnya tentang masa lalu, jadi perlu bentuk lampau.'),
    ], 0, 'Aksi singkat: past simple. Latar yang sedang berlangsung: past continuous.'),
  mc('Pilih bentuk yang tepat.', 'This time yesterday we ___ on the beach in Bali.', [
      ('lay', 'Past simple menceritakan aksi utuh. this time yesterday menunjuk ke tengah-tengah aksi.'),
      ('were lying', 'Benar. Sedang berlangsung pada waktu tertentu kemarin.'),
      ('are lying', 'yesterday menunjukkan masa lalu.'),
    ], 1, 'this time yesterday / at 8 p.m. last night + past continuous.'),
  mc('Pilih bentuk yang tepat.', "When Rina phoned, I ___ dinner, so I couldn't answer.", [
      ('cooked', 'cooked menceritakan aksi utuh, tidak menjelaskan bahwa saya sedang sibuk memasak saat telepon berdering.'),
      ('was cooking', 'Benar. Saya sedang memasak saat Rina menelepon, jadi tidak bisa mengangkat.'),
      ('am cooking', 'Kalimatnya tentang masa lalu.'),
    ], 1, 'Aksi yang sedang berlangsung saat kejadian lain terjadi: past continuous.'),
  mc('Pilih bentuk yang tepat.', 'I ___ what to do, so I asked my boss.', [
      ("didn't know", 'Benar. know adalah kata kerja keadaan, jadi memakai past simple.'),
      ("wasn't knowing", 'know tidak dipakai dalam bentuk continuous.'),
      ("wasn't know", 'was tidak digabung dengan bentuk dasar kata kerja.'),
    ], 0, 'Kata kerja keadaan (know, want, understand) memakai past simple.'),
  order('Apa yang sedang kamu lakukan jam sepuluh tadi?', "What were you doing at ten o'clock ?", 'What + were + you + V-ing + waktu.'),
  order('Saya sedang tidur waktu kamu menelepon.', 'I was sleeping when you called .', 'Aksi panjang (was sleeping) + when + aksi pendek (called).', alts=['when you called I was sleeping .']),
  order('Mereka tidak sedang bekerja waktu itu.', "They weren't working at that time .", "Negatif: weren't + V-ing."),
  order('Dia jatuh saat sedang menuruni tangga.', 'She fell while she was going down the stairs .', 'Aksi pendek (fell) + while + aksi panjang (was going down).'),
  fix(['When the guests arrived,', 'we', 'still cooked', 'the rice.'], 2, ['were still cooking'], 'Prosesnya sedang berlangsung saat tamu datang: were still cooking.'),
  fix(['I', 'was seeing', 'an accident', 'on my way home.'], 1, ['saw'], 'see adalah aksi singkat/keadaan: saw.'),
  fix(['While I', 'am walking', 'home, it started to rain.'], 1, ['was walking', 'walked'], 'Kalimatnya tentang masa lalu. Aksi panjang yang terpotong hujan: was walking.'),
  fix(['We were playing football', 'when it', 'was starting', 'to rain.'], 2, ['started'], 'Hujan mulai turun adalah aksi singkat yang memotong: started.'),
])
print('units 1-6 ok')
