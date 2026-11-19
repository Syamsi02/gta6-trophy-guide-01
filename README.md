# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Syamsi02/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Syamsi02/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Platinum Road — offline GTA 6 trophy guide and tracker for all 55 PS5 trophies.

GTA VI released today, so this guide is honest about what it knows: every trophy's name, description and grade are shown exactly as the official list publishes them, each guide is written in our own words from that official description, and anything not yet verified in the game is marked **not yet checked in the game**. No invented location or step is presented as fact. Each trophy's guide cites its sources beside it.

What it does:

- A checklist of all 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze), with progress saved in the browser and export/import as JSON.
- Filters by kind (story, missable, collectibles, activities, online), by grade, and by search.
- A spoiler setting that hides the names and descriptions of story trophies until they are earned.
- A five-stage roadmap to the platinum, in order, and 21 trophies flagged missable.
- A paper/night theme toggle. Fully offline: no network requests, system fonts only.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. Or open `app/index.html` through any static server.

To build the graded bundle:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=fgwhnby2&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
