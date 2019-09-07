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

var start = function () {
    inquirer.prompt(
        [
            {
                type: "list",
                choices: ["View Product Sales By Department", "Add A New Department", "Exit"],
                message: "Select an option to begin",
                name: "option"
            }
        ]
    )
        .then(function (resp) {
            if (resp.option === "View Product Sales By Department") {
                viewSummary()
            }
            else if (resp.option === "Add A New Department") {
                addDepartment()
            }
            else {
                connection.end()
            }
        })
}

const viewSummary = function () {
    connection.query(`
                      SELECT d.department_id, d.department_name, d.over_head_costs, (sum(p.product_sales)) as product_sales,(sum(p.product_sales) - d.over_head_costs) as total_profit
                      FROM departments d 
                      LEFT JOIN products p 
                      ON d.department_name = p.department_name
                      GROUP BY d.department_id                
    `,
        function (err, data) {
            if (err) throw err

            console.table(data)

            start()
        })
}

const addDepartment = function () {
    inquirer.prompt([{
        type: 'text',
        message: "Enter a department name",
        name: "name"
    }, {
        type: "number",
        message: "Enter the overhead costs for this department",
        name: "cost",
        validate: function (input) {

            if (!isNaN(input)) {
                return true
            }
        }
    }
    ])
        .then(function (resp) {
            connection.query(`
                          INSERT INTO departments (department_name, over_head_costs)    
                          VALUES (? ,?)
                        `, [resp.name, resp.cost],
                function (err, data) {
                    if (err) throw err

                    console.log(`SUCCESFULLY ADDED NEW DEPARTMENT : ${resp.name}`)

                    start()
                })
        })
}
