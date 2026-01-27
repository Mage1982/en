/**
 * rendszer-valtas.hu - Teljes Visszaszámláló és Videó Logika
 * Cél: Stabil videóváltás és drámai piros effekt az utolsó 10 mp-ben.
 */

// Cél dátum: 2026. április 12. 00:00:00
const targetDate = new Date(2026, 3, 12, 0, 0, 0).getTime();

/**
 * Frissíti az adott HTML elem értékét és kezeli az effekteket
 * @param {string} id - Az elem ID-ja (days, hours, minutes, seconds)
 * @param {string} newValue - Az új kijelzendő érték
 * @param {boolean} isCritical - Aktív-e az utolsó 10 másodperc effekt
 */
function updateValue(id, newValue, isCritical) {
    const el = document.getElementById(id);
    if (!el) return;

    // Csak akkor frissítünk és villantunk, ha változott az érték
    if (el.innerText !== newValue) {
        el.innerText = newValue;
        
        // Alap fehér villanás minden másodpercváltásnál
        el.classList.remove('flash');
        void el.offsetWidth; // Reflow kényszerítése az animáció újraindításához
        el.classList.add('flash');
    }

    // Piros "vészhelyzeti" effekt hozzáadása/levétele
    if (isCritical) {
        el.classList.add('critical-flash');
    } else {
        el.classList.remove('critical-flash');
    }
}

/**
 * Kiszámolja a hátralévő időt és frissíti a teljes kezelőfelületet
 */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Ha lejárt az idő (vagy a cél dátum után vagyunk)
    if (distance < 0) {
        const container = document.getElementById("countdown");
        if (container) {
            container.innerHTML = "<div class='value' style='width:100%; color: #ff0000; text-align: center; font-size: clamp(30px, 8vw, 80px);'>A VÁLTOZÁS ELKEZDŐDÖTT</div>";
        }
        // A lábléc szöveg elrejtése lejáratkor
        const footerText = document.querySelector(".countdown-footer-text");
        if (footerText) footerText.style.display = "none";
        return;
    }

    // Időegységek kiszámítása
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // KRITIKUS ÁLLAPOT: Utolsó 10 másodperc (ha már nincs nap, óra, perc hátra)
    const isCritical = (d === 0 && h === 0 && m === 0 && s <= 10);

    // Értékek beírása (vezető nullával)
    updateValue("days", String(d).padStart(2, '0'), isCritical);
    updateValue("hours", String(h).padStart(2, '0'), isCritical);
    updateValue("minutes", String(m).padStart(2, '0'), isCritical);
    updateValue("seconds", String(s).padStart(2, '0'), isCritical);

    // Kettőspontok (separators) kezelése a piros effekthez
    const separators = document.querySelectorAll('.separator');
    separators.forEach(sep => {
        if (isCritical) {
            sep.classList.add('critical-separator');
        } else {
            sep.classList.remove('critical-separator');
        }
    });
}

/**
 * Videó váltás kezelése (Gombok és YouTube iFrame-ek)
 */
function showVideo(type) {
    // 1. Minden videó megállítása és elrejtése
    document.querySelectorAll('.video-wrapper').forEach(v => {
        v.classList.remove('active');
        // iFrame megállítása (src frissítéssel, hogy ne szóljon a háttérben)
        const iframe = v.querySelector('iframe');
        if (iframe) {
            const src = iframe.getAttribute('src');
            iframe.setAttribute('src', ''); 
            iframe.setAttribute('src', src);
        }
    });

    // 2. Minden gomb inaktívvá tétele
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
    });

    // 3. Kiválasztott videó aktiválása
    const targetVideo = document.getElementById('video-' + type);
    if (targetVideo) {
        targetVideo.classList.add('active');
    }

    // 4. A megfelelő gomb megkeresése és aktiválása (onclick alapján)
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        const onClickAttr = btn.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(type)) {
            btn.classList.add('active');
        }
    });
}

/**
 * Inicializálás az oldal betöltésekor
 */
document.addEventListener('DOMContentLoaded', () => {
    // Első futtatás azonnal
    updateCountdown();
    // Ismétlés másodpercenként
    setInterval(updateCountdown, 1000);
});
