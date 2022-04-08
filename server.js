// Require Express.js
const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))

const logging = (req, res, next) => {
    console.log(req.body.number)
    next()
}

// Require Minimist
const args = require('minimist')(process.argv.slice(2))
args["port"]
const port = args.port || process.env.PORT || 5000;


// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
    res.end(res.statusCode + ' ' + res.statusMessage)
});


app.get('/app/flip/', (req, res) => {
    const flip = coinFlip()
    res.status(200).json({'flip' : flip})
});

app.get('/app/flips/:number/', (req, res) => {
    const flips = coinFlips(req.params.number)
    const count = countFlips(flips)
    res.status(200).json({'raw' : flips, 'summary' : count})
});

app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin("heads"))
});

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin("tails"))
});

// Default response for any other request
app.use(function (req, res) {
    res.status(404).send('404 NOT FOUND')
});



function coinFlip() {
    if (Math.random() > .5) {
        return "heads";
    } else {
        return "tails";
    }
}


function coinFlips(flips) {
    var results = new Array(flips);
    for (let i = 0; i < flips; i++) {
        results[i] = coinFlip();
    }
    return results;
}

function countFlips(array) {
    let head = 0;
    let tail = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i] == "heads") {
            head++;
        } else {
            tail++;
        }
    }
    return {
        heads: head,
        tails: tail
    }
}

function flipACoin(call) {
    let result = coinFlip();
    if (result == call) {
        return { call: call, flip: result, result: "win" }
    } else {
        return { call: call, flip: result, result: "lose" }
    }
}






