// definicija konstanti veličina za igru
const playerSize = 40;
const starSize = 3;
const playerSpeed = 1.5;

// varijabla za provjeru je li igra počela nakon učitavanja stranice
var started = false;
// definicija varijabli za pojedine elemente
// varijabla za igrača
var playerPiece;
// polje varijabli za zvijezde u pozadini
var stars = [];
// polje varijabli za asteroide
var asteroids = [];
// inicijalizacija varijable vremena početka
let startTime = null;
// dohvat najboljeg vremena iz local storagea, kako je zadano u specifikaciji zadatka, koristeći HTML5 Web Storage API
const bestTime = Number(localStorage.getItem('bestTime')) || 0;

// varijabla igre, tu ću pohraniti informacije o canvasu
// po uzoru na engine s predavanja, neki elementi su promijenjeni
const asteroidsGame = {
    // kreiram canvas element
    canvas: document.createElement("canvas"),
    // funkcija za pokretanje igre
    start: function () {
        this.canvas.id = "asteroidsGame";
        // definiram veličinu canvasa, uzimam veličinu prozora jer je zadano da se canvas proteže po cijelom prozoru
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // dohvaćam kontekst canvasa, kontekst crtanja i to je objekt koji mi pruža API za crtanje
        this.context = this.canvas.getContext("2d");
        // ubacujem canvas u body same HTML5 stranice
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        // postavljam interval na 5 milisekundi za update canvasa
        this.interval = setInterval(updateGameArea, 5);
        // dodajemo event listenere za tipke
        // oni su bitni za kretanje igrača, kad ih nebi bilo pritisak na tipku nebi imao nikakav efekt
        // keys polje bilježi koje su tipke pritisnute, a koje nisu, na taj način se igrač može kretati i dijagonalno ako drži dvije tipke jer se kasnije u kodu provjerava koje su tipke pritisnute i po tome se mijenjaju koordinate igrača
        document.addEventListener("keydown", function (e) {
            asteroidsGame.keys = (asteroidsGame.keys || []);
            asteroidsGame.keys[e.keyCode] = true;
        });
        // event listener za keyup, kad se tipka otpusti, postavljam da je false
        document.addEventListener("keyup", function (e) {
            asteroidsGame.keys[e.keyCode] = false;
        });
    },
    stop: function () {
        // brišem interval i tako zaustavljam igru,zaustavljaju se animacije i sve ostalo
        clearInterval(this.interval);
    },
    clear: function () {
        // brišem canvas funkcijom clearRect, kako je opisano u prezentaciji
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// ovo je komponenta samog igrača, preiuzeto s predavanja
function playerComponent(size, color, x, y, speed) {
    // definiram varijable za komponentu, tip, dimenzije, boju, poziciju, brzinu
    this.size = size;
    this.color = color;
    // incijaliziram brzinu na 0, igrač se ne kreće dok ne pritisne tipku
    this.speed_x = 0;
    this.speed_y = 0;
    this.x = x;
    this.y = y;
    this.playerSpeed = speed;
    // funkcija za update komponente
    // funkcija se poziva kod svakog refresha canvasa, odnosno updateGameArea, i osvježava poziciju komponente igrača
    this.update = function () {
        // dohvaćam kontekst canvasa
        ctx = asteroidsGame.context;
        ctx.save();
        // translatiram kontekst na poziciju igrača, ona se mijenja s newpos funkcijom
        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        // dodajem 3D sjenu oko ruba igrača, zadano zadatakom
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        // popunjavam pravookutnik bojom, stavljam x koordinatu, y koordinatu, širinu i visinu
        // x i y koordinate su ovog oblika jer je kontekst canvasa već translatiran na željenu poziciju igrača pa onda crtam igrača na poziciji koja je za pola njegove stranice u lijevo i gore, što je u negativnim smjerovima 
        ctx.fillRect(this.size / -2, this.size / -2, this.size, this.size);
        ctx.restore();
    }
    // funkcija za postavljanje nove pozicije
    // u odnosu na predavanje, dodao sam movement po x i y osi s tipkama strelica
    // dodao sam i wasd tipke za kretanje jer mi se prolila kava po tipkovnici, ne radi mi lijeva strelica pa moram tako testirati :)
    this.newPos = function () {
        // za keyCode sam koristio brojeve tipki, 37 za lijevo, 38 za gore, 39 za desno i 40 za dolje, w, a, s, d su analogno 87, 65, 83, 68
        // negativne su vrijednosti za lijevo i gore, pozitivne za desno i dolje jer je koordinatni sustav u canvasu takav da je 0,0 u gornjem lijevom kutu
        asteroidsGame.keys = asteroidsGame.keys || {}; // ako je keys undefined, postavi ga na prazan objekt
        // ako su pritisnute tipke lijeve strelice ili a, brzina po x osi je -playerSpeed, tj. igrač se kreće u lijevo
        if (asteroidsGame.keys[37] || asteroidsGame.keys[65]) {
            // brzina po x osi je apsolutne vrijednost playerSpeed koji se prosljeđuje u konstruktoru, tj. igrač se kreće za playerSpeed u lijevo
            this.speed_x = -this.playerSpeed;
        }
        // pomicanje po x osi udesno za d i desnu strelicu
        if (asteroidsGame.keys[39] || asteroidsGame.keys[68]) {
            // brzina po x osi je playerSpeed, tj. igrač se kreće u desno
            this.speed_x = this.playerSpeed;
        }
        // pomicanje po y osi prema gore za w i strelicu gore
        if (asteroidsGame.keys[38] || asteroidsGame.keys[87]) {
            // brzina po y osi je -playerSpeed, tj. igrač se kreće prema gore
            this.speed_y = -this.playerSpeed;
        }
        // pomicanje po y osi prema dolje za s i strelicu dolje
        if (asteroidsGame.keys[40] || asteroidsGame.keys[83]) {
            // brzina po y osi je playerSpeed, tj. igrač se kreće prema dolje
            this.speed_y = this.playerSpeed;
        }
        // u sljedećim ifovima detektiram trebam li brzinu po x ili y osi postaviti na 0
        // ako niti jedan od tipki lijeve i desne strelice te a i d nisu pritisnute, brzina po x osi je 0, logično
        if (!asteroidsGame.keys[37] && !asteroidsGame.keys[39] && !asteroidsGame.keys[65] && !asteroidsGame.keys[68]) {
            this.speed_x = 0;
        }
        // ako niti jedan od tipki gornje i donje strelice te w i s nisu pritisnute, brzina po y osi je 0
        if (!asteroidsGame.keys[38] && !asteroidsGame.keys[40] && !asteroidsGame.keys[87] && !asteroidsGame.keys[83]) {
            this.speed_y = 0;
        }
        // provjera je li igrač na rubu canvasa za pojeidne osi
        // ako je, ne dozvoljavam mu da ode preko pojedinog ruba canvasa, ako nije, dozvoljavam mu da se kreće
        // logika iza uvjeta -> ako je njegov x položaj + brzina po x osi veći od 0 i manji od širine canvasa - širine igrača, dozvoljavam mu da se kreće po x osi
        // polovice player width i player height su u uvjetu jer inače polovica igrača može izaći izvan canvasa
        if (this.x + this.speed_x > this.size / 2 && this.x + this.speed_x < asteroidsGame.canvas.width - this.size / 2) {
            this.x += this.speed_x;
        }
        // ako je njegov y položaj + brzina po y osi veći od 0 i manji od visine canvasa - visine igrača, dozvoljavam mu da se kreće po y osi
        if (this.y + this.speed_y > this.size / 2 && this.y + this.speed_y < asteroidsGame.canvas.height - this.size / 2) {
            this.y += this.speed_y;
        }

    }
}

// po uzoru na predavanje radim komponente za zvijezde u pozadini, razdvojio sam u posebnu funkciju od drugih objekata na canvasu
function starComponent(size, x, y) {
    //definiram elemente za zvijezdu, dimenzije, boju, poziciju
    this.size = size;
    // boja je bijela,kako je zadano u zadatku, s opacity 0.2, tako mi ljepše izgleda
    this.color = "rgba(255, 255, 255, 0.2)";
    this.x = x;
    this.y = y;
    // funkcija za update položaja zvijezde u nekom trenutku
    this.update = function () {
        // update sličan kao i kod igrača
        ctx = asteroidsGame.context;
        //bojam pravokutnik
        ctx.fillStyle = this.color;
        // iscrtavam pravokutnik na poziciji x, y, širine i visine
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    // funkcija za postavljanje nove pozicije, računa se na način da se y koordinata povećava za 0.35, tj. da se zvijezde spuštaju prema dolje
    this.newPos = function () {
        // ako zvijezda dođe do dna canvasa, vraćam ju na vrh na random x poziciju kako se nebo nebi ponavljalo
        if (this.y + this.size > asteroidsGame.canvas.height) {
            this.y = 0;
            this.x = Math.floor(Math.random() * asteroidsGame.canvas.width);
        } else {
            // inače se nastavlja kretati konstantnom brzinom prema dolje prema donjem rubu canvasa
            this.y += 0.15;
        }
    }
}

// funkcija za asteroid, analogno kao i za igrača i zvijezde
function asteroidComponent() {
    // definiram varijable za asteroid, dimenzije, boja, pozicija, brzina
    // ovi su elementi random, kako je zadano u specifikaciji zadatka, a konkretne implementacije funkcija su u utils.js jer mi je tako bilo preglednije raditi
    this.size = getRandomAsteroidSize();
    this.color = getRandomAsteroidColor();
    var {x, y, speed_x, speed_y} = getAsteroidDirectionAndSpeed();
    this.x = x;
    this.y = y;
    this.speed_x = speed_x;
    this.speed_y = speed_y;
    // ove će mi vrijednosti koristiti za ubrzavanje asteroida kako igrač duže igra
    this.speed_x2 = this.speed_y2 = 0;
    // funkcija za update asteroida
    // funkcija se poziva kod svakog refresha canvasa i osvježava poziciju asteroida
    this.update = function () {
        // dohvaćam kontekst canvasa
        ctx = asteroidsGame.context;
        ctx.save();
        // translatiram kontekst canvasa na poziciju asteroida
        ctx.translate(this.x, this.y);
        // rotiram kontekst canvasa za kut rotacije asteroida
        // crtam asteroid kao pravokutnik
        ctx.fillStyle = this.color;
        // dodajem 3D sjenu kako je zadano u zadatku
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        // popunjavam pravokutnik bojom, stavljam x koordinatu, y koordinatu, širinu i visinu, dijeljenje s negativnom polovicom dimenzije je u uvjetu iz istog razloga kao i kod igrača
        ctx.fillRect(this.size / -2, this.size / -2, this.size, this.size);
        ctx.restore();
    }
    // funkcija za postavljanje nove pozicije asteroida
    this.newPos = function () {
        // pomicanje asteroida po x i y osi, i za brzine 1 i 2 
        this.x += this.speed_x + this.speed_x2;
        this.y += this.speed_y + this.speed_y2;
        // ako asteroid izađe izvan canvasa i 200px sa svake strane, vraćam ga na random poziciju i generiram mu novi smjer kretanja
        // ovo mi je potrebno jer se asteroidi stvaraju izvan rubova canvasa pa da nemam toleranciju od 201px, tek stvoreni asteroidi bi se odmah vratili na random poziciju i opet bi se stvorili izvan canvasa i tako u krug
        if (this.x < -this.size - 100 || this.y < -this.size - 100 || this.x > asteroidsGame.canvas.width + this.size + 100 || this.y > asteroidsGame.canvas.height + this.size + 100) {
            // generiram random smjer kretanja asteroida, kao kod incijalizacije
            var {x, y, speed_x, speed_y} = getAsteroidDirectionAndSpeed();
            this.x = x;
            this.y = y;
            this.speed_x = speed_x;
            this.speed_y = speed_y;
            // svi parametri kretnje asteroida se opet randomiziraju ako izađe iz granica, boja i dimenzije ostaju iste, a ubrzanje povećavam za 0.075 što znači da svaki put kad asteroid izađe izvan canvasa, ubrzava se sljedeći put kad se pojavi
            this.speed_x2 += 0.035;
            this.speed_y2 += 0.035;
        }
    }
}


// funkcija za provjeru kolizije, izvršava se kod svakog refresha canvasa za svaki asteroid
function checkCollision() {
    // za svaki asteroid
    for (let i = 0; i < asteroids.length ; ++i){
        // ako je udaljenost između središta asteroida i igrača manja od polovice zbroja njihovih dimenzija, znači da se preklapaju
        // to je pitagorin poučak, udaljenost između dvije točke je kvadratni korijen zbroja kvadrata razlike njihovih koordinata
        if (Math.sqrt(Math.pow(asteroids[i].x - playerPiece.x, 2) + Math.pow(asteroids[i].y - playerPiece.y, 2)) < (asteroids[i].size + playerPiece.size) / 2) {
            // ako se preklapaju, vraćam true
            return true;
        }
    }
    // ako nema preklapanja, vrati false
    return false;
}

// funkcija za prikaz vremena u gornjem desnom kutu
function displayTime() {
    // varijabla vremena koje je igrač ostvario u ovoj rundi, u formatu milisekundi
    const currentTime = new Date() - startTime;
    // dijelim cjelobrojno s 60000 da dobijem minute, ostatak dijelim s 1000 da dobijem sekunde i to s 3 decimalna mjesta kako je zadano u zadatku
    const minutes = Math.floor(currentTime / 60000);
    const seconds = ((currentTime % 60000) / 1000).toFixed(3);
    // formatiram vrijeme u format mm:ss.sss
    const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
    // analogno za najbolje vrijeme
    const bestTimeMinutes = Math.floor(bestTime / 60000);
    const bestTimeSeconds = ((bestTime % 60000) / 1000).toFixed(3);
    const formattedBestTime = `${bestTimeMinutes < 10 ? "0" : ""}${bestTimeMinutes}:${(bestTimeSeconds < 10 ? "0" : "")}${bestTimeSeconds}`;
    // dohvaćam kontekst canvasa
    ctx = asteroidsGame.context;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    // ako je igra počela, ispisujem na canvas vrijeme, inače ispisujem 00:00.000
    if (started) {
        ctx.fillText(`Vrijeme: ${formattedTime}`, asteroidsGame.canvas.width - ctx.measureText("Vrijeme : 00:00.000").width, 30);
    }
    else {
        ctx.fillText(`Vrijeme: 00:00.000`, asteroidsGame.canvas.width - ctx.measureText("Vrijeme : 00:00.000").width, 30);
    }
    // najbolje vrijeme ispisujem u svakom slučaju
    ctx.fillText(`Najbolje vrijeme: ${formattedBestTime}`, asteroidsGame.canvas.width - ctx.measureText("Najbolje vrijeme : 00:00.000").width, 60);
}


// vrijeme učitavanja stranice
var loadTime = new Date();
//ova funkcija za update canvasa se poziva svakih 5 milisekundi
function updateGameArea() {
    // ona cleara canvas, updatea pozicije svih elemenata i iscrtava ih
    asteroidsGame.clear();
    // priv elementi koje updatea i crta su zvijezde
    for (var i = 0; i < stars.length; i++) {
        // računa novu poziciju za svaku zvijezdu te ju onda updatea i iscrtava
        // funkcija za novu poziciju je newPos, a funkcija za update je update
        stars[i].newPos();
        stars[i].update();
    }
    // analogno za igrača
    playerPiece.newPos();
    playerPiece.update();
    // analogno za asteroide
    for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].newPos();
        asteroids[i].update();
    }
    // ako igra još nije počela, ispisujem poruku i odbrojavam do početka
    if (!started) {
        // uzimam kontekst canvasa
        ctx = asteroidsGame.context;
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        // ispisujem poruku, odbrojavanje je realizirano tako da se oduzme trenutno vrijeme od vremena učitavanja stranice i onda se to podijeli s 1000 da dobijem sekunde
        var printString = "Igra počinje za " + (3 - Math.floor((new Date() - loadTime) / 1000)) + "...";
        // ispis teksta na sredini canvasa
        ctx.fillText(printString, asteroidsGame.canvas.width / 2 - ctx.measureText(printString).width / 2 , asteroidsGame.canvas.height / 2);
    }
    // provjeravam je li igrač udario u asteroid, kako je specificirano u zadatku, to se obavlja kod svakog updatea canvasa
    if (checkCollision()) {
        // ako je, ispisujem poruku i zaustavljam igru
        asteroidsGame.stop();
        // dohvaćam kontekst canvasa za ispis poruke
        ctx = asteroidsGame.context;
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        // ispisujem poruku o kraju igre na sredini canvasa
        ctx.fillText("Igra gotova!", asteroidsGame.canvas.width / 2 - ctx.measureText("Igra gotova!").width/2, asteroidsGame.canvas.height / 2);
        // računam vrijeme koje je igrač ostvario u ovoj rundi, u formatu milisekundi
        const currentTime = new Date() - startTime;
        // ako je to vrijeme bolje od najboljeg vremena koje je zapisano u localStorage, postavljam najbolje vrijeme na to vrijeme
        if (currentTime > new Date(bestTime)) {
            // pristupam localStorageu putem HTML5 Web Storage API-a
            localStorage.setItem('bestTime', currentTime);
        }
        // kreiram button za resetiranje igre koji će reloadati stranicu i stavljam ga na sredinu ekrana
        var button = document.createElement("button");
        button.innerHTML = "Resetiraj igru!";
        button.style.position = "absolute";
        var buttonWidth = ctx.measureText("Resetiraj igru").width * 1;
        var buttonHeight = 40;
        button.style.width = buttonWidth + "px";
        button.style.height = buttonHeight + "px";
        // pozicioniranje na sredinu ekrana
        button.style.left = window.innerWidth / 2 - buttonWidth / 2 + "px";
        button.style.top = window.innerHeight / 2 + buttonHeight / 2 + "px";
        button.style.backgroundColor = "white";
        button.style.color = "black";
        button.style.borderRadius = "5px";
        button.style.fontFamily = "Arial";
        button.style.fontSize = "15px";
        button.style.cursor = "pointer";
        // dodajem event listener za klik na button, kad se klikne, reloada se stranica
        button.onclick = function() {
            location.reload();
        };
        // dodajem button u body
        document.body.appendChild(button);
    }
    // zovem funkciju za prikaz vremena u svakom updateu canvasa
    displayTime();
}

// funkcija za pokretanje igre
// pokreće se onload body elementa u HTML dokumentu
// funkcija za pokretanje igre
async function startGame() {
    // pokrećem igru, tj. kreiram canvas i tu se onda definiraju i event listeneri i context i sl.
    asteroidsGame.start();
    // kreiram zvijezde u pozadini, 1000 komada
    for (var i = 0; i < 1000; i++) {
        //pozicije zviježda su random, širina i visina su 3px, to mi je najbolje izgledalo
        // random pozicije kako je zadano za sve elemente
        stars.push(new starComponent(starSize, Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight)));
    }
    // kreiram igrača, pozicioniram ga na sredinu canvasa kako je zadano
    // dajem mu veličinu, boju, poziciju i brzinu, pozicijama oduzimam polovicu veličine igrača kako bih ga centrirao jer je referentna točk u gornjem lijevom kutu
    playerPiece = new playerComponent(playerSize, "red", asteroidsGame.canvas.width / 2 - playerSize / 2, asteroidsGame.canvas.height / 2 - playerSize / 2, playerSpeed);

    // odbrojavanje do početka igre, želim da baš odmah kod učitavanja stranice krenu letiti asteroidi, neka igrač ima 3 sekunde da se pripremi
    setTimeout(function() {
        ctx.clearRect(0, 0, asteroidsGame.canvas.width, asteroidsGame.canvas.height);
        // kreiram asteroide, 10 komada inicijalno
        for (var i = 0; i < 10; i++) {
            // dodajem ih u polje asteroida
            asteroids.push(new asteroidComponent());
        }
        // započinjemo mjerenje vremena
        started = true;
        // definiram vrijeme početka igre koje mi služi za mjerenje vremena
        startTime = new Date();
    }, 3000);
    // postavljenjem ovog intervala dodajem novi asteroid svakih 15 sekundi
    setInterval(function() {
        // opet dodajem novi asteroid u polje asteroida
        asteroids.push(new asteroidComponent());
    }, 15000);
}




