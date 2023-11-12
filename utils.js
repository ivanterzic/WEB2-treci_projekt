// u ovom su fileu sve utils funckije koje koristim za izradu asteroida i edit njihoivh parametara
// gornja i donja granica velicine asteroida
const asteroidUpperSize = 32;
const asteroidLowerSize = 20;

// funkcija koja vraca random boju za asteroid
function getRandomAsteroidColor() {
    // na sljedećem sam linku našao boje koje su mi se svidjele i koje su mi se činile prikladne za asteroid, obzirom da je zadano da moraju biti različite nijanse sive
    // https://www.w3schools.com/colors/colors_shades.asp
    // svidjele su mi se rgb vrijendosti između 70 i 211, pa sam ih koristio
    var randomShadeOfGrey = Math.floor(Math.random() * (211 - 70)) + 70;
    // radim string za određenu boju
    randomShadeOfGrey = "rgb(" + randomShadeOfGrey + ", " + randomShadeOfGrey + ", " + randomShadeOfGrey + ")";
    return randomShadeOfGrey;
}

// funkcija koja vraća random smjer i brzinu asteroida pri kreaciji i promjeni položaja nakon izlaska iz canvasa
function getAsteroidDirectionAndSpeed() {
    // brzine su inicijalno testirane pa sam ih pomnožio s 0.8 kako bi asteroidi bili sporiji naknadno

    // prvo generiram random smjer kretanja asteroida
    var direction = Math.floor(Math.random() * 4);
    // ovisno o smjeru, generiram random poziciju asteroida na canvasu i njegovu brzinu kako bi asteroid stvoren izvan canvasa ušao u njega
    // podsjetimo se, koordinatni sustav je takav da je točka (0,0) u gornjem lijevom kutu, x raste desno, a y prema dolje
    // smjer lijevo
    if (direction == 0){
        // ako je smjer lijevo, asteroid se stvara s desne strane canvasa
        return {
            // x koordinata je izvan canvasa s desne strane, za 20 do 70 px kako se ne bi stvarao na rubu ni unutar canvasa te je random broj kako se svi asteroidi ne bi stvarali na istoj udaljenosti od ruba
            x : asteroidsGame.canvas.width + Math.floor(Math.random() * 70) + 20,
            // y koordinata je random broj između 0 i visine canvasa 
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            // brzina x je negativna kako bi asteroid išao lijevo, x kooridnata se smanjuje krećući se lijevo
            // brzine su tako izabrane da se asteroid kreće više prema sredini canvasa te je zato brzina po x generalno veća nego po y
            speed_x: (-Math.floor(Math.random() * 1.5) - 1) * 0.8,
            // brzina y je random broj između -0.5 i 0.5 pomnožen s 0.8 kako bi asteroid imao jednake šanse ići gore i dolje
            speed_y: Math.floor((Math.random() * 1) - 0.5) *  0.8
        };
    // logika iza brzina i koordinata je ista za sve smjerove, samo su konkretne vrijednosti prilađene smjeru
    // vrijednosti samih brzina su prilagođene testiranjem
    }
    // smjer gore
    else if (direction == 1){
        return {
            // x koordinata je random broj između 0 i širine canvasa
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            // y koordinata je izvan canvasa s donje strane za 20 do 70 px, zato dodajem na visinu canvasa, želim da se asteroid stvara ispod canvasa
            y : asteroidsGame.canvas.height + Math.floor(Math.random() * 70) + 20,
            // brzina x je random broj između -0.5*0.8 i 0.5*0.8 kako bi asteroid imao jednake šanse ići lijevo i desno
            speed_x: ((Math.random() * 1) - 0.5) *  0.8, 
            // brzina y je negativna kako bi asteroid išao gore, y kooridnata se smanjuje krećući se gore, veća je od brzine po x kako bi asteroid išao brže gore, kako nebi išao previše u stranu
            speed_y: (-Math.floor(Math.random() * 1.5) - 1) * 0.8
        }; 
    }
    // smjer desno
    else if (direction == 2){
        return {
            // x koordinata je izvan canvasa s lijeve strane za 20 do 70 px, zato oduzimam od širine canvasa, želim da se asteroid stvara s lijeve strane canvasa
            x : -Math.floor(Math.random() * 70) -20,
            // y koordinata je random broj između 0 i visine canvasa
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            // brzina x je pozitivna kako bi asteroid išao desno, razlika u brzinama je iz istog razloga kao i prije
            speed_x: (Math.floor(Math.random() * 1.5) + 0.5) * 0.8,
            // brzina y je random broj između -0.5*0.8 i 0.5*0.8 kako bi asteroid imao jednake šanse ići gore i dolje
            speed_y: ((Math.random() * 1) - 0.5) *  0.8
        };
    }
    else {
        // smjer dolje
        return {
            // x koordinata je random broj između 0 i širine canvasa
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            // y koordinata je izvan canvasa s gornje strane za 20 do 70 px, zato oduzimam od visine canvasa, želim da se asteroid stvara iznad canvasa
            y : -Math.floor(Math.random() * 70) - 20,
            // brzina x je random broj između -0.5*0.8 i 0.5*0.8 kako bi asteroid imao jednake šanse ići lijevo i desno
            speed_x:((Math.random() * 1) - 0.5) *  0.8,
            // brzina y je pozitivna kako bi asteroid išao dolje, razlika u brzinama je iz istog razloga kao i prije
            speed_y: (Math.floor(Math.random() * 1.5) + 0.5) * 0.8
        }; 
    }
}

// funkcija koja vraća random veličinu asteroida
function getRandomAsteroidSize(){
    // vraćam random broj između gornje i donje granice veličine asteroida
    return Math.floor(Math.random() * (asteroidUpperSize - asteroidLowerSize)) + asteroidLowerSize;
}

