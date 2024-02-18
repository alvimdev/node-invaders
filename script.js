function OC(idd) {
    const divs = ['rank', 'shop'];
    divs.forEach(divId => {
        const div = document.getElementById(divId);
        if (div) {
            if (divId === idd) {
                div.style.display = 'flex';
                if (divId === 'rank')
                    loadRank();
                if (divId === 'shop')
                    select(undefined);
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
    if (typeof(Storage) !== "undefined") {
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

function select(s) {
    ships = ['s0', 's1', 's2', 's3'];

    const profile = JSON.parse(localStorage.getItem("profile")) || {};

    switch (s) {
        case 's0':
            profile.skin = '../assets/spaceship0.png';
            profile.color = '#0bda51';
            profile.s = 's0'
            break;
        case 's1':
            profile.skin = '../assets/spaceship1.png';
            profile.color = '#fcae1e';
            profile.s = 's1'
            break;
        case 's2':
            profile.skin = '../assets/spaceship2.png';
            profile.color = '#d397f8';
            profile.s = 's2'
            break;
        case 's3':
            profile.skin = '../assets/spaceship3.png';
            profile.color = '#7ec8e3';
            profile.s = 's3'
            break;
        default:
            console.log('.-.');
            break;
    }

    ships.forEach(shipId => {
        const ship = document.getElementById(shipId);

        if (ship) {
            if (profile.s === shipId) {
                ship.style.border = '#73cc58 solid 1px';
            } else {
                ship.style.border = 'none';
            }
        }
    });

    localStorage.setItem("profile", JSON.stringify(profile))
}
