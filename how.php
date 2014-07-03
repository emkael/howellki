<?php

/**
 * Skrypt parsuj�cy KoPS-owy plik HOWELL.DAT do JSONa �ykalnego przez aplikacj�.
 *
 * Format pliku movements.json:
 *  - s�ownik klucz-warto��
 *  - klucz s�ownika: X-Y (X - liczba sto��w, Y - liczba rund; umowne, parsowane dla menu)
 *  - warto�ci - struktura:
 *    - tables: INT, liczba sto��w
 *    - rounds: INT, liczba rund
 *    - sets: ARRAY[INT], pocz�tkowe numery sto��w dla kolejnych komplet�w
 *    - movement: ARRAY[STRING], ruch pary nr 1 (pierwszej z par ruchomych), okre�lony kolejnymi pozycjami formatu /[0-9]+[NE]/
 *    - positions: ARRAY[INT], pocz�tkowe numery par na kolejnych pozycjach
 **/

// Dzielimy plik po liniach "*-----..."
$file = preg_split('/\*-+/', file_get_contents('howell.dat'));
$movements = [];
for ($i = 0; $i < count($file); $i++) {
  // segmenty o nieparzystym indeksie (drugi, czwarty itp.) to dane rotacji
  // parsowane s� zawsze PO sparsowaniu segmentu o parzystym indeksie, wi�c poni�ej jest troch� zmiennych ustawianych jeszcze ni�ej
  if ($i%2) {
    $matches = [];
    preg_match_all('/(\d+)/', $file[$i], $matches); // wyci�gamy wszystkie liczby z rotacji (numery par)
    $sets = array_fill(0, $rounds, 0); // tablica komplet�w rozda�
    $positions = [];
    $table = 1;
    $set = 0;
    for ($j = 0; $j < count($matches[1]); $j++) {
      if ((int)$matches[1][$j]) { // mamy niezerowy numerek, wi�c jest para
		$sets[$set++] = $table++; // zestaw zaczyna na kolejnym stole
		$positions[] = (int)($matches[1][$j++]); // ustawiamy dwa kolejne numery par
		$positions[] = (int)($matches[1][$j]);
      }
      else { // mamy zerowy numerek, wi�c jest zbiornica
		$sets[$set++] = 0; // zestaw nie zaczyna na �adnym stole
      }
    }
    $movement = [];
    $lines = ['N','E'];
    for ($j = $rounds; $j >= 1; $j--) { // tyle par ruchomych, ile rund
      $pos = array_search($j, $positions); // odnajdujemy pary ruchome w kolejno�ci X, X-1, ..., 2, 1
      $movement[] = ceil(($pos+1)/2).$lines[$pos%2]; // i ich pozycj� w tablicy $positions t�umaczymy na pozycj� na sali (xN/E), tworz�c wst�g� rotacji
    }
	// pozosta�e pary - z automatu stacjonarne
	// kompilujemy struktur�
    $movements[$id] = [
		       'tables' => $tables,
		       'rounds' => $rounds,
		       'sets' => $sets,
		       'movement' => $movement,
		       'positions' => $positions
		       ];
  }
  // segmenty nieparzyste to dane og�lne - liczba rund i sto��w
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