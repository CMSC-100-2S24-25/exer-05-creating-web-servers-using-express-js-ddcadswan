import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Function to read books from books.txt file
function readInputs() {
    if (!fs.existsSync('books.txt')) return [];
    const data = fs.readFileSync('books.txt', 'utf8');
    return data.split('\n').map(line => {
        const [bookName, isbn, author, year] = line.split(',');
        return { bookName, isbn, author, year };
    });
}

// Function to write books to books.txt
function writeToFile(books) {
    const bookData = books.map(book => `${book.bookName},${book.isbn},${book.author},${book.year}`).join('\n');
    fs.writeFileSync('books.txt', bookData);
}

// POST method to add books
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, year } = req.body;

    if (!bookName || !isbn || !author || !year) {
        return res.json({ success: false, message: 'Missing required fields' });
    }

    const books = readInputs();
    if (books.some(book => book.isbn === isbn)) {
        return res.json({ success: false, message: 'Book with this ISBN already exists' });
    }

    books.push({ bookName, isbn, author, year });
    writeToFile(books);

    res.json({ success: true, book: { bookName, isbn, author, year } });
});

// GET method to find books by isbn and author
app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!isbn || !author) {
        return res.json({ success: false, message: 'ISBN and Author are required' });
    }

    const books = readInputs();
    const foundBooks = books.filter(book => 
        book.isbn.trim() === isbn.trim() && 
        book.author.trim().toLowerCase() === author.trim().toLowerCase()
    );

    if (foundBooks.length === 0) {
        return res.json({ success: false, message: 'No books found' });
    }

    res.json({ success: true, foundBooks });
});

// GET method to find books by author only
app.get('/find-by-author', (req, res) => {
    const { author } = req.query;

    if (!author) {
        return res.json({ success: false, message: 'Author is required' });
    }

    const books = readInputs();
    const foundBooks = books.filter(book => 
        book.author.trim().toLowerCase() === author.trim().toLowerCase()
    );

    if (foundBooks.length === 0) {
        return res.json({ success: false, message: 'No books found' });
    }

    res.json({ success: true, foundBooks });
});

// Start the server
app.listen(3000, () => { 
    console.log('Server started at http://localhost:3000');
});
