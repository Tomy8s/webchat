const express = require('express');
const app = express();

const messages = [{ createdAt: 1654411042048, message: 'post1', user: 'TomY8s' }];

app.use(require('cors')());
app.use(express.json());
app.use(express.static('public'));

app.get('/post', send);
app.post('/post', save);

function save(req, res) {
    const [ user ] = req.headers.cookie.match(/(?<=(^|; *)user=)(.*?)(?=(;.*|$))/) || [];
    console.log(user);
    console.log(req.body);

    messages.push({
        createdAt: Date.now(),
        message: req.body.message,
        user: user,
    });
    send(...arguments);
}

function send(req, res) {
    const returnEmpty = setTimeout(() => res.send({ messages: [], sentAt: Date.now() }), 15000);
    const { from } = req.query;

    
    const checker = setInterval(() => {
        const newMessages = getMessagesFrom(from, messages);
        if (messages.length > 0) {
            clearTimeout(returnEmpty);
            clearInterval(checker);
            res.send({ messages: newMessages, sentAt: Date.now() });
        }
    }, 900);
}

function getMessagesFrom(from = 0, messages) {
    for (let i = Math.max(messages.length - 10, 0); i < messages.length; i++) {
        if (messages[i].createdAt > from) {
            return messages.slice(i);
        }
    }

    return [];
}

app.listen(3323, console.log('serving...'));