* rendszer-valtas.hu - Visszaszámláló Logika

 */



// Cél dátum: 2026. április 12. 00:00:00

const targetDate = new Date(2026, 3, 12, 0, 0, 0).getTime();



/**

 * Frissíti az adott HTML elem értékét és elindítja a villanó animációt

 */

function updateValue(id, newValue) {

    const el = document.getElementById(id);

    if (!el) return;



    if (el.innerText !== newValue) {

        el.innerText = newValue;

        

        // Animáció újraindítása (flash osztály le- és felvétele)

        el.classList.remove('flash');

        void el.offsetWidth; // Reflow kényszerítése az animációhoz

        el.classList.add('flash');

    }

}



/**

 * Kiszámolja a hátralévő időt és frissíti a kijelzőt

 */

function updateCountdown() {

    const now = new Date().getTime();

    const distance = targetDate - now;



    // Ha lejárt az idő

    if (distance < 0) {

        const container = document.getElementById("countdown");

        if (container) {

            container.innerHTML = "<div class='value' style='width:100%; font-size: clamp(20px, 5vw, 40px);'>A VÁLTOZÁS ELKEZDŐDÖTT</div>";

        }

        const footerText = document.querySelector(".countdown-footer-text");

        if (footerText) footerText.style.display = "none";

        return;

    }



    // Időegységek kiszámítása

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));

    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const s = Math.floor((distance % (1000 * 60)) / 1000);



    // Értékek beírása (vezető nullával)

    updateValue("days", String(d).padStart(2, '0'));

    updateValue("hours", String(h).padStart(2, '0'));

    updateValue("minutes", String(m).padStart(2, '0'));

    updateValue("seconds", String(s).padStart(2, '0'));

}



/**

 * Videó váltás kezelése a gombokhoz

 */

function showVideo(type) {

    // Minden videó elrejtése

    document.querySelectorAll('.video-wrapper').forEach(v => {

        v.classList.remove('active');

        // Megállítjuk a videót, ha elváltanak (opcionális, de ajánlott)

        const iframe = v.querySelector('iframe');

        if (iframe) {

            const src = iframe.getAttribute('src');

            iframe.setAttribute('src', '');

            iframe.setAttribute('src', src);

        }

    });



    // Minden gomb inaktívvá tétele

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    

    // Kiválasztott videó és gomb aktiválása

    const targetVideo = document.getElementById('video-' + type);

    if (targetVideo) targetVideo.classList.add('active');



    // Aktuális gomb megkeresése (az onclick attribútum alapján)

    const buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(btn => {

        if (btn.getAttribute('onclick').includes(type)) {

            btn.classList.add('active');

        }

    });

}



// Inicializálás

document.addEventListener('DOMContentLoaded', () => {

    // Azonnali frissítés, hogy ne 00-ról induljon

    updateCountdown();

    // Másodpercenkénti frissítés

    setInterval(updateCountdown, 1000);

});

https://rendszer-valtas.hu/
Egyéni gem
Szia! Látom a kódot, profi a void el.offsetWidth használata a reflow-hoz! Ahhoz, hogy a kért piros villanás megvalósuljon az utolsó 10 másodpercben, két helyen kell módosítanod: a updateCountdown függvényben a logikát, és a CSS-ben az animációt.

Itt vannak a pontos módosítások:

1. JavaScript módosítása
Az updateCountdown függvény végén, miután kiszámoltad a másodperceket (s), vizsgálnod kell, hogy a hátralévő idő kritikus-e.

Keresd meg az updateCountdown függvény végét, és cseréld le az értékek beírását erre:

JavaScript
    // Értékek beírása (vezető nullával)
    updateValue("days", String(d).padStart(2, '0'));
    updateValue("hours", String(h).padStart(2, '0'));
    updateValue("minutes", String(m).padStart(2, '0'));
    updateValue("seconds", String(s).padStart(2, '0'));

    // ÚJ RÉSZ: Piros villogás kezelése az utolsó 10 másodpercben
    const countdownContainer = document.getElementById("countdown");
    if (countdownContainer) {
        // Ha kevesebb mint 1 nap, 0 óra, 0 perc ÉS 11 másodperc van hátra
        if (d === 0 && h === 0 && m === 0 && s < 11) {
            countdownContainer.classList.add("critical-state");
        } else {
            countdownContainer.classList.remove("critical-state");
        }
    }
