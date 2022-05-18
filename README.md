
# Space Shooter 1V1

Een werkend spel waar je jouw ruimteschip kunt laten bewegen, kunt laten schieten en gebruik kan maken van een boost.

Je kijkt van boven af mee met je ruimteschip zodat alles gemakkelijk te zien is.
In deze versie heb ik mijn spel wat leuker gemaakt door verschillende zaken toe te voegen.


Dit is in het kader van mijn GIP opdracht.
Er gaan zeker nog meerdere dingen volgen, dus zeker niet getreurd.


## Features
- Schieten met de shift toets
- Boosten (versnelling) zolang je zelf wilt met de ctrl toets (zolang de boost voorraad er is)
- bewegen met de pijltjes toetsen
- Er spelen zich geluiden af bij het boosten en het schieten.
- Een fps meter.
- Je nickname kunnen kiezen. (max 10 karakters)
- De kleur van je ruimteschip veranderen. (via de settings)
- De kleur van je kogel veranderen. (via de settings)
- Leuke geluidseffecten en achtergrondmuziek.
- Een levens teller die van kleur verandert naarmate je levens dalen.
- Een lobby met achtergrondmuziek als speler 2 nog niet is gestart.
- Ontwijken door de spatie toets en de pijltjes in te houden.
- Je highscore kunnen bekijken op een aparte pagina.
- Schuilen achter een muur op de map.
- Een explosie die te zien en te horen is wanneer een speler wordt geraakt.



# Handige links
## Spring Boot
https://spring.io/
## SockJS
https://github.com/sockjs/sockjs-client
## StompJS
https://stomp-js.github.io/stomp-websocket/codo/class/Client.html
# Hoe gebruik ik dit project?
## Xampp downloaden en starten
- download Xampp(https://www.apachefriends.org/index.html)
- installeer het via de wizard
- open het en start de apache en mysql server
## Database aanmaken
- Download Dbeaver (https://dbeaver.io/)
* installeer het via de wizard
- Klik op File en dan op New.
![App Screenshot](https://i.postimg.cc/CxYZcr9g/New.png)
- Onder Dbeaver klik op "Database Connection"
- Klik op MySQL
![App Screenshot](https://i.postimg.cc/3NSLtDxM/name.png)
- Hier ga je de naam van je database invullen en eventueel een wachtwoord en username
- druk nu op finish
- rechter muisklik op databases op je Connection
- Create new Database
- Geef je database een naam
- Rechter muisklik op je database en klik tools
- klik op restore database en kies dan de sql file in mijn project

## Eclipse
* Download Eclipse (https://www.eclipse.org/downloads/)
* installeer eclipse via de wizard
* kies je opslaglocatie
* plaats het unzippte project in deze locatie
## application.properties aanpassen
Open application.properties in de map resources

pas de eerste lijn zo aan:
- Verander localhost in je connection naam
- verander 3306 met je poort van je connection (staat naast je connection naam)
- en de naam achter de "/" verander je naar jouw database naam.
## Pas de afbeeldingen aan
* Open Play.html onder de templates map
* Ga naar een afbeelding en selecteer het ip-adres van de afbeelding link
* Druk op ctrl+h -> replace -> vul je eigen ip-adres in
## start de Spring server
* open Application.java in de map helloWorld
* Rechter muisklik -> run as -> Java Application

## Open het spel
- Kijk in xampp naar het eerste cijfer onder poorten
- Typ dan in Google: http://localhost (of je ip adres) :het nummer van je poort/start
- Bv: http://localhost:8080/start
 
# Screenshots

## Start Menu
![App Screenshot](https://iili.io/W8J7gR.png)
## Settings
![App Screenshot](https://i.postimg.cc/XJVTdM5s/verise-2-settings.png)
## Lobby
![App Screenshot](https://i.postimg.cc/900KgGJT/Versie-2-lobby.png)
## Teller voor het spel begint
![App Screenshot](https://iili.io/W8dzYl.png)
## Het echte spel.
![App Screenshot](https://iili.io/W8J3ib.md.png)
## winnaar scherm
![App Screenshot](https://iili.io/W8dIv2.png)
## Highscores
![App Screenshot](https://i.ibb.co/s3kqLtR/Versie-3-Highscores.png)
