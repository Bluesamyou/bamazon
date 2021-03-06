const mysql = require('mysql')
const inquirer = require('inquirer')
const dotenv = require('dotenv').config()

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "bamazon",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

connection.connect(function (err) {
    if (err) throw err

    console.log(`CONNECTED WITH THREAD ID: ${connection.threadId} \n`)

    start()
})


const start = function () {
    inquirer.prompt({
        type: 'list',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
        message: "Select an option from below",
        name: "option"
    })
        .then(function (resp) {
            if (resp.option === "View Products for Sale") {
                viewProducts()
            }
            else if (resp.option === "View Low Inventory") {
                viewLowInventory()
            }
            else if (resp.option === "Add to Inventory") {
                addInventory()
            }
            else if (resp.option === "Add New Product") {
                addProduct()
            }
            else {
                connection.end()
            }
        })

}

const addInventory = function () {
    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err

        var itemsArray = []

        data.forEach(function (row) {
            itemsArray.push(row.product_name)
        })

        inquirer.prompt([{
            type: 'list',
            choices: itemsArray,
            message: "Select an item to add stock to",
            name: "item"
        }, {
            type: "number",
            message: "Enter the number of items you wish to add to stock",
            name: "stock",
            validate: function (input) {

                if (!isNaN(input)) {
                    return true
                }
            }
        }])
            .then((resp) => {
                connection.query(`
                                  SELECT stock_quantity 
                                  FROM products
                                  WHERE product_name = ?`, [resp.item],
                    function (err, data) {
                        if (err) throw err

                        connection.query(`
                                      UPDATE products
                                      SET stock_quantity = ?
                                      WHERE product_name = ?;                  
                                      `, [(resp.stock + data[0].stock_quantity), resp.item],
                            function (err, data) {
                                if (err) throw err

                                console.log(`UPDATED QUANTITY SUCCESFULLY FOR ${resp.item} \n`)

                                return start()
                            })
                    })

            })
    })

}

const addProduct = function () {
    inquirer.prompt([{
        type: "text",
        message: "Enter a product name",
        name: "name"
    }, {
        type: "text",
        message: "Enter the product department",
        name: "department"
    }, {
        type: "number",
        message: "Enter a price for this product",
        name: "price",
        validate: function (input) {

            if (!isNaN(input)) {
                return true
            }
        }
    },
    {
        type: "number",
        message: "Enter the number of items to list up",
        name: "stock",
        validate: function (input) {

            if (!isNaN(input)) {
                return true
            }
        }
    }])
        .then(function (resp) {
            connection.query(`
                            INSERT INTO products(product_name, department_name, price, stock_quantity)
                            VALUES(?,?,?,?)`, [resp.name, resp.department, resp.price, resp.stock],
                function (err, data) {
                    if (err) throw err

                    console.log('SUCCESFULLY ADDED ITEM TO INVENTORY \n')

                    start()
                })
        })
}

const viewLowInventory = function () {
    connection.query('SELECT * FROM products where stock_quantity < 5', function (err, data) {
        if (err) throw err

        console.table(data)

        start()
    })
}

const viewProducts = function () {
    connection.query('SELECT * FROM products', function (err, data) {
        if (err) throw err

        console.table(data)

        start()
    })
}

