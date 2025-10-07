const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

function renderLogs(res) {
    const logFilePath = path.join(__dirname, 'logs', 'error.log');

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist
                return res.status(404).send(`
                    <html>
                        <head>
                            <title>File Not Found</title>
                            <style>
                               body {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Orbitron', 'Arial Black', Arial, sans-serif;
  background: radial-gradient(circle at 20% 20%, #0fffc1 0%, #3a47d5 50%, #000 100%);
  color: #fff;
  overflow-x: hidden;
}

.glass {
  background: rgba(255,255,255,0.12);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.18);
  padding: 2rem 3rem;
  margin: 2rem auto;
  max-width: 700px;
}

h1, h2, h3 {
  font-family: 'Orbitron', 'Arial Black', Arial, sans-serif;
  font-size: 3rem;
  letter-spacing: 0.2em;
  background: linear-gradient(90deg, #ff512f, #dd2476, #1fa2ff, #0fffc1);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 6s ease-in-out infinite;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 20px #0fffc1, 0 0 40px #1fa2ff;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

button {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(270deg, #ff512f, #dd2476, #1fa2ff, #0fffc1);
  background-size: 600% 600%;
  color: #fff;
  box-shadow: 0 0 20px #1fa2ff, 0 0 40px #0fffc1;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: gradientMove 4s linear infinite;
  outline: 4px solid #fff2;
  outline-offset: 4px;
}

button:hover {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 0 40px #ff512f, 0 0 80px #1fa2ff;
  outline: 4px solid #ff512f;
}

a {
  color: #0fffc1;
  font-weight: bold;
  font-size: 1.3rem;
  text-decoration: underline double #ff512f;
  transition: color 0.3s, text-shadow 0.3s;
}

a:hover {
  color: #ff512f;
  text-shadow: 0 0 10px #1fa2ff;
}

::-webkit-scrollbar {
  width: 14px;
  background: #222;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(#1fa2ff, #0fffc1, #ff512f);
  border-radius: 7px;
  box-shadow: 0 0 10px #0fffc1;
}

@media (max-width: 600px) {
  .glass {
    padding: 1rem;
    max-width: 95vw;
  }
  h1, h2, h3 {
    font-size: 2rem;
  }
}
                            </style>
                        </head>
                        <body>
                            <h1>📄 File Not Found</h1>
                            <p>The log file <strong>error.log</strong> does not exist in the <code>logs</code> folder.</p>
                        </body>
                    </html>
                `);
            }

            console.error('Error reading log file:', err.message);
            return res.status(500).send(`
                <h1>Error Loading Logs</h1>
                <p>Could not read log file. Please check permissions or file path.</p>
            `);
        }

        const content = data.trim() === '' ? 'No Error Content' : data;

        res.send(`
            <html>
                <head>
                    <title>Error Logs</title>
                    <style>
                        body {
                            font-family: 'Fira Code', monospace;
                            background: linear-gradient(-45deg, #ffecd2, #fcb69f, #a1c4fd, #c2e9fb);
                            background-size: 400% 400%;
                            animation: gradientFlow 20s ease infinite;
                            margin: 0;
                            padding: 0;
                            color: #333;
                            min-height: 100vh;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        
                        @keyframes gradientFlow {
                            0% { background-position: 0% 50%; }
                            25% { background-position: 50% 100%; }
                            50% { background-position: 100% 50%; }
                            75% { background-position: 50% 0%; }
                            100% { background-position: 0% 50%; }
                        }

                        h1 {
                            font-size: 2.8rem;
                            background: linear-gradient(90deg, #ff69b4, #ff99cc);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            margin-top: 30px;
                            margin-bottom: 20px;
                            text-shadow: 0 0 15px rgba(255, 182, 193, 0.4);
                            animation: glowPulse 2s infinite;
                        }

                        @keyframes glowPulse {
                            0%, 100% { text-shadow: 0 0 15px rgba(255, 182, 193, 0.4); }
                            50% { text-shadow: 0 0 25px rgba(255, 182, 193, 0.8); }
                        }

                        pre {
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            background: rgba(255, 255, 255, 0.85);
                            color: #222;
                            padding: 25px;
                            border-radius: 12px;
                            max-width: 90%;
                            max-height: 70vh;
                            overflow-y: auto;
                            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 
                                        0 0 15px rgba(255, 182, 193, 0.2);
                            border: 1px solid rgba(255, 182, 193, 0.2);
                            font-size: 1.3rem;
                            line-height: 1.6;
                        }

                        pre:hover {
                            transform: scale(1.02);
                            box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15), 
                                        0 0 25px rgba(255, 182, 193, 0.4);
                        }

                        pre::-webkit-scrollbar {
                            width: 10px;
                        }
                        pre::-webkit-scrollbar-track {
                            background: rgba(0, 0, 0, 0.05);
                            border-radius: 10px;
                        }
                        pre::-webkit-scrollbar-thumb {
                            background: linear-gradient(#fbc2eb, #a6c1ee);
                            border-radius: 10px;
                        }
                    </style>
                </head>
                <body>
                    <h1>📜 Error Logs</h1>
                    <pre>${content}</pre>
                </body>
            </html>
        `);
    });
}

app.get('/', (req, res) => {
    renderLogs(res);
});

app.get('/logs', (req, res) => {
    renderLogs(res);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});