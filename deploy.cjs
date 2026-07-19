const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // 1. Build
  console.log('Building...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Ir para a pasta dist
  const distPath = path.join(__dirname, 'dist');
  process.chdir(distPath);

  // 3. Inicializar git e dar push forçado para a branch gh-pages
  console.log('Deploying to gh-pages...');
  if (fs.existsSync('.git')) {
    fs.rmSync('.git', { recursive: true, force: true });
  }
  execSync('git init', { stdio: 'inherit' });
  execSync('git checkout -b gh-pages', { stdio: 'inherit' });
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "Deploying to gh-pages"', { stdio: 'inherit' });
  
  // Substitua pela sua URL
  const repoUrl = 'https://github.com/bebetodias/casa-inteligente.git';
  
  execSync(`git push -f ${repoUrl} gh-pages:gh-pages`, { stdio: 'inherit' });
  
  console.log('Successfully deployed!');
} catch (err) {
  console.error('Deploy failed:', err.message);
  process.exit(1);
}
