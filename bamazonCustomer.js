const mysql = require('mysql')
const inquirer = require('inquirer')
const dotenv = require('dotenv').config()


// Setup connection params
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "bamazon",
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

// Initialise connection
connection.connect(function (err) {
    if (err) throw err

    console.log(`CONNECTED WITH THREAD ID: ${connection.threadId} \n`)

    initQuestion()
})

var initQuestion = function () {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        choices: ["Purchase a product", "Exit"],
        message: "What would you like to do today?"
    })
        .then(function (resp) {
            if (resp.action === "Purchase a product") return start()

            connection.end()
        })
}

// Starts the program
var start = function () {
    // Fetches all available products
    connection.query('select * from products', function (err, data) {
        if (err) throw err


        var choiceArray = []

        data.forEach(function (product) {
            choiceArray.push(`${product.item_id}||${product.product_name}`)
        })


        inquirer.prompt([{
            name: 'product',
            type: 'list',
            choices: choiceArray,
            message: "Which Item would you like to buy"
        },
        {
            name: 'quantity',
            type: 'number',
            message: "How many items would you like to buy",
            validate: function (input) {

                if (!isNaN(input)) {
                    return true
                }
            }
        }])
            .then(function (resp) {
                connection.query('select product_name,stock_quantity from products where ?', {
                    item_id: resp.product.split("||")[0]
                }, function (err, data) {
                    if (err) throw err

                    if (data[0].stock_quantity >= resp.quantity) {
                        console.log(`Order confirmed : ${data[0].product_name} X ${resp.quantity}`)

                        connection.query(
                            `
                            Update products 
                            set stock_quantity = ?
                            where item_id = ?
                            `, [data[0].stock_quantity - resp.quantity, resp.product.split("||")[0]])
                        return initQuestion()
                    }
                    else {
                        console.log('Unable to fufil order due to lack of stock')
                        return initQuestion()
                    }
                })
            })
    })
}
