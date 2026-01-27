/**
 * rendszer-valtas.hu - Javított Visszaszámláló és Videóváltó
 */

// Cél dátum: 2026. április 12. 00:00:00
const targetDate = new Date(2026, 3, 12, 0, 0, 0).getTime();

/**
 * Frissíti az értékeket és kezeli a villanást
 */
function updateValue(id, newValue, isCritical) {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.innerText !== newValue) {
        el.innerText = newValue;
        
        // Alap villanás minden váltásnál
        el.classList.remove('flash');
        void el.offsetWidth; // Reflow
        el.classList.add('flash');
    }

    // Piros villogás az utolsó 10 másodpercben
    if (isCritical) {
        el.classList.add('critical-flash');
    } else {
        el.classList.remove('critical-flash');
    }
}

/**
 * Visszaszámláló logika
 */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        const container = document.getElementById("countdown");
        if (container) {
            container.innerHTML = "<div class='value' style='width:100%; color: #ff0000;'>A VÁLTOZÁS ELKEZDŐDÖTT</div>";
        }
        return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Kritikus fázis: utolsó 10 másodperc (ha nincs már hátra nap, óra, perc)
    const isCritical = (d === 0 && h === 0 && m === 0 && s <= 10);

    updateValue("days", String(d).padStart(2, '0'), isCritical);
    updateValue("hours", String(h).padStart(2, '0'), isCritical);
    updateValue("minutes", String(m).padStart(2, '0'), isCritical);
    updateValue("seconds", String(s).padStart(2, '0'), isCritical);
}

/**
 * Videó váltás javított logikája
 */
function showVideo(type) {
    // 1. Összes videó elrejtése és megállítása
    document.querySelectorAll('.video-wrapper').forEach(v => {
        v.classList.remove('active');
        const iframe = v.querySelector('iframe');
        if (iframe) {
            const src = iframe.getAttribute('src');
            iframe.setAttribute('src', ''); // Stop
            iframe.setAttribute('src', src); // Reset
        }
    });

    // 2. Összes gomb inaktívvá tétele
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
    });

    // 3. A kiválasztott videó megjelenítése
    const targetVideo = document.getElementById('video-' + type);
    if (targetVideo) {
        targetVideo.classList.add('active');
    }

    // 4. A megfelelő gomb aktiválása (keressük az onclick tartalma alapján)
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(type)) {
            btn.classList.add('active');
        }
    });
}

// Indítás
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
