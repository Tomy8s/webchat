const express = require('express');
const app = express();

const messages = [];

app.use(require('cors')());
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
    console.log(`${ new Date().toISOString() } ${ res.statusCode } ${ req.url }`);
    next();
});

app.get('/post', send);
app.post('/post', save);

function save(req, res) {
    const [ user ] = req.headers.cookie.match(/(?<=(^|; *)user=)(.*?)(?=(;.*|$))/) || [];
    const { createdAt, message } = req.body;
    const newMessage = {
        createdAt,
        message,
        user,
    };

    messages.push(newMessage);
    res.send({ messages: getMessagesFrom(createdAt, messages), sentAt: Date.now() });
}

function send(req, res) {
    let checker
    const returnEmpty = setTimeout(() => {
        clearInterval(checker);
        res.send({ messages: [], sentAt: Date.now() })
    }, 5000);
    const { from } = req.query;

    
    checker = setInterval(() => {
        const newMessages = getMessagesFrom(Number(from), messages);
        if (newMessages.length > 0) {
            console.log(newMessages.length);
            clearTimeout(returnEmpty);
            clearInterval(checker);
            res.send({ messages: newMessages, sentAt: Date.now() });
        }
    }, 900);
}

function getMessagesFrom(from = 0, messages) {
    for (let i = Math.max(messages.length - 10, 0); i < messages.length; i++) {
        if (messages[i].createdAt >= from) {
            return messages.slice(i);
        }
    }

    return [];
}

app.listen(process.env.PORT || 3323, console.log('serving...'));