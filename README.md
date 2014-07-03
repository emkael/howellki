howellki
========

Wizualizacja rotacji turniejów brydża porównawczego

Wymagania systemowe
-------------------

### Wizualizacja:

 * serwer HTTP (obsługa interpreterów języków skrytpowych - niewymagana)
 * biblioteki JS:
   - jQuery (w wersji rozsądnie niedawnej)
   - jQuery UI (j.w.)
   - jQuery easing plugin

### Skrypt generujący plik rotacji ([how.php](how.php)):

 * PHP 5.4+
 
Instalacja
----------

1. Umieścić w publicznie dostępnym katalogu serwera HTTP zawartość repozytorium.
2. W katalogu [/js/](js/) dołączyć wymagane biblioteki JS (zamieniając dowiązania symboliczne na właściwe bądź zastepując je katalogami).

Opcjonalne wygenerowanie pliku rotacji ([movements.json](movements.json)):
1. Umieścić w katalogu roboczym plik howell.dat w formacie KoPSa.
2. Uruchomić skrypt [how.php](how.php).

Możliwe również jest ręczne stworzenie pliku rotacji, wg formatu opisanego w skrypcie generującym.

Autor
-----

mkl - Michał Klichowicz

Licencja
--------

Program udostępniany jest na licencji [GPL wersji 2](http://www.gnu.org/licenses/gpl-2.0.html).

***
`And the things you can't remember tell the things you can't forget.`
