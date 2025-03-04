import fs from 'fs';
import needle from 'needle';

// Book data to write to books.txt
const bookData = [
    'Harry Potter and the Philosopher’s Stone,978-0-7475-3269-9,J.K Rowling,1997',
    'Harry Potter and the Chamber of Secrets,0-7475-3849-2,J.K Rowling,1998',
    'The Little Prince,978-0156012195,Antoine Saint-Exupery,1943'
];

// Write book data to books.txt
function writeToFile() {
    const bookEntries = bookData.join('\n');
    fs.writeFileSync('books.txt', bookEntries, { encoding: 'utf8' });
    console.log('Books written to books.txt');
}

// Function to make a POST request to add books
function addBooks(callback) {
    const url = 'http://localhost:3000/add-book';
    let completedRequests = 0;

    // Iterate over the book data and send a POST request for each book
    bookData.forEach((book) => {
        const [bookName, isbn, author, year] = book.split(',');

        needle.post(
            url,
            { bookName, isbn, author, year },
            { headers: { 'Content-Type': 'application/json' } },
            (err, res) => {
                if (err) {
                    console.error(`Error posting book "${bookName}":`, err);
                } else {
                    console.log(`Response for book "${bookName}": ${JSON.stringify(res.body)}`);
                }

                // Increment completed requests counter
                completedRequests++;

                // If all POST requests are completed, execute the callback
                if (completedRequests === bookData.length) {
                    callback();
                }
            }
        );
    });
}

// Function to test GET request for find-by-isbn-author
function testFindByIsbnAndAuthor() {
    const url = 'http://localhost:3000/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K+Rowling';
    
    needle.get(url, (err, res) => {
        if (err) {
            console.error('Error fetching data from /find-by-isbn-author:', err);
        } else {
            console.log('GET /find-by-isbn-author Response:', res.body);
        }
    });
}

// Function to test GET request for find-by-author
function testFindByAuthor() {
    const url = 'http://localhost:3000/find-by-author?author=J.K+Rowling';
    
    needle.get(url, (err, res) => {
        if (err) {
            console.error('Error fetching data from /find-by-author:', err);
        } else {
            console.log('GET /find-by-author Response:', res.body);
        }
    });
}

// First, write the books to the file
writeToFile();

// Then, call the server to add the books
addBooks(() => {
    // After all POST requests are completed, test the GET requests
    testFindByIsbnAndAuthor();
    testFindByAuthor();
});
