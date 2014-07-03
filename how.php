<?php

/**
 * Skrypt parsuj¹cy KoPS-owy plik HOWELL.DAT do JSONa ³ykalnego przez aplikacjê.
 *
 * Format pliku movements.json:
 *  - s³ownik klucz-wartoœæ
 *  - klucz s³ownika: X-Y (X - liczba sto³ów, Y - liczba rund; umowne, parsowane dla menu)
 *  - wartoœci - struktura:
 *    - tables: INT, liczba sto³ów
 *    - rounds: INT, liczba rund
 *    - sets: ARRAY[INT], pocz¹tkowe numery sto³ów dla kolejnych kompletów
 *    - movement: ARRAY[STRING], ruch pary nr 1 (pierwszej z par ruchomych), okreœlony kolejnymi pozycjami formatu /[0-9]+[NE]/
 *    - positions: ARRAY[INT], pocz¹tkowe numery par na kolejnych pozycjach
 **/

// Dzielimy plik po liniach "*-----..."
$file = preg_split('/\*-+/', file_get_contents('howell.dat'));
$movements = [];
for ($i = 0; $i < count($file); $i++) {
  // segmenty o nieparzystym indeksie (drugi, czwarty itp.) to dane rotacji
  // parsowane s¹ zawsze PO sparsowaniu segmentu o parzystym indeksie, wiêc poni¿ej jest trochê zmiennych ustawianych jeszcze ni¿ej
  if ($i%2) {
    $matches = [];
    preg_match_all('/(\d+)/', $file[$i], $matches); // wyci¹gamy wszystkie liczby z rotacji (numery par)
    $sets = array_fill(0, $rounds, 0); // tablica kompletów rozdañ
    $positions = [];
    $table = 1;
    $set = 0;
    for ($j = 0; $j < count($matches[1]); $j++) {
      if ((int)$matches[1][$j]) { // mamy niezerowy numerek, wiêc jest para
		$sets[$set++] = $table++; // zestaw zaczyna na kolejnym stole
		$positions[] = (int)($matches[1][$j++]); // ustawiamy dwa kolejne numery par
		$positions[] = (int)($matches[1][$j]);
      }
      else { // mamy zerowy numerek, wiêc jest zbiornica
		$sets[$set++] = 0; // zestaw nie zaczyna na ¿adnym stole
      }
    }
    $movement = [];
    $lines = ['N','E'];
    for ($j = $rounds; $j >= 1; $j--) { // tyle par ruchomych, ile rund
      $pos = array_search($j, $positions); // odnajdujemy pary ruchome w kolejnoœci X, X-1, ..., 2, 1
      $movement[] = ceil(($pos+1)/2).$lines[$pos%2]; // i ich pozycjê w tablicy $positions t³umaczymy na pozycjê na sali (xN/E), tworz¹c wstêgê rotacji
    }
	// pozosta³e pary - z automatu stacjonarne
	// kompilujemy strukturê
    $movements[$id] = [
		       'tables' => $tables,
		       'rounds' => $rounds,
		       'sets' => $sets,
		       'movement' => $movement,
		       'positions' => $positions
		       ];
  }
  // segmenty nieparzyste to dane ogólne - liczba rund i sto³ów
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