const qrcode = require('qrcode-terminal');
const express = require('express'); 
const http = require('http');

const { Client, LocalAuth, } = require('whatsapp-web.js');

const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // <- this one doesn't works in Windows
          '--disable-gpu'
        ],
      },
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
	if(message.body === '!ping') {
		client.sendMessage(message.from, 'pong');
	}
});

client.initialize();

app.post('/send', async (req, res) => {
    const phone = req.body.phone;
    const message = req.body.message;

    hp  = phone+'@c.us'

    // client.sendMessage(phone, message);
  
    await client.sendMessage(hp, message)
      .then(response => {
        res.status(200).json({
          error: false,
          data: {
            message: 'Pesan terkirim',
            meta: response,
          },
        });
      })
      .catch(error => {
        res.status(200).json({
          error: true,
          data: {
            message: error,
            meta: error,
          },
        });
      });
  });

server.listen(PORT, () => {
    console.log('App listen on port ', PORT);
  });