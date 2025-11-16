const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const docsDir = path.join(__dirname, '..', 'docs');

// Função para copiar arquivos recursivamente
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Verifica se a pasta build existe
if (!fs.existsSync(buildDir)) {
  console.error('Erro: A pasta "build" não existe. Execute "npm run build" primeiro.');
  process.exit(1);
}

// Remove a pasta docs se existir
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}

// Copia os arquivos
console.log('Copiando arquivos de "build" para "docs"...');
copyRecursiveSync(buildDir, docsDir);

// Cria arquivo .nojekyll na pasta docs
const nojekyllPath = path.join(docsDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');

console.log('✓ Arquivos copiados com sucesso para a pasta "docs"!');
console.log('✓ Arquivo .nojekyll criado.');

