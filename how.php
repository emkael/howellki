<?php

$file = preg_split('/\*-+/', file_get_contents('howell.dat'));
$movements = [];
for ($i = 0; $i < count($file); $i++) {
  if ($i%2) {
    $matches = [];
    preg_match_all('/(\d+)/', $file[$i], $matches);
    $sets = array_fill(0, $rounds, 0);
    $positions = [];
    $table = 1;
    $set = 0;
    for ($j = 0; $j < count($matches[1]); $j++) {
      if ((int)$matches[1][$j]) {
	$sets[$set++] = $table++;
	$positions[] = (int)($matches[1][$j++]);
	$positions[] = (int)($matches[1][$j]);
      }
      else {
	$sets[$set++] = 0;
      }
    }
    $movement = [];
    $lines = ['N','E'];
    for ($j = $rounds; $j >= 1; $j--) {
      $pos = array_search($j, $positions);
      $movement[] = ceil(($pos+1)/2).$lines[$pos%2];
    }
    $movements[$id] = [
		       'tables' => $tables,
		       'rounds' => $rounds,
		       'sets' => $sets,
		       'movement' => $movement,
		       'positions' => $positions
		       ];
  }
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