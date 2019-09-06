const inquirer = require('inquirer')


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
                return null
            }
        })

}

const addInventory = function () {

}

const addProduct = function () {

}

const viewLowInventory = function () {

}

const viewProducts = function () {

}


start()
