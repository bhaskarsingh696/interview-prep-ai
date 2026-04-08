const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const executeCode = async (code, language) => {
  return new Promise((resolve) => {
    let fileName, command;
    const tmpDir = os.tmpdir();

    try {
      if (language === 'javascript') {
        fileName = path.join(tmpDir, `code_${Date.now()}.js`);
        fs.writeFileSync(fileName, code);
        command = `node "${fileName}"`;
      } else if (language === 'python') {
        fileName = path.join(tmpDir, `code_${Date.now()}.py`);
        fs.writeFileSync(fileName, code);
        command = `python "${fileName}"`;
      } else if (language === 'cpp') {
        const srcFile = path.join(tmpDir, `code_${Date.now()}.cpp`);
        const outFile = path.join(tmpDir, `code_${Date.now()}.exe`);
        fs.writeFileSync(srcFile, code);
        command = `g++ "${srcFile}" -o "${outFile}" && "${outFile}"`;
        fileName = srcFile;
      } else {
        return resolve({ output: '', error: 'Unsupported language' });
      }

      exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
        // Cleanup temp file
        try { fs.unlinkSync(fileName); } catch {}

        if (error && !stdout) {
          resolve({ output: '', error: stderr || error.message });
        } else {
          resolve({
            output: stdout || '',
            error: stderr || '',
            exitCode: error ? 1 : 0
          });
        }
      });
    } catch (err) {
      resolve({ output: '', error: err.message });
    }
  });
};

module.exports = { executeCode };