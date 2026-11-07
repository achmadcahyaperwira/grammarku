import json, os

def _dedupe(xs):
    seen, out = set(), []
    for x in xs:
        k = x.strip()
        if k not in seen:
            seen.add(k); out.append(k)
    return out

def expand(s):
    """Expand nested alternations: 'I {go|went} {|there}' -> all combinations."""
    i = s.find('{')
    if i < 0:
        return [' '.join(s.split())]
    depth = 0
    for j in range(i, len(s)):
        if s[j] == '{': depth += 1
        elif s[j] == '}':
            depth -= 1
            if depth == 0: break
    inner = s[i + 1:j]
    parts, depth, cur = [], 0, ''
    for ch in inner:
        if ch == '{': depth += 1
        if ch == '}': depth -= 1
        if ch == '|' and depth == 0:
            parts.append(cur); cur = ''
        else:
            cur += ch
    parts.append(cur)
    res = []
    for p in parts:
        res.extend(expand(s[:i] + p + s[j + 1:]))
    return _dedupe([' '.join(r.split()).replace(' ,', ',').replace(' .', '.').replace(' ?', '?') for r in res])

def answers(*patterns):
    out = []
    for p in patterns:
        out.extend(expand(p))
    return _dedupe(out)

def C(prompt, choices, correct, why):
    return {"type": "choice", "prompt": prompt, "choices": choices, "correct": correct, "why": why}

def F(prompt, answer, why, accept=()):
    return {"type": "fill", "prompt": prompt, "answer": answer, "accept": list(accept), "why": why}

def V(prompt, answer, why, accept=()):
    return {"type": "verbform", "prompt": prompt, "answer": answer, "accept": list(accept), "why": why}

def O(prompt, tokens, why, accept=()):
    return {"type": "order", "prompt": prompt, "tokens": tokens, "answer": " ".join(tokens), "accept": list(accept), "why": why}

def X(prompt, why, answer=None, accept=()):
    """Perbaiki kalimat. answer=None berarti kalimat sudah benar."""
    if answer is None:
        return {"type": "correct", "prompt": prompt, "isCorrect": True, "answer": prompt, "accept": [], "why": why}
    return {"type": "correct", "prompt": prompt, "isCorrect": False, "answer": answer, "accept": list(accept), "why": why}

def M(prompt, pairs, why):
    return {"type": "match", "prompt": prompt, "pairs": [list(p) for p in pairs], "why": why}

def T(source, patterns, why, hint=None):
    a = answers(*patterns)
    q = {"type": "translate", "source": source, "answer": a[0], "accept": a[1:], "why": why}
    if hint: q["prompt"] = hint
    return q

def card(text, examples, trap=None):
    c = {"text": text, "examples": [{"en": e, "id": i} for e, i in examples]}
    if trap: c["trap"] = trap
    return c

def unit(n, path, title, title_id, cards, questions):
    qs = []
    for k, q in enumerate(questions, 1):
        q = dict(q)
        q["id"] = "u%03d-q%02d" % (n, k)
        q["ref"] = n
        qs.append(q)
    return {
        "unit": n, "path": path, "title": title, "titleId": title_id,
        "bookPages": "%d-%d" % (2 * n, 2 * n + 1),
        "lessons": [{"id": "u%03d-l1" % n, "cards": cards, "questions": qs}]
    }

def write_unit(outdir, u):
    path = os.path.join(outdir, "units", "unit-%03d.json" % u["unit"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(u, f, ensure_ascii=False, indent=1)
    return path
