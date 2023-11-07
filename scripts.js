const playerWidth = 40;
const playerHeight = 40;

// definicija varijabli za pojedine elemente
// varijabla za igrača
var playerPiece;
// polje varijabli za zvijezde u pozadini
var stars = [];
// polje varijabli za asteroide
var asteroids = [];

// varijabla igre, tu ću pohraniti informacije o canvasu
// po uzoru na engine s predavanja
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
        this.frameNo = 0;
        // postavljam interval na 5 milisekundi za update canvasa
        this.interval = setInterval(updateGameArea, 5);
        // dodajemo event listenere za tipke
        // oni su bitni za kretanje igrača, kad ih nebi bilo pritisak na tipku nebi imao nikakav efekt
        // keys polje bilježi koje su tipke pritisnute, a koje nisu, na taj način se igrač može kretati i dijagonalno ako drži dvije tipke
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
        // brišem interval i tako zaustavljam igru
        clearInterval(this.interval);
    },
    clear: function () {
        // brišem canvas funkcijom clearRect, kako je opisano u prezentaciji
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// opet po uzoru na engine s predavanja, definiram komponente za pojedini element igre

// ovo je komponenta samog igrača, preiuzeto s predavanja
function playerComponent(width, height, color, x, y, type) {
    // definiram varijable za komponentu, tip, dimenzije, boja, pozicija, brzina
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = 0;
    this.speed_y = 0;
    this.x = x;
    this.y = y;
    // funkcija za update komponente
    // funkcija se poziva kod svakog refresha canvasa i osvježava poziciju komponente igrača
    this.update = function () {
        // dohvaćam kontekst canvasa
        ctx = asteroidsGame.context;
        ctx.save();
        // translatiram kontekst na poziciju igrača, ona se mijenja s newpos funkcijom
        ctx.translate(this.x, this.y);
        ctx.fillStyle = color;
        // popunjavam pravookutnik bojom, stavljam x koordinatu, y koordinatu, širinu i visinu
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    // funkcija za postavljanje nove pozicije
    // u odnosu na predavanje, dodao sam movement po x i y osi s tipkama strelica
    // dodao sam i wasd tipke za kretanje jer mi se prolila kava po tipkovnici, ne radi mi lijeva strelica pa moram tako testirati :)
    this.newPos = function () {
        // na brzini 2 je igra dosta responzivna, to mi se sviđa pa sam ostavio tako
        // za tipke sam koristio brojeve tipki, 37 za lijevo, 38 za gore, 39 za desno i 40 za dolje
        // w, a, s, d su 87, 65, 83, 68
        // negativne su vrijednosti za lijevo i gore, pozitivne za desno i dolje jer je koordinatni sustav u canvasu takav da je 0,0 u gornjem lijevom kutu
        // povećavanjem brojeva idem dolje i desno, smanjivanjem lijevo i gore
        asteroidsGame.keys = asteroidsGame.keys || {}; 
        // pomicanje po x osi ulijevo za a i lijevu strelicu, gore sam opisao zašto je -2
        if (asteroidsGame.keys[37] || asteroidsGame.keys[65]) {
            this.speed_x = -2;
        }
        // pomicanje po x osi udesno za d i desnu strelicu
        if (asteroidsGame.keys[39] || asteroidsGame.keys[68]) {
            this.speed_x = 2;
        }
        // pomicanje po y osi prema gore za w i strelicu gore
        if (asteroidsGame.keys[38] || asteroidsGame.keys[87]) {
            this.speed_y = -2;
        }
        // pomicanje po y osi prema dolje za s i strelicu dolje
        if (asteroidsGame.keys[40] || asteroidsGame.keys[83]) {
            this.speed_y = 2;
        }
        // ako niti jedan od tipki lijeve i desne strelice te a i d nisu pritisnute, brzina po x osi je 0, logično
        if (!asteroidsGame.keys[37] && !asteroidsGame.keys[39] && !asteroidsGame.keys[65] && !asteroidsGame.keys[68]) {
            this.speed_x = 0;
        }
        // ako niti jedan od tipki gornje i donje strelice te w i s nisu pritisnute, brzina po y osi je 0
        if (!asteroidsGame.keys[38] && !asteroidsGame.keys[40] && !asteroidsGame.keys[87] && !asteroidsGame.keys[83]) {
            this.speed_y = 0;
        }
        // provjera je li igrač na rubu canvasa
        // ako je, ne dozvoljavam mu da ode preko pojedinog ruba canvasa
        // ako nije, dozvoljavam mu da se kreće
        // logika iza uvjeta -> ako je njegov x položaj + brzina po x osi veći od 0 i manji od širine canvasa - širine igrača, dozvoljavam mu da se kreće po x osi
        // polovice player width i player height su u uvjetu jer inače mu polovica igrača može izaći izvan canvasa
        if (this.x + this.speed_x > this.width / 2 && this.x + this.speed_x < asteroidsGame.canvas.width - this.width / 2) {
            this.x += this.speed_x;
        }
        // ako je njegov y položaj + brzina po y osi veći od 0 i manji od visine canvasa - visine igrača, dozvoljavam mu da se kreće po y osi
        if (this.y + this.speed_y > this.height / 2 && this.y + this.speed_y < asteroidsGame.canvas.height - this.height / 2) {
            this.y += this.speed_y;
        }

    }
}

// po uzoru na predavanje radim komponente za zvijezde u pozadini, razdvojio sam u posebnu funkciju
function starComponent(width, height, x, y) {
    //definiram elemente za zvijezdu, dimenzije, boju, poziciju
    this.width = width;
    this.height = height;
    // boja je bijela s poluprozirnošću 0.2, tako mi ljepše izgleda
    this.color = "rgba(255, 255, 255, 0.2)";
    this.x = x;
    this.y = y;
    this.update = function () {
        // update sličan kao i kod igrača
        ctx = asteroidsGame.context;
        //bojam pravokutnik
        ctx.fillStyle = this.color;
        // iscrtavam pravokutnik na poziciji x, y, širine i visine
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    // funkcija za postavljanje nove pozicije, računa se na način da se y koordinata povećava za 0.5, tj. da se zvijezde spuštaju prema dolje
    this.newPos = function () {
        // ako zvijrzda dođe do dna canvasa, vraćam ju na vrh
        if (this.y + this.height > asteroidsGame.canvas.height) {
            this.y = 0;
        } else {
            // inače se nastavlja kretati konstantnom brzinom prema dolje
            this.y += 0.35;
        }
    }
}


//ova funkcija za update canvasa se poziva svakih 5 milisekundi
function updateGameArea() {
    // ona cleara canvas, updatea pozicije svih elemenata i iscrtava ih
    asteroidsGame.clear();
    // priv elementi koje updatea i crta su zvijezde
    for (var i = 0; i < stars.length; i++) {
        // računa novu poziciju za svaku zvijezdu te ju onda updatea i iscrtava
        stars[i].newPos();
        stars[i].update();
    }
    // analogno za igrača
    playerPiece.newPos();
    playerPiece.update();
}

// funkcija za pokretanje igre
// pokreće se onload body elementa u HTML dokumentu
function startGame() {
    // kreiram zvijezde u pozadini, 1500 komada
    for (var i = 0; i < 1500; i++) {
        //pozicije zviježda su random, širina i visina su 3px, to mi je najbolje izgledalo
        // random pozicije kako je zadano i onda se u tom patternu zvijezde ponavljaju kad izađu iz canvasa
        stars.push(new starComponent(3, 3, Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight)));
    }
    // pokrećem igru, tj. kreiram canvas i tu se onda definiraju i event listeneri i context i sl.
    asteroidsGame.start();
    // kreiram igrača, pozicioniram ga na sredinu canvasa kako je zadano
    playerPiece = new playerComponent(playerWidth, playerHeight, "red", asteroidsGame.canvas.width / 2 - playerWidth, asteroidsGame.canvas.height / 2 - playerHeight, "player");
}