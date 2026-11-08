"""Alat bantu menulis konten unit secara ringkas, lalu menyimpannya sebagai content/units/uNNN.json.

Semua penjelasan, contoh, dan soal ditulis sendiri (bukan dari buku).
"""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'content', 'units')
LETTERS = 'abcd'


def mc(instruction, sentence, options, answer, explanation):
    """options: list of (text, why). answer: indeks opsi benar (0-based)."""
    return {
        'type': 'mc', 'instruction': instruction, 'sentence': sentence,
        'options': [{'id': LETTERS[i], 'text': t, 'why': w} for i, (t, w) in enumerate(options)],
        'answer': LETTERS[answer], 'explanation': explanation,
    }


def gap(instruction, sentence, blanks, explanation, hints=None):
    """blanks: list of list[str] (jawaban yang diterima per rumpang). hints: list petunjuk per rumpang."""
    out = []
    for i, acc in enumerate(blanks):
        b = {'accept': acc}
        if hints and i < len(hints) and hints[i]:
            b['hint'] = hints[i]
        out.append(b)
    return {'type': 'gap', 'instruction': instruction, 'sentence': sentence, 'blanks': out, 'explanation': explanation}


def order(hint, sentence, explanation, alts=(), instruction='Susun kata menjadi kalimat.'):
    """sentence: token dipisah spasi (tanda baca sebagai token sendiri). alts: urutan lain yang sah."""
    tokens = sentence.split()
    accept = [tokens] + [a.split() for a in alts]
    shuffled = tokens[:]  # urutan acak dibuat di aplikasi
    return {'type': 'order', 'instruction': instruction, 'hint': hint, 'tokens': shuffled, 'accept': accept, 'explanation': explanation}


def fix(segments, error_index, accept, explanation, instruction='Ketuk bagian yang salah, lalu tulis perbaikannya.'):
    corrected = ' '.join(accept[0] if i == error_index else s for i, s in enumerate(segments))
    return {'type': 'fix', 'instruction': instruction, 'segments': segments, 'errorIndex': error_index,
            'accept': accept, 'corrected': corrected, 'explanation': explanation}


def unit(no, group_id, title, summary, patterns, examples, mistakes, questions):
    qs = []
    for i, q in enumerate(questions, 1):
        q = dict(q)
        q = {'id': f'u{no:03d}-q{i:02d}', **q}
        qs.append(q)
    data = {
        'schemaVersion': 1, 'no': no, 'groupId': group_id, 'title': title,
        'lesson': {
            'summary': summary.strip(),
            'patterns': [{'formula': f, 'example': e} for f, e in patterns],
            'examples': [{'en': en, 'id': idn} for en, idn in examples],
            'commonMistakes': [{'wrong': w, 'right': r, 'why': y} for w, r, y in mistakes],
        },
        'questions': qs,
    }
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f'u{no:03d}.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return path
