const SHEET_ID = '137myCGLvsCwvI4jfXPGmfxnO6ERfVnzsdZ66RFZQwFA';
const API_KEY = 'AIzaSyD3FmoqGazSFvR-5dt6VdEkbKZ0Yx03tzk';

function obterDadosDoGoogleSheets(spreadsheetId, sheetName, materia) {
    const range = `${materia}!${sheetName}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const values = data.values;
            if (values.length > 1) {
                const header = values[0];
                const rows = values.slice(1);

                return rows.map(row => {
                    let obj = {};
                    header.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error("Erro ao obter dados do Google Sheets:", error);
            throw error;
        });
}
