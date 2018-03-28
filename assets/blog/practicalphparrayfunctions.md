# Praktische “PHP” Array-Funktionen
Mit Arrays und Objekten arbeiten kann manchmal ziemlich kompliziert sein,
darum hier ein paar praktische PHP Funktionen die einem das Leben durchaus leichter machen.


## **Mehrdimensionale Objekte in Arrays umwandeln ( oder umgekehrt )**

Um ein mehrdimensionales Objekt in ein Array umzuwandeln habe ich, 
bevor ich folgenden “Trick” kannte, immer eine rekursive Funktion bemüht.

Doch das ist völlig unnötig dank “**json_decode**” und “**json_encode**”: 


    $object = (object) array(
        "param1" => (object) array(
           "subParam1" => 1,
           "subParam2" => 2
        )
    );
    
    $array = json_decode(json_encode($object), true) 
    // wechselt man hier auf false werden Objekte erzeugt
    
    // Ergebnis:
    // array ( 'param1' =>
    //    array ('subParam1' => 1, 'subParam2' => 2 )
    // )
## **Arrays modifizieren mit “array_map”**

Um eine Funktion auf alle Werte innerhalb eines Arrays anzuwenden und 
diese dann in einem neuen Array zu speichern muss kein kompliziertes “**for**” oder “**foreach**”
Konstrukt gebaut werden, es reicht der Befehl “**array_map**”:


    $array = array("Bernd", "Chilly", "Briegel");
    
    $modifiedArray = array_map(function($arrayValue) {
      return "Hallo " . $arrayValue . "!";
    }, $array);
    
    // Ergebnis:
    // ['Hallo Bernd!', 'Hallo Chilly!', 'Hallo Briegel!']


## **Arrays Filtern mit “array_filter”**

Eine weitere Art ein Array zu modifizieren ist das Filtern von Inhalten,
um dies einfach zu halten gibt es “**array_filter**”:


    $array = array(1, 2, null, 3, 0, false, 4);
    
    // nun alles was leer ist raus
    $filteredArray = array_filter($array, function($item) {
        return !empty($item);
    })
    
    // Ergebnis: [1, 2, 3]


## **Arrays umformen mit “array_reduce”**

Um auf Basis eines vorhanden Arrays ein neues zu erstellen gibt es in die Funktion “**array_reduce**”.


    $array = array(1, "a", "b", 2, "c", 3);
    
    $newArray = array_reduce($array, 
      function($store, $arrayItem) {
        if (is_string($arrayItem)) array_push($store['number'],  $arrayItem);    
        if (is_string($arrayItem)) array_push($store['string'],  $arrayItem);
        return $store;
      }, [
        'number' => array(),
        'string' => array()
      ]
    );
    
    // Ergebnis:
    // array (
    //  'number' => array ( 0 => 1, 1 => 2, 2 => 3 ),
    //  'string' => array ( 0 => 'a', 1 => 'b', 2 => 'c')
    //)


Welche PHP Funktionen haben euch das Leben erleichtert ?
Kennt ihr noch andere hilfreiche Funktionen ? 
Anmerkungen? Fragen? Wünsche ? Der Kommentarbereich ist das was du suchst !

