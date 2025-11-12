# Guia para Substituir o Favicon

## Como converter a logo em favicon

### Opção 1: Usar Real Favicon Generator (Recomendado)

1. Acesse: https://realfavicongenerator.net/
2. Faça upload da logo (`src/assets/logo.png`)
3. Configure as opções:
   - iOS: Habilitar
   - Android: Habilitar
   - Windows: Habilitar
   - macOS: Habilitar
4. Clique em "Generate your Favicons and HTML code"
5. Baixe o pacote de arquivos
6. Extraia os arquivos para a pasta `public/`
7. Os arquivos devem incluir:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`
   - `site.webmanifest`

### Opção 2: Converter manualmente

Se você tem uma ferramenta de edição de imagens:

1. **favicon.ico**: 
   - Criar em 16x16, 32x32 e 48x48 pixels
   - Salvar como `.ico`

2. **favicon-16x16.png**: 16x16 pixels
3. **favicon-32x32.png**: 32x32 pixels
4. **apple-touch-icon.png**: 180x180 pixels
5. **android-chrome-192x192.png**: 192x192 pixels
6. **android-chrome-512x512.png**: 512x512 pixels

### Opção 3: Usar imagem online

Se a logo estiver online, você pode usar:
- https://favicon.io/favicon-converter/
- https://www.favicon-generator.org/

## Arquivos necessários na pasta `public/`

Após converter, coloque estes arquivos em `public/`:

```
public/
  ├── favicon.ico
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png
  ├── android-chrome-192x192.png
  ├── android-chrome-512x512.png
  └── site.webmanifest
```

## Atualizar site.webmanifest

O arquivo `site.webmanifest` já foi criado. Certifique-se de que os nomes dos arquivos correspondem:

```json
{
  "name": "VN TICKET - Sistema de Venda de Ingressos Digitais",
  "short_name": "VN TICKET",
  "description": "Plataforma completa para venda de ingressos digitais com QR codes únicos",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#0ea5e9",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

## Testar o favicon

1. Limpar cache do navegador
2. Recarregar a página (Ctrl+F5 ou Cmd+Shift+R)
3. Verificar se o favicon aparece na aba do navegador
4. Verificar se aparece nos favoritos
5. Testar em diferentes navegadores:
   - Chrome
   - Firefox
   - Safari
   - Edge

## Criar og-image.png para SEO

Para compartilhamento em redes sociais:

1. Criar imagem de 1200x630 pixels
2. Incluir logo e texto do site
3. Salvar como `public/og-image.png`
4. Atualizar URL no `index.html` quando tiver domínio

Ou usar ferramentas online:
- https://www.canva.com/
- https://www.figma.com/


