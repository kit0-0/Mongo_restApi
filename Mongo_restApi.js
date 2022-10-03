const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())


mongoose.connect("mongodb://localhost:27017/mydata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('Connected to MongoDB')
    } else {
        console.log('Failed to connect to MongoDB')
    }
})

//schema
const sch = {
    name: String,
    email: String,
    id: Number,
}

const monmodel = mongoose.model('NEWCOL', sch)

//POST
app.post('/post', async (req, res) => {
    console.log("POST")

    const data = new monmodel({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
    })
    const val = await data.save(data)
    res.json(val)
})

//PUT
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;

    //Find id
    monmodel.findOneAndUpdate(
        { id: upid },
        {
            $set: { name: upname, email: upemail },
            new: true //if false show updated data
        }, (err, data) => {
            if (data == null) {
                res.send("no data found");
            } else {
                res.send(data)
            }
        });
})


app.get('/fetch/:id', (req, res) => {
    fetchid = req.params.id;
    monmodel.find(({ id: fetchid }), function (err, val) {
        res.send(val);
    })
})

//delete
app.delete('/del/:id', function (req, res) {
    let delid = req.params.id;
    monmodel.findOneAndDelete(({ id: delid }),
        function (err, doc) {
            if (err) { res.send("error") } else {
                if (doc == null) {
                    res.send("no data found");
                } else {
                    res.send(doc);
                }
            }
        })
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
})