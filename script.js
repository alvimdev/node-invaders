function OC(idd) {
    const divs = ['rank', 'about'];
    divs.forEach(divId => {
        const div = document.getElementById(divId);
        if (div) {
            if (divId === idd) {
                div.style.display = 'flex';
                if (divId === 'rank') {
                    loadRank();
                }
            } else {
                div.style.display = 'none';
            }
        }
    });
}

function hide(idd) {
    document.getElementById(idd).style.display = 'none';
}

function loadRank() {
    fetch('ur.json')
        .then(response => response.json())
        .then(data => {
            // Ordenar os dados por pontuação
            data.sort((a, b) => b.pontuacao - a.pontuacao);

            const rankTable = document.getElementById('rank-table');
            rankTable.innerHTML = '<tr><th>Nome</th><th>Pontuação</th></tr>';
            
            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${entry.nome}</td><td>${entry.pontuacao}</td>`;
                rankTable.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar o rank:', error));
}
