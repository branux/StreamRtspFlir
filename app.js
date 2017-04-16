/**
  @author Marco Gorak
  Classe principal da aplicação responsável pela inicialização e do controle de rotas.
  Instale o FFMpeg para poder executar a lib rtsp-ffmpeg.
  @TODO Criar meio de comunicação do meu microserviço a uma aplicação externa através de uma rota que aceita um JSON
  @TODO Verificar a possibilidade de buffer do lado do usuário
*/


// Declarando array para armazenar cada cliente
var sockets = {};

const app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	rtsp = require('./lib/rtsp-ffmpeg');



//Atribuindo o link a ser transmitido no navegador:
var uri = 'rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4'
		, stream = new rtsp.FFMpeg({input: uri, resolution: '640x480', quality: 1});


io.on('connection', function(socket) {
	console.log('Usuário Conectado');
  	var pipeStream = function(data) {
      var frame = new Buffer(data).toString('base64'); 
    	socket.emit('data', frame);
  	};
  	stream.on('data', pipeStream);
  	socket.on('disconnect', function() {
		console.log('Usuário Desconectado');
    	stream.removeListener('data', pipeStream);
  	});
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// a aplicação express fica escutando na porta 8000
http.listen(8000);
console.log('Servidor rodando na porta 8000')