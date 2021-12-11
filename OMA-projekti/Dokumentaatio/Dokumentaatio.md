Dokumentaatio Fullstack


Eero Kantonen AA4106


Harjoitustyönä ajattelin tehdä pienen harjoitustyön tämän fullstack kurssin pohjalta. Harjoitus työssäni käytän back-endin tekemiseen Nodejs/mongodb ja front-end:ssä käytän ihan vanilla Javascriptiä. Harrastan taljajousiammuntaa, joten oli todella helppo löytää oma aihe harjoitustyöhön. 

Harjoitustyön aiheena on taljajousikauppa, jossa tulee kaikki CRUD ominaisuudet esille. Crudissa on siis mahdollista luoda, poistaa, lukea ja päivittää haluttu objekti. Tietoturvaa en tähän työhön laittanut, koska ei ole rahaa pelissä eikä mitään muutakaan menetettävää. Jos olisin halunnut tehdä validaattorin olisin voinut käyttää Googlen Firebasea, mutta totesin sen olevan turha tämän tyyppiseen appiin. Harjoitustyössä käytin visualstudio codea ja kommentoin koodini englanniksi.

Harjoitustyön kannalta tärkeimmät funktiot/piirteet:

Back end

Mongodb scheman luominen, modelin luominen ja yhteyden muodostaminen tietokantaan.

![](OMA-projekti/Dokumentaatio/images/mongo-model.PNG)

Multer mahdollistaa kuvien lähetyksen. Kuvassa nähdään Multerin toiminta. Tehdään oma varasto kuville ja annetaan ehtoja esim. mimetype saa olla vain jpg/png mallia.
![](OMA-projekti/Dokumentaatio/images/multer.PNG)


Nodejs reitit expres:sin avulla. 

![](OMA-projekti/Dokumentaatio/images/routes.PNG)

Edit route oli reiteistä haastavin, mutta siitä selvittiin hyvin.



Front end
