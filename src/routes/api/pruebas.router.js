const { Router } = require("express");
const { fork } = require('child_process')
const router = Router();

function operacionCompleja() {
    let result = 0;

    for (let i = 0; i < 10e9; i++) {
        result +=1;
    }
    return result;
}

router.get('/simple', (req, res) => {
    const result = operacionCompleja();
    res.send({result});
});

router.get('/compleja', (req, res) => {
    const child = fork('./routes/operacionCompleja.js')
    child.send('Inicia el cálculo')
    child.on('message', result => {
        res.send({result});
    })
})

module.exports = router;