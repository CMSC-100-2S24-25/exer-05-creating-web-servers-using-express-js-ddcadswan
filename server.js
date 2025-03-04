import express from 'express';
// instantiate the server
const app = express();

app.get('/', (req, res) => {
    res.send('Hello');
}); 


app.listen(3000, () => { console.log('Server started at port 3000')} );