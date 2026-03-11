import express from 'express';

const app = express();

app.use(express.json());

const move = ['rock', 'paper', 'scissors'];
function determineOutcome(playerMove, serverMove) {
    if (playerMove === serverMove) {
        return 'draw';
    }
    if (
        (playerMove === 'rock' && serverMove === 'scissors') ||
        (playerMove === 'paper' && serverMove === 'rock') ||
        (playerMove === 'scissors' && serverMove === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/rps/play', (req, res) => {
    try {
    if (!move.includes(req.body.move)) {
        return res.status(400).send({error: 'Invalid move'});
    }
    const serverMove = move[Math.floor(Math.random() * move.length)];
    const outcome = determineOutcome(req.body.move, serverMove);

    res.json({playerMove: req.body.move, serverMove, outcome}).status(200);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Internal Server Error'});
    }
});

app.listen(4021, () => {
  console.log('Server is running on port 4021');
});