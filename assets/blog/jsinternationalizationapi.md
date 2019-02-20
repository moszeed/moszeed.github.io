# Sortieren mit der Internationalization API

Vorbei sind die Zeiten in denen man Sortierungen selber bauen musste und
am Ende nicht wusste warum genau das nun funktioniert.

Und zudem auch keine wirkliche "natürliche" Such-Ordnung ermöglicht.

Dafür gibt es nun: [*Intl.Collator*](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Collator)
das sieht dann wie folgt aus:
```
['1_a','b','c', 1, 2, 3].sort(new Intl.Collator('de').compare);
// ergibt [1, "1_a", 2, 3, "b", "c"]
```

oder mit einem "Array of Objects":
```
const collator = new Intl.Collator(undefined, {
  numeric    : true,
  sensitivity: 'base'
});

const arrayOfObject = [
    {key: '1_text', otherValue: 20},
    {key: '12_text', otherValue: 30},
    {key: '2_text', otherValue: 50}
];

arrayOfObject.sort((a, b) => collator.compare(a.key, b.key))
```

und das alles mit Support bis runter zum IE11!
