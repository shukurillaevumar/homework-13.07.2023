const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const library = [
        {
            "id": "1",
            "name": "Muhammadumar",
            "author": "Muhammadumar",
            "year": "1999"
        },
        {
            "id": "2",
            "name": "Muhammadumar",
            "author": "Muhammadumar",
            "year": "2000"
        },
        {
            "id": "3",
            "name": "Muhammadumar",
            "author": "Muhammadumar",
            "year": "2001"
        }
];

app.get("/books/all", (req, res)=> {
    res.json(library);
});

app.get("/books/:id", (req, res)=> {
    const {id} = req.params;
    const index = library.findIndex((book)=> {
        return book.id === id;
    });

    if(index === -1) {
        res.json({
            error: "Book has not been found"
        });
    } else {
        res.json({
            result: "Book has been successfully found",
            book: library[index]
        });
    }
})

app.post("/books/create", (req, res)=> {
    const validationResult = validateCreateBookPayload(req.body);
    if(validationResult.code === "201") {
        const newBook = req.body;
        library.push(newBook);
        res.json({
            result: "New book has been successfully added",
            book: newBook
        });
    } else if (validationResult.code === "404") {
        res.json({
            error: validationResult.error,
            code: validationResult.code
        })
    }
});

app.put("/books/edit/:id", (req, res)=> {
    const {id} = req.params;
    const newBook = req.body;
    const index = library.findIndex((book)=> {
        return book.id === id;
    });

    library[index] = {... library[index], ... newBook};
    res.send(library[index]);
});

app.delete("/books/delete/:id", (req, res)=> {
    const {id} = req.params;
    const index = library.findIndex((book)=> {
        return book.id === id;
    });

    if(index === -1) {
        res.json({
            error: "Book is not found",
            code: "404"
        })
    } else {
    library.splice(index, 1);
    res.json({
        result: "Successfully deleted"
    });
    }

});

const PORT = 3000;
app.listen(PORT, ()=> {
    console.log("App is running on port: " + PORT);
})

function validateCreateBookPayload (params) {
    const {id, name, author, year} = params;
    const result = {};
    if(!id) {
        return {
            error: "Id is not found",
            code: "404"
        }
    }
    result.id = id;
    if(typeof id === 'string') {
        return {
            error: 'ID should be number'
        }
    }
    if(!name) {
        return {
            error: "Name is not found",
            code: "404"
        }
    }
    result.name = name;
    if(!author) {
        return {
            error: "Author is not found",
            code: "404"
        }
    }
    result.author = author;
    if(!year) {
        return {
            error: "Year is not found",
            code: "404"
        }
    }
    result.year = year;

    return {
        code: "201",
        result
    }
}