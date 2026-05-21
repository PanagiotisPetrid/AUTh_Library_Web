# Find Me — AUTh Central Library

A student-made utility for the Aristotle University of Thessaloniki. Find Me lets students share their exact library table with friends via a single link, with no accounts, no tracking, and no data collection.

---

## About

Finding friends in a large library is surprisingly annoying. Find Me solves this with a simple interactive floor plan — tap your table, send the link, done. The recipient taps the link and the table is highlighted directly in the app (or on the web if they don't have it installed).

The app is built and maintained by a single AUTh student, for fellow AUTh students.

---

## This repository

This repo serves as the **GitHub Pages backend** for the Find Me Android app. It hosts:

| File | Purpose |
|---|---|
| `index.html` | Landing page — shown when a user opens a shared link without the app installed |
| `map.html` | Interactive map — handles both location sharing responses and viewing a friend's highlighted table |
| `privacy.html` | Privacy policy |
| `troubleshooting.html` | Step-by-step deep link fix guide for Samsung, Pixel, Xiaomi, Huawei, OPPO |
| `testers.html` | Instructions for joining the closed testing programme |
| `404.html` | Catches deep links (e.g. `/AUTh_Library_Web/C4`) and redirects to `map.html?table=C4` |
| `sw.js` | Service worker — caches the map image on first visit for instant subsequent loads |
| `.well-known/assetlinks.json` | Android App Links verification — tells Android that this domain is associated with the app, enabling automatic deep link interception |

### How deep linking works

When a user shares their table from the app, the shared link looks like:

```
https://panagiotispetrid.github.io/AUTh_Library_Web/C4
```

- **If the recipient has the app installed:** Android intercepts the link and opens the app directly, highlighting table C4.
- **If they don't:** `404.html` catches the path, redirects to `map.html?table=C4`, and the table is highlighted on the web map. A download prompt appears after a few seconds.

The `map.html` page also handles the reverse flow — when a user is asked *"where are you sitting?"*, they open `map.html` (either in their browser or via the app), tap their table, and the reply message is automatically copied to their clipboard.

---

## Assets

| File | Notes |
|---|---|
| `auth_library_new.png` | Main floor plan image used by both the app and the web map |
| `screenshots/` | Play Store screenshots |

---

## Privacy

Find Me collects no personal data whatsoever — no analytics, no crash reporting, no advertising SDKs, no server of any kind. The only data that ever leaves a user's device is what they deliberately choose to share (a table name in a link), and that sharing happens entirely through the OS share sheet, not through any infrastructure owned by this project.

See [`privacy.html`](https://panagiotispetrid.github.io/AUTh_Library_Web/privacy.html) for the full policy.

---

## Become a tester

The app is currently in closed testing on Google Play. If you're an AUTh student and want early access, see the [tester guide](https://panagiotispetrid.github.io/AUTh_Library_Web/testers.html).

---

## Author

Built and maintained by [SmartUniLabs](mailto:smart.unilabs@gmail.com) —
an independent student project at the Aristotle University of Thessaloniki.
