const fs = require('fs');
const path = require('path');

const numbers = [329, 457, 657, 839, 436, 720, 355];
const outputDir = path.join(__dirname, '..', 'bootstrap');

fs.mkdirSync(outputDir, { recursive: true });

for (let digit = 0; digit <= 9; digit += 1) {
  const bucket = numbers.filter((value) => Math.floor(value / 1) % 10 === digit);
  const data = {
    step: digit,
    digit,
    bucket,
    explanation: bucket.length
      ? `Numbers with ones digit ${digit}: ${bucket.join(', ')}`
      : `No numbers with ones digit ${digit}.`,
  };

  const filePath = path.join(outputDir, `step${digit}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log(`Generated files for steps 0-9 in ${outputDir}`);
