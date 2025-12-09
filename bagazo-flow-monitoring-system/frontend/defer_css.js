// defer_css.js
import fs from 'fs';
import path from 'path';

const indexPath = path.resolve(process.cwd(), 'dist', 'index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Patrón para buscar la línea <link rel="stylesheet" href="/assets/index-XXXXXX.css">
  const cssLinkRegex = /<link rel="stylesheet" href="\/assets\/index-.*\.css">/;

  // Reemplazar la línea bloqueante por la línea no bloqueante
  if (cssLinkRegex.test(html)) {
    const replacement = `
<link 
  rel="preload" 
  href="$&" 
  as="style" 
  onload="this.onload=null;this.rel='stylesheet'"
>
<noscript>
    $&
</noscript>
    `.trim().replace(/"\/\w+/, (match) => match.slice(1)); // Limpia la ruta para que sea absoluta

    // Usamos $& en el reemplazo para referirnos a la línea completa original
    html = html.replace(cssLinkRegex, replacement.replace('href="$&"', 'href="/assets/' + cssLinkRegex.exec(html)[0].match(/index-.*\.css/)[0] + '"'));
    
    // Simplificación de reemplazo (menos propenso a errores de regex en la consola)
    // Buscamos la etiqueta completa y la reemplazamos con la estructura de preload.
    const originalLink = html.match(cssLinkRegex)[0];
    const newHtml = html.replace(originalLink, `
<link rel="preload" href="${originalLink.match(/href="(.*)"/)[1]}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>${originalLink}</noscript>
    `.trim());

    fs.writeFileSync(indexPath, newHtml, 'utf-8');
    console.log(' CSS deferral aplicado a dist/index.html');
  } else {
    console.log(' No se encontró la etiqueta CSS para aplazar. ¿Vite generó el archivo dist/index.html?');
  }

} catch (error) {
  console.error(' Error al modificar el index.html:', error);
}