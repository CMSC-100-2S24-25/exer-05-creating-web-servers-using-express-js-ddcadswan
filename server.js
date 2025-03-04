import express from 'express';
// instantiate the server
import fs from 'fs';

const app = express();

app.use(express.json());

// FUNCTION TO READ BOOKS from books.txt file
function readInputs(){
    if (!fs.existsSync('books.txt')) return []; 
    const data = fs.readFileSync('books.txt', 'utf8');
    return data.split('\n').map(line => {
        const [bookName, isbn, author, year] = line.split(',');
        return {bookName, isbn, author, year};
    });
}

// FUNCTION TO WRITE BOOKS to books.txt
function writeToFile(books){
    const bookData = books.map(book => `${book.bookName}, ${book.isbn}, ${book.author}, ${book.year}`).join('\n');
    fs.writeFileSync('books.txt', bookData);
}

// POST method to add the books to the file
app.post('/add-book', (req, res) => {
    const {bookName, isbn, author, year} = req.body;

    // Check if there are empty values
    if(!bookName || !isbn || !author || !year){
        return res.json({success: false});
    }

    // Check if ISBN is unique
    const books = readInputs();
    if (books.some(book => book.isbn === isbn)) {
        return res.json({success: false});
    }

    // Add book
    books.push({bookName, isbn, author, year});

    // Write
    writeToFile(books);

    res.json({success: true});
});

// GET method to find books by isbn and author
app.get('/find-by-isbn-author', (req, res) => {
    const {isbn, author} = req.query;

    if (!isbn || !author){
        return res.json({success: false});
    }

    const books = readInputs();
    const foundBooks = books.filter(book => book.isbn === isbn && book.author.toLowerCase() === author.toLowerCase());

    if (foundBooks.length === 0){
        return res.json({success: false});
    }
    res.json(foundBooks);

    // GET method by author only
}); 


app.listen(3000, () => { console.log('Server started at port 3000')} );