/**
 * rendszer-valtas.hu - Teljes Visszaszámláló és Videó Logika
 */

// Cél dátum: 2026. április 12. 00:00:00
const targetDate = new Date(2026, 3, 12, 0, 0, 0).getTime();

/**
 * Frissíti az időértékeket és kezeli a vizuális effekteket
 */
function updateValue(id, newValue, isCritical) {
    const el = document.getElementById(id);
    if (!el) return;

    // Csak akkor frissítünk, ha az érték valóban változott
    if (el.innerText !== newValue) {
        el.innerText = newValue;
        
        // Alap villanás effekt minden másodpercváltásnál
        el.classList.remove('flash');
        void el.offsetWidth; // Reflow kényszerítése
        el.classList.add('flash');
    }

    // Piros "vészhelyzet" effekt kezelése (utolsó 10 mp)
    if (isCritical) {
        el.classList.add('critical-flash');
    } else {
        el.classList.remove('critical-flash');
    }
}

/**
 * A visszaszámláló fő logikája
 */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // LEJÁRT AZ IDŐ - Rendszerváltás kezdete
    if (distance < 0) {
        const container = document.getElementById("countdown");
        if (container) {
            // Itt használjuk a trikolor-text osztályt a győzelmi felirathoz
            container.innerHTML = "<div class='value tricolor-text' style='width:100%; font-size: clamp(25px, 7vw, 70px); text-align: center;'>A VÁLTOZÁS ELKEZDŐDÖTT</div>";
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

    // KRITIKUS SZAKASZ: Utolsó 10 másodperc (ha minden más 0)
    const isCritical = (d === 0 && h === 0 && m === 0 && s <= 10);

    // Értékek frissítése vezető nullával
    updateValue("days", String(d).padStart(2, '0'), isCritical);
    updateValue("hours", String(h).padStart(2, '0'), isCritical);
    updateValue("minutes", String(m).padStart(2, '0'), isCritical);
    updateValue("seconds", String(s).padStart(2, '0'), isCritical);

    // Kettőspontok piros villogása kritikus fázisban
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
 * Videó vált
