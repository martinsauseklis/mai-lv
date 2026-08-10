# mai.lv

Statiska lapa + vēstkopas arhīvs. Nekādu ietvaru, nekādu atkarību.

## Kā uzrakstīt un publicēt rakstu

```bash
python3 publish.py jauns "Virsraksts"   # izveido teksti/GGGG-MM-DD-virsraksts.txt
# uzraksti tekstu tajā failā
python3 publish.py build                # pārģenerē lapu un vēstuli
```

`build` izveido:

| kur | kas |
|---|---|
| `raksti/<slugs>.html` | publiskā raksta lapa |
| `vestules/<slugs>.html` | HTML, ko ielīmē EmailOctopus (Content → custom HTML) |
| `index.html` | saraksts starp `ARHĪVS:SĀKUMS` / `ARHĪVS:BEIGAS` markieriem |

**Laika slēdzene.** Septiņas dienas raksts pieder abonentiem: sarakstā redzams
virsraksts ar atzīmi *tikai e-pastā*, bet lapa netiek uzģenerēta vispār. Astotajā
dienā `build` to publicē.

## Ko drīkst rediģēt ar roku

Rediģē: `teksti/*.txt`, `index.html` (ārpus arhīva markieriem), `privatums.html`,
`veidne.html`.
Nerediģē: `raksti/`, `vestules/`, arhīva bloks — tos pārraksta `build`.

## Vietējā pārbaude

```bash
python3 -m http.server 8099 --bind 0.0.0.0
```
Telefonā: `http://<datora-IP>:8099`.
