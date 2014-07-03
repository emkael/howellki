<?php

/**
 * Skrypt parsujący KoPS-owy plik HOWELL.DAT do JSONa łykalnego przez aplikację.
 *
 * Format pliku movements.json:
 *  - słownik klucz-wartość
 *  - klucz słownika: X-Y (X - liczba stołów, Y - liczba rund; umowne, parsowane dla menu)
 *  - wartości - struktura:
 *    - tables: INT, liczba stołów
 *    - rounds: INT, liczba rund
 *    - sets: ARRAY[INT], początkowe numery stołów dla kolejnych kompletów
 *    - movement: ARRAY[STRING], ruch pary nr 1 (pierwszej z par ruchomych), określony kolejnymi pozycjami formatu /[0-9]+[NE]/
 *    - positions: ARRAY[INT], początkowe numery par na kolejnych pozycjach
 **/

// Dzielimy plik po liniach "*-----..."
$file = preg_split('/\*-+/', file_get_contents('howell.dat'));
$movements = [];
for ($i = 0; $i < count($file); $i++) {
  // segmenty o nieparzystym indeksie (drugi, czwarty itp.) to dane rotacji
  // parsowane są zawsze PO sparsowaniu segmentu o parzystym indeksie, więc poniżej jest trochę zmiennych ustawianych jeszcze niżej
  if ($i%2) {
    $matches = [];
    preg_match_all('/(\d+)/', $file[$i], $matches); // wyciągamy wszystkie liczby z rotacji (numery par)
    $sets = array_fill(0, $rounds, 0); // tablica kompletów rozdań
    $positions = [];
    $table = 1;
    $set = 0;
    for ($j = 0; $j < count($matches[1]); $j++) {
      if ((int)$matches[1][$j]) { // mamy niezerowy numerek, więc jest para
		$sets[$set++] = $table++; // zestaw zaczyna na kolejnym stole
		$positions[] = (int)($matches[1][$j++]); // ustawiamy dwa kolejne numery par
		$positions[] = (int)($matches[1][$j]);
      }
      else { // mamy zerowy numerek, więc jest zbiornica
		$sets[$set++] = 0; // zestaw nie zaczyna na żadnym stole
      }
    }
    $movement = [];
    $lines = ['N','E'];
    for ($j = $rounds; $j >= 1; $j--) { // tyle par ruchomych, ile rund
      $pos = array_search($j, $positions); // odnajdujemy pary ruchome w kolejności X, X-1, ..., 2, 1
      $movement[] = ceil(($pos+1)/2).$lines[$pos%2]; // i ich pozycję w tablicy $positions tłumaczymy na pozycję na sali (xN/E), tworząc wstęgę rotacji
    }
	// pozostałe pary - z automatu stacjonarne
	// kompilujemy strukturę
    $movements[$id] = [
		       'tables' => $tables,
		       'rounds' => $rounds,
		       'sets' => $sets,
		       'movement' => $movement,
		       'positions' => $positions
		       ];
  }
  // segmenty nieparzyste to dane ogólne - liczba rund i stołów
  else {
    $matches = [];
    preg_match('/.*(-\d+).*RUNDY.*?(\d+).*STOLIKI.*/s', $file[$i], $matches);
    $id = $matches[2].$matches[1];
    $tables = (int)($matches[2]);
    $rounds = -(int)($matches[1]);
  }
}

file_put_contents('movements.json', json_encode($movements));

?>