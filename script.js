let fields = [
    null,   // Feld 0 → O
    null,   // Feld 1 → O
    null,   // Feld 2 → O
    null,       // Feld 3 → leer
    null,    // Feld 4 → X
    null,       // Feld 5 → leer
    null,    // Feld 6 → X
    null,       // Feld 7 → leer
    null        // Feld 8 → leer
];

const winningCombinations = [
    [0, 1, 2], // oben
    [3, 4, 5], // mitte
    [6, 7, 8], // unten
    [0, 3, 6], // links
    [1, 4, 7], // mitte
    [2, 5, 8], // rechts
    [0, 4, 8], // diagonal links oben nach rechts unten
    [2, 4, 6]  // diagonal rechts oben nach links unten
];

// Wer ist dran? Startspieler ist 'circle'
let currentPlayer = 'circle';

function init() {
    render();
    updatePlayerIndicator();
}

function render() {
    let tableHTML = '<table>';

    for (let i = 0; i < 9; i++) {
        if (i % 3 === 0) {
            tableHTML += '<tr>';
        }

        let symbol = '';
        let className = '';

        if (fields[i] === 'circle') {
            symbol = generateAnimatedCircleSVG();
            className = 'circle';
        } else if (fields[i] === 'cross') {
            symbol = generateAnimatedCrossSVG();
            className = 'cross';
        }

        // Wenn Feld leer ist, füge onclick hinzu
        let onclick = '';
        if (fields[i] === null) {
            onclick = `onclick="handleClick(${i}, this)"`;
        }

        tableHTML += `<td class="${className}" ${onclick}>${symbol}</td>`;

        if (i % 3 === 2) {
            tableHTML += '</tr>';
        }
    }

    tableHTML += '</table>';
    document.getElementById('content').innerHTML = tableHTML;
}


function handleClick(index, element) {
    // Nur wenn Feld leer ist (Sicherheitsabfrage)
    if (fields[index] === null) {
        // Im Array speichern
        fields[index] = currentPlayer;

        // HTML-Symbol einfügen
        if (currentPlayer === 'circle') {
            element.innerHTML = generateAnimatedCircleSVG();
            element.classList.add('circle');
        } else {
            element.innerHTML = generateAnimatedCrossSVG();
            element.classList.add('cross');
        }

        // onclick entfernen, damit das Feld nicht mehr klickbar ist
        element.onclick = null;

        // Spieler wechseln
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
    checkWinner();
    updatePlayerIndicator();
}

function checkWinner() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Sieger gefunden
            drawWinningLine(combo);
            disableAllClicks();
            return;
        }
    }
}







function drawWinningLine(combo) {
    const positions = {
        0: [0, 0], 1: [1, 0], 2: [2, 0],
        3: [0, 1], 4: [1, 1], 5: [2, 1],
        6: [0, 2], 7: [1, 2], 8: [2, 2]
    };

    const [a, , c] = combo;

    const [x1, y1] = positions[a];
    const [x2, y2] = positions[c];

    const startX = x1 * 80 + 40;
    const startY = y1 * 80 + 40;
    const endX = x2 * 80 + 40;
    const endY = y2 * 80 + 40;

    // Länge der Linie berechnen
    const length = Math.hypot(endX - startX, endY - startY);

    // SVG-Overlay erstellen, falls noch nicht vorhanden
    let overlay = document.getElementById('overlay');
    if (!overlay) {
        overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        overlay.setAttribute("id", "overlay");
        overlay.setAttribute("width", "240");
        overlay.setAttribute("height", "240");
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.pointerEvents = "none";
        document.getElementById('content').appendChild(overlay);
    }

    // Linie erstellen
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "6");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-dasharray", length);
    line.setAttribute("stroke-dashoffset", length);

    // Animiert das "Zeichnen" der Linie
    const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animate.setAttribute("attributeName", "stroke-dashoffset");
    animate.setAttribute("from", length);
    animate.setAttribute("to", "0");
    animate.setAttribute("dur", "0.6s");
    animate.setAttribute("fill", "freeze");

    line.appendChild(animate);
    overlay.appendChild(line);
}











function disableAllClicks() {
    // Suche alle <td>-Elemente im Spielfeld
    let alleFelder = document.querySelectorAll('#content td');

    // Gehe durch jedes Feld
    for (let i = 0; i < alleFelder.length; i++) {
        // Entferne den Klick auf dieses Feld
        alleFelder[i].onclick = null;
    }
}





function restartGame() {
    // Alle Felder leeren
    fields = Array(9).fill(null);
    
    // Startspieler zurücksetzen
    currentPlayer = 'circle';
    
    // SVG-Overlay entfernen, wenn vorhanden
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.remove();
    }

    // Button wieder ausblenden
    document.getElementById('restart-btn').style.display = 'none';

    // Spielfeld neu aufbauen
    render();
}


function checkWinner() {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(combo);
            disableAllClicks();
            showRestartButton();
            return;
        }
    }

    // Wenn alle Felder voll sind → Unentschieden
    if (fields.every(f => f !== null)) {
        showRestartButton();
    }
}


function showRestartButton() {
    document.getElementById('restart-btn').style.display = 'block';
}

function updatePlayerIndicator() {
    const circle = document.getElementById('player-circle');
    const cross = document.getElementById('player-cross');

    // Statische Versionen verwenden
    circle.innerHTML = generateStaticCircleSVG();
    cross.innerHTML = generateStaticCrossSVG();

    // Aktivität visuell anzeigen
    if (currentPlayer === 'circle') {
        circle.classList.add('active');
        cross.classList.remove('active');
    } else {
        cross.classList.add('active');
        circle.classList.remove('active');
    }
}








function generateAnimatedCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70">
            <circle
                cx="35"
                cy="35"
                r="25"
                stroke="#15a5da"
                stroke-width="5"
                fill="none"
                stroke-dasharray="188.5"
                stroke-dashoffset="188.5">
                <animate
                    attributeName="stroke-dashoffset"
                    from="188.5"
                    to="0"
                    dur="1s"
                    fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateAnimatedCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70">
            <line x1="15" y1="15" x2="55" y2="55"
                  stroke="#fbbf00" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="56.57"
                  stroke-dashoffset="56.57">
                <animate attributeName="stroke-dashoffset"
                         from="56.57" to="0"
                         dur="0.5s" fill="freeze" />
            </line>
            <line x1="55" y1="15" x2="15" y2="55"
                  stroke="#fbbf00" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="56.57"
                  stroke-dashoffset="56.57">
                <animate attributeName="stroke-dashoffset"
                         from="56.57" to="0"
                         begin="0.5s"
                         dur="0.5s" fill="freeze" />
            </line>
        </svg>
    `;
}

function generateStaticCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70">
            <circle
                cx="35"
                cy="35"
                r="25"
                stroke="#15a5da"
                stroke-width="5"
                fill="none" />
        </svg>
    `;
}

function generateStaticCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70">
            <line x1="15" y1="15" x2="55" y2="55"
                  stroke="#fbbf00" stroke-width="5"
                  stroke-linecap="round" />
            <line x1="55" y1="15" x2="15" y2="55"
                  stroke="#fbbf00" stroke-width="5"
                  stroke-linecap="round" />
        </svg>
    `;
}
