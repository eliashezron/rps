import express from 'express';
import { paymentMiddleware } from 'x402-express';

const app = express();

app.use(express.json());

app.use(paymentMiddleware("0x41Ad4f7A089e1e2cbF43250325aC482823987e6A",
    {
    "POST /rps/play": {
        price: "$0.001", // 0.01 ETH
        network: "base-sepolia",
        config: {
            // Optional: Additional configuration for the payment middleware
            name: "Rock Paper Scissors Game",
            description: "Play a game of Rock Paper Scissors against the server",
            discoverable: true, // Whether this endpoint should be discoverable in the payment system   
            inputSchema: { 
                type: "object",
                properties: {
                    move: {
                        type: "string",
                        enum: ["rock", "paper", "scissors"],
                        description: "The player's move"
                    }
                },
                required: ["move"]
            },
            outputSchema: {
                type: "object",
                properties: {
                    playerMove: {
                        type: "string",
                        description: "The player's move"
                    },
                    serverMove: {
                        type: "string",
                        description: "The server's move"
                    },
                    outcome: {
                        type: "string",
                        enum: ["win", "lose", "draw"],
                        description: "The outcome of the game"
                    }
                }
            },
            
        }
    }
    },
    {
    url: "https://x402.org/facilitator", 
    }
)); 

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