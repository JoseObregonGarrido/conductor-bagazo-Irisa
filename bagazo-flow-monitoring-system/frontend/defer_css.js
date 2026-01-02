// defer_css.js (Versión Final para el formato específico de Vite)
import fs from 'fs';
import path from 'path';

// Determina la ruta absoluta del archivo index.html dentro de la carpeta dist
const indexPath = path.resolve(process.cwd(), 'dist', 'index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Regex específico para encontrar la etiqueta <link rel="stylesheet" crossorigin href="...">
  // Captura el valor de la URL del CSS en el grupo 1: "([^"]+)"
  const cssLinkRegex = /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+\.css)">/;
  
  const match = html.match(cssLinkRegex);

  if (match) {
    const originalLinkTag = match[0];
    const cssPath = match[1]; // Esto captura la URL del CSS (e.g., /assets/index-ByYtZon5.css)
    
    // Nueva estructura de aplazamiento (non-blocking preload)
    const replacement = `
<link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>${originalLinkTag}</noscript>
    `.trim();

    // Reemplazamos la etiqueta bloqueante original por la nueva estructura
    html = html.replace(originalLinkTag, replacement);
    
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log(` CSS deferral aplicado al archivo: ${cssPath}`);

  } else {
    // Si no lo encuentra, intentamos con un patrón más simple por si el formato ha cambiado
    console.log(' No se encontró la etiqueta <link rel="stylesheet" crossorigin...>. Verificando formato simple...');
    
    const simpleCssRegex = /<link\s+rel="stylesheet"\s+href="([^"]+\.css)">/;
    const simpleMatch = html.match(simpleCssRegex);

    if (simpleMatch) {
      const originalLinkTag = simpleMatch[0];
      const cssPath = simpleMatch[1];
      const simpleReplacement = `
<link rel="preload" href="${cssPath}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript>${originalLinkTag}</noscript>
      `.trim();
      html = html.replace(originalLinkTag, simpleReplacement);
      fs.writeFileSync(indexPath, html, 'utf-8');
      console.log(` CSS deferral aplicado (Formato Simple) al archivo: ${cssPath}`);
    } else {
      console.log(' Fallo al aplicar CSS deferral. No se encontró ninguna etiqueta CSS compatible.');
    }
  }
} catch (error) {
  console.error(' Error al modificar el index.html:', error);
}