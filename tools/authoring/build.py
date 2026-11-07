import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import write_unit
import units_01_09, units_10_18, placement
out = sys.argv[1]
os.makedirs(os.path.join(out, "units"), exist_ok=True)
for u in units_01_09.UNITS + units_10_18.UNITS:
    write_unit(out, u)
json.dump(placement.build(), open(os.path.join(out, "placement.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("written", len(units_01_09.UNITS + units_10_18.UNITS), "units")
