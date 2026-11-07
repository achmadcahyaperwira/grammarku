# Tes penempatan: 20 soal pilihan ganda baru, dimodelkan dari Study guide buku (hlm. 326-335).
# Urut mengikuti unit buku. Setiap soal punya tepat satu jawaban benar di antara pilihannya.
Q = [
    (3, "Be quiet, please. The baby ___.", ["sleeps", "is sleeping", "sleep"], 1),
    (4, "I ___ what you mean.", ["am understanding", "understand", "understanding"], 1),
    (6, "I ___ along the street when I saw an old friend.", ["walked", "was walking", "am walking"], 1),
    (7, "James isn't here. He ___ to the bank.", ["has been", "has gone", "is gone"], 1),
    (12, "I've been waiting here ___ two hours.", ["since", "for", "from"], 1),
    (14, "We ___ to Bali last year.", ["have gone", "went", "have been"], 1),
    (21, "Your bag looks heavy. ___ carry it for you.", ["I carry", "I'll carry", "I'm carrying"], 1),
    (32, "We have lots of time. You ___ hurry.", ["mustn't", "don't need to", "can't"], 1),
    (39, "If I ___ more money, I would buy a new phone.", ["have", "had", "will have"], 1),
    (42, "This bridge ___ in 1990.", ["built", "was built", "has built"], 1),
    (48, "Rina ___ me that she was busy.", ["said", "told", "talked"], 1),
    (50, "Excuse me, do you know where ___?", ["is the station", "the station is", "does the station is"], 1),
    (53, "I enjoy ___ in the morning.", ["to run", "running", "run"], 1),
    (70, "Can you give me some ___ about the course?", ["information", "informations", "an information"], 0),
    (85, "I didn't buy ___ bread.", ["some", "any", "no"], 1),
    (92, "The woman ___ lives next door is a doctor.", ["which", "who", "whose"], 1),
    (98, "The film was very long. I was ___.", ["boring", "bored"], 1),
    (113, "___ the rain, we went for a walk.", ["Although", "Despite", "Even"], 1),
    (121, "The meeting is ___ Monday morning.", ["at", "on", "in"], 1),
    (137, "These shoes are too small. I'm going to ___.", ["take off them", "take them off", "take off it"], 1),
]

def build():
    qs = []
    for k, (u, prompt, choices, correct) in enumerate(Q, 1):
        qs.append({"id": "p%02d" % k, "unit": u, "type": "choice", "prompt": prompt, "choices": choices, "correct": correct})
    return {"note": "Soal baru dengan format seperti Study guide English Grammar in Use. Rekomendasi = unit dari soal pertama yang salah.", "questions": qs}
