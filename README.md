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

### Skrypt generujący plik rotacji (how.php):

 * PHP 5.4+
 
Instalacja
----------

1. Umieścić w publicznie dostępnym katalogu serwera HTTP zawartość repozytorium.
2. W katalogu /js/ dołączyć wymagane biblioteki JS (zamieniając dowiązania symboliczne na właściwe bądź zastepując je katalogami).

Opcjonalne wygenerowanie pliku rotacji (movements.json):
1. Umieścić w katalogu roboczym plik howell.dat w formacie KoPSa.
2. Uruchomić skrypt how.php.

Autor
-----

mkl - Michał Klichowicz

Licencja
--------

Program udostępniany jest na licencji GPL wersji 2.

Szczegóły licencji znajdują się w pliku [LICENSE](LICENSE)

***
`And the things you can't remember tell the things you can forget.`
