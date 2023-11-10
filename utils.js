// u ovom su fileu sve utils funckije koje koristim za izradu asteroida i edit njihoivh parametara
// gornja i donja granica velicine asteroida
const asteroidUpperSize = 40;
const asteroidLowerSize = 20;

// funkcija koja vraca random boju za asteroid
function getRandomAsteroidColor() {
    // na sljedećem sam linku našao boje koje su mi se svidjele i koje su mi se činile prikladne za asteroid, obzirom da je zadano da moraju biti različite nijanse sive
    // https://www.w3schools.com/colors/colors_shades.asp
    // svidjele su mi se rgb vrijendosti između 104 i 211, pa sam ih koristio
    var randomShadeOfGrey = Math.floor(Math.random() * (211 - 104)) + 104;
    // radim string za određenu boju
    randomShadeOfGrey = "rgb(" + randomShadeOfGrey + ", " + randomShadeOfGrey + ", " + randomShadeOfGrey + ")";
    return randomShadeOfGrey;
}

// funkcija koja vraća random smjer i brzinu asteroida pri kreaciji i promjeni položaja nakon izlaska iz canvasa
function getAsteroidDirectionAndSpeed() {
    // prvo biram random smjer asteroida
    var direction = Math.floor(Math.random() * 4);
    // ako je 0, asteroid ide lijevo
    if (direction == 0){
        // sukladno tome, vraćam objekt sa vrijednostima brzina i kooridnata
        // x i y su određeni tako da asteroid bude izvan canvasa za 50px i to s desne strane što sam postigao tako da sam x postavio na canvas.width + 50, obzirom da ide lijevo, želim da se pojavi s desne strane canvasa
        return {
            x : asteroidsGame.canvas.width + 50,
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            // brzina x je negativna kako bi asteroid išao lijevo,
            speed_x: -Math.floor(Math.random() * 2) - 0.5,
            speed_y: Math.floor(Math.random() * 1.5) - 0.5};
    }

    else if (direction == 1){
        // gore
        return {
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            y : asteroidsGame.canvas.height + 50,
            speed_x: Math.floor(Math.random() * 1.5) - 0.5 ,
            speed_y: - Math.floor(Math.random() * 2) - 0.5};
    }
    else if (direction == 2){
        // desno
        return {
            x : -50,
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            speed_x:Math.floor(Math.random() *2) - 0.5,
            speed_y: Math.floor(Math.random() * 1.5) + 0.5};
    }
    else {
        return {
            // dolje
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            y : -50,
            speed_x: Math.floor(Math.random() *1.5) + 0.5,
            speed_y: Math.floor(Math.random() * 2) - 0.5};
    }
}

function getRandomAsteroidSize(){
    return Math.floor(Math.random() * (asteroidUpperSize - asteroidLowerSize)) + asteroidLowerSize;
}

