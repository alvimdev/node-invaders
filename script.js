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
    if (typeof Storage !== "undefined") {
        const userData = JSON.parse(localStorage.getItem("userData")) || {};

        const rankTable = document.getElementById('rank-table');
        rankTable.innerHTML = '<tr><th>Nome</th><th>Pontuação</th></tr>';

        // Converter o objeto userData em um array de objetos { nome, pontuacao }
        const dataArray = Object.keys(userData).map(nome => ({ nome, pontuacao: userData[nome] }));

        // Ordenar os dados por pontuação
        dataArray.sort((a, b) => b.pontuacao - a.pontuacao);

        // Exibir os dados ordenados na tabela de classificação
        dataArray.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry.nome}</td><td>${entry.pontuacao}</td>`;
            rankTable.appendChild(row);
        });
    } else {
        alert("Sorry, your browser does not support web storage...");
    }
}
