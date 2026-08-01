import csv, json, re, sys

rows = []
with open("raw_flights.txt", newline="", encoding="utf-8") as f:
    reader = csv.reader(f, delimiter="\t")
    for line in reader:
        if not line or not line[0].strip():
            continue
        rows.append(line)

def parse_duration_minutes(s):
    s = s.strip()
    if not s:
        return None
    parts = s.split(":")
    if len(parts) == 2:
        h, m = parts
        return int(h) * 60 + int(m)
    return None

def parse_num(s):
    s = s.strip()
    if not s:
        return None
    # strip non-numeric suffixes like "km" or text (e.g. "Xc36 to Avarice")
    m = re.match(r"^-?\d+(\.\d+)?", s)
    if not m:
        return None
    return float(m.group(0))

def parse_date(s):
    s = s.strip()
    parts = s.split("/")
    if len(parts) != 3:
        return None
    y, mo, d = parts
    return f"{int(y):04d}-{int(mo):02d}-{int(d):02d}"

flights = []
for r in rows:
    num, date, dur, elev, dist, wing, ftype, site, comments = [c.strip() for c in r]
    flight = {
        "flight_number": int(num),
        "date": parse_date(date),
        "duration_minutes": parse_duration_minutes(dur),
        "max_elevation_m": parse_num(elev),
        "distance_km": parse_num(dist),
        "wing": wing if wing else None,
        "flight_type": ftype if ftype else None,
        "site": site if site else None,
        "comments": comments if comments and comments.upper() != "N/A" else None,
    }
    flights.append(flight)

# Sanity checks
nums = [f["flight_number"] for f in flights]
print("count:", len(flights))
print("first:", flights[0])
print("last:", flights[-1])
print("min/max flight number:", min(nums), max(nums))
missing = [n for n in range(36, 416) if n not in nums]
print("missing flight numbers in range 36-415:", missing)
dup = [n for n in set(nums) if nums.count(n) > 1]
print("duplicate flight numbers:", dup)

total_minutes = sum(f["duration_minutes"] for f in flights if f["duration_minutes"])
print("total minutes:", total_minutes, "-> hours:", total_minutes / 60)

with open("flights_seed.json", "w", encoding="utf-8") as f:
    json.dump(flights, f, indent=2)

print("Wrote flights_seed.json")
