const fs = require('fs');

async function build() {
  try {
    const code = fs.readFileSync('index.tsx', 'utf8');
    const res = await fetch('https://unpkg.com/@babel/standalone/babel.min.js');
    const babelCode = await res.text();
    const vm = require('vm');
    const sandbox = { window: {}, console };
    vm.createContext(sandbox);
    vm.runInContext(babelCode, sandbox);
    const Babel = sandbox.Babel;

    const out = Babel.transform(code, {
      presets: ['react', 'typescript'],
      filename: 'index.tsx',
      targets: { esmodules: true }
    });

    fs.writeFileSync('index.js', out.code, 'utf8');
    console.log('Lyckades bygga index.js (' + out.code.length + ' bytes)');
  } catch (err) {
    console.error('Byggfel:', err);
    process.exit(1);
  }
}

build();
