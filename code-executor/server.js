import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3001;
const TEMP_DIR = '/tmp/code-exec';

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Execution timeout (10 seconds)
const EXECUTION_TIMEOUT = 10000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Language configurations
const LANGUAGE_CONFIG = {
    py: {
        filename: 'main.py',
        command: (dir) => `cd ${dir} && timeout 10 python3 main.py < input.txt 2>&1`
    },
    js: {
        filename: 'main.js',
        command: (dir) => `cd ${dir} && timeout 10 node main.js < input.txt 2>&1`
    },
    java: {
        filename: 'Main.java',
        command: (dir) => `cd ${dir} && timeout 30 javac Main.java 2>&1 && timeout 10 java Main < input.txt 2>&1`
    },
    cpp: {
        filename: 'main.cpp',
        command: (dir) => `cd ${dir} && timeout 30 g++ main.cpp -o main 2>&1 && timeout 10 ./main < input.txt 2>&1`
    }
};

// Execute code endpoint
app.post('/execute', async (req, res) => {
    const { code, language, input } = req.body;

    // Validation
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    if (!language || !LANGUAGE_CONFIG[language]) {
        return res.status(400).json({
            error: 'Unsupported language',
            supportedLanguages: Object.keys(LANGUAGE_CONFIG)
        });
    }

    const id = uuidv4();
    const dir = path.join(TEMP_DIR, id);

    try {
        // Create execution directory
        await fs.mkdir(dir, { recursive: true });

        // Write input file
        await fs.writeFile(path.join(dir, 'input.txt'), input || '', 'utf-8');

        // Write code file
        const config = LANGUAGE_CONFIG[language];
        await fs.writeFile(path.join(dir, config.filename), code, 'utf-8');

        // Execute code
        const command = config.command(dir);

        const result = await new Promise((resolve) => {
            exec(command, {
                timeout: EXECUTION_TIMEOUT,
                maxBuffer: 1024 * 1024 // 1MB output limit
            }, (error, stdout, stderr) => {
                if (error) {
                    // Check if it's a timeout
                    if (error.killed || error.signal === 'SIGTERM') {
                        resolve({
                            output: '',
                            error: 'Execution timed out (10 seconds limit)'
                        });
                    } else {
                        resolve({
                            output: stdout || '',
                            error: stderr || error.message
                        });
                    }
                } else {
                    resolve({
                        output: stdout || stderr || '',
                        error: null
                    });
                }
            });
        });

        // Cleanup
        await fs.rm(dir, { recursive: true, force: true }).catch(() => { });

        res.json(result);

    } catch (err) {
        // Cleanup on error
        await fs.rm(dir, { recursive: true, force: true }).catch(() => { });

        console.error('Execution error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get supported languages
app.get('/languages', (req, res) => {
    res.json({
        languages: Object.keys(LANGUAGE_CONFIG),
        details: {
            py: { name: 'Python 3', extension: '.py' },
            js: { name: 'JavaScript (Node.js)', extension: '.js' },
            java: { name: 'Java 17', extension: '.java' },
            cpp: { name: 'C++ (g++)', extension: '.cpp' }
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Code Executor Service running on port ${PORT}`);
    console.log(`📋 Supported languages: ${Object.keys(LANGUAGE_CONFIG).join(', ')}`);
});
