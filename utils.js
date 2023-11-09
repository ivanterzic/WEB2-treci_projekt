const asteroidUpperSize = 40;
const asteroidLowerSize = 20;

function getRandomAsteroidColor() {
    // https://www.w3schools.com/colors/colors_shades.asp
    var randomShadeOfGrey = Math.floor(Math.random() * 220) + 48;
    randomShadeOfGrey = "rgb(" + randomShadeOfGrey + ", " + randomShadeOfGrey + ", " + randomShadeOfGrey + ")";
    return randomShadeOfGrey;
}

function getAsteroidDirectionAndSpeed() {
    var direction = Math.floor(Math.random() * 4);
    if (direction == 0){
        // lijevo
        return {
            x : asteroidsGame.canvas.width + 200,
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            speed_x: -Math.floor(Math.random() * 3) - 1,
            speed_y: Math.floor(Math.random() * 6) - 3};
    }

    else if (direction == 1){
        // gore
        return {
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            y : asteroidsGame.canvas.height + 200,
            speed_x:  Math.floor(Math.random() * 6) - 3,
            speed_y: -Math.floor(Math.random() * 3) - 1};
    }
    else if (direction == 2){
        // desno
        return {
            x : -200,
            y : Math.floor(Math.random() * asteroidsGame.canvas.height),
            speed_x:Math.floor(Math.random() * 3) + 1,
            speed_y: Math.floor(Math.random() *6) - 3};
    }
    else {
        return {
            // dolje
            x : Math.floor(Math.random() * asteroidsGame.canvas.width),
            y : -200,
            speed_x: Math.floor(Math.random() * 6) - 3,
            speed_y: Math.floor(Math.random() *3) + 1};
    }
}

function getRandomAsteroidSize(){
    return Math.floor(Math.random() * (asteroidUpperSize - asteroidLowerSize)) + asteroidLowerSize;
}

