"""Bandingkan semua teks bahasa Inggris di konten dengan teks PDF buku (file lokal, tidak di-commit).
Pemakaian: python3 scripts/check-similarity.py /path/ke/book.txt
Gagal jika ada rangkaian >= 8 kata yang sama persis dengan buku."""
import json, re, sys, glob, os
N = 8
book = open(sys.argv[1], encoding='utf-8').read()
def words(s):
    s = s.lower().replace('’', "'").replace('‘', "'")
    return re.findall(r"[a-z0-9']+", s)
bw = words(book)
grams = set(tuple(bw[i:i+N]) for i in range(len(bw)-N+1))
hits = []
root = os.path.join(os.path.dirname(__file__), '..', 'content', 'units')
for f in sorted(glob.glob(os.path.join(root, 'u*.json'))):
    u = json.load(open(f))
    texts = []
    L = u['lesson']
    texts += [L['summary']] + [p['example'] for p in L['patterns']] + [e['en'] for e in L['examples']]
    texts += [m['wrong'] for m in L['commonMistakes']] + [m['right'] for m in L['commonMistakes']]
    for q in u['questions']:
        if q['type'] == 'mc':
            texts.append(q['sentence'])
            for o in q['options']:
                texts.append(q['sentence'].replace('___', o['text']))
        elif q['type'] == 'gap':
            s = q['sentence']
            for i, b in enumerate(q['blanks']):
                s = s.replace('{{%d}}' % (i+1), b['accept'][0])
            texts.append(s)
        elif q['type'] == 'order':
            texts.append(' '.join(q['accept'][0]))
        elif q['type'] == 'fix':
            texts.append(q['corrected']); texts.append(' '.join(q['segments']))
    for t in texts:
        w = words(t)
        for i in range(len(w)-N+1):
            if tuple(w[i:i+N]) in grams:
                hits.append((os.path.basename(f), ' '.join(w[i:i+N]), t[:90]))
                break
for h in hits: print('MIRIP', h)
print(f'{len(hits)} kalimat dengan >= {N} kata yang sama dengan buku')
sys.exit(1 if hits else 0)
