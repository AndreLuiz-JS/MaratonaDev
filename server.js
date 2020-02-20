const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

//configurar conexao BD
const Pool = require('pg').Pool;

const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'donors'
});

//arquivos estáticos
server.use(express.static('public'));

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }));

//configuração template engine
nunjucks.configure('./', {
    express: server,
    noCache: true
});

//adicionando rota em root (/)
server.get('/', function (req, res) {

    db.query(`SELECT * FROM donors`, function(err, result){
        if(err) return res.send('Erro no banco de dados: '+err.message);

    const donors = result.rows;
    //render feito com nunjucks
    return res.render('index.html', {donors})
    })

})

server.post('/', function (req, res) {
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == '' || email == '' || blood == '') {
        return res.send('Todos os campos são obrigatórios')
    }

    //colocar valores dentro do BD
    const query =
        `INSERT INTO donors ("name","email","blood")
        VALUES($1, $2, $3)`;
    const values = [name, email, blood];

    db.query(query, values, function (err) {
        if (err) return res.send('Erro no banco de dados: '+err.message);
        return res.redirect('/');
    });

   

})

//iniciando servidor na porta 3000
server.listen(3000, function () {
    console.log(`${server.name} iniciado`)
});