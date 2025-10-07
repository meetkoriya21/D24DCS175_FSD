const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Store history in memory
let history = [];

// Serve HTML form with history
app.get("/", (req, res) => {
  let historyHTML = history.length > 0 
    ? `<h3>📜 Calculation History</h3><ul>` + history.map(item => `<li>${item}</li>`).join("") + `</ul>
       <form action="/clear" method="post"><button type="submit">🧹 Clear History</button></form>`
    : "<p>No history yet.</p>";

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Kids Calculator 🧮</title>
      <style>
        body {
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          font-family: Comic Sans MS, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .calculator {
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          text-align: center;
          width: 400px;
          max-height: 90vh;
          overflow-y: auto;
        }
        h1 {
          color: #ff6f61;
          margin-bottom: 20px;
        }
        input, select {
          width: 80%;
          padding: 12px;
          margin: 10px 0;
          border: 2px solid #ff6f61;
          border-radius: 10px;
          font-size: 18px;
        }
        button {
          background: #ff6f61;
          color: white;
          border: none;
          padding: 12px 20px;
          margin-top: 15px;
          border-radius: 12px;
          font-size: 18px;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          background: #ff3b2e;
          transform: scale(1.05);
        }
        h3 {
          color: #333;
          margin-top: 25px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          background: #ffe5d9;
          margin: 5px 0;
          padding: 8px;
          border-radius: 10px;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="calculator">
        <h1>Kids Calculator 🧮</h1>
        <form action="/calculate" method="post">
          <input type="text" name="num1" placeholder="Enter first number" required>
          <input type="text" name="num2" placeholder="Enter second number" required>
          <select name="operation">
            <option value="add">➕ Add</option>
            <option value="subtract">➖ Subtract</option>
            <option value="multiply">✖️ Multiply</option>
            <option value="divide">➗ Divide</option>
          </select>
          <br>
          <button type="submit">Calculate</button>
        </form>
        ${historyHTML}
      </div>
    </body>
    </html>
  `);
});

// Handle calculation
app.post("/calculate", (req, res) => {
  let { num1, num2, operation } = req.body;

  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  let record;

  if (isNaN(num1) || isNaN(num2)) {
    record = `❌ Invalid input`;
    history.unshift(record);
    return res.redirect("/");
  }

  let result;
  switch (operation) {
    case "add": 
      result = num1 + num2; 
      record = `${num1} + ${num2} = ${result}`;
      break;
    case "subtract": 
      result = num1 - num2; 
      record = `${num1} - ${num2} = ${result}`;
      break;
    case "multiply": 
      result = num1 * num2; 
      record = `${num1} × ${num2} = ${result}`;
      break;
    case "divide":
      if (num2 === 0) {
        record = `❌ Division by zero`;
        history.unshift(record);
        return res.redirect("/");
      }
      result = num1 / num2; 
      record = `${num1} ÷ ${num2} = ${result}`;
      break;
    default:
      record = `❌ Invalid operation`;
  }

  // ✅ Add latest result at the top
  history.unshift(record);

  res.redirect("/");
});

// Clear history
app.post("/clear", (req, res) => {
  history = [];
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
