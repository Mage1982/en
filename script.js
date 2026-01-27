/**
 * rendszer-valtas.hu - Javított Visszaszámláló Logika
 */

// Cél dátum: 2026. április 12. 00:00:00
// Megjegyzés: A hónapok 0-tól indexeltek (0: Jan, 1: Feb, 2: Marc, 3: Ápr)
const targetDate = new Date(2026, 3, 12, 0, 0, 0).getTime();

/**
 * Frissíti az adott HTML elem értékét és kezeli az animációkat
 */
function updateValue(id, newValue, isCritical) {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.innerText !== newValue) {
        el.innerText = newValue;
        
        // Alap villanás minden váltásnál
        el.classList.remove('flash');
        void el.offsetWidth; 
        el.classList.add('flash');
    }

    // Piros villogás (critical) osztály kezelése
    if (isCritical) {
        el.classList.add('critical-flash');
    } else {
        el.classList.remove('critical-flash');
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
            container.innerHTML = "<div class='value' style='width:100%; font-size: clamp(20px, 5vw, 40px); color: #ff0000;'>A VÁLTOZÁS ELKEZDŐDÖTT</div>";
        }
        return;
    }

    // Időegységek kiszámítása
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Kritikus állapot: kevesebb mint 11 másodperc van hátra (10, 9, 8...)
    // Csak akkor aktiváljuk, ha már az utolsó percben/órában/napban vagyunk
    const isCritical = (distance <= 10000); 

    // Értékek beírása
    updateValue("days", String(d).padStart(2, '0'), isCritical);
    updateValue("hours", String(h).padStart(2, '0'), isCritical);
    updateValue("minutes", String(m).padStart(2, '0'), isCritical);
    updateValue("seconds", String(s).padStart(2, '0'), isCritical);
}

// Inicializálás és indítás
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
