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
