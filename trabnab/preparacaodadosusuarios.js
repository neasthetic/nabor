const Value = 500;
var URL = "http://localhost:3000/playlists/3/songs/";

for (let i = 1; i <= Value; i++) {
    var URLAux = URL + i;

    fetch(URLAux, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ songId: i })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição para ${URLAux}: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`Requisição bem-sucedida para ${URLAux}:`, data);
    })
    .catch(error => {
        console.error(`Erro ao fazer a requisição para ${URLAux}:`, error);
    });
}
