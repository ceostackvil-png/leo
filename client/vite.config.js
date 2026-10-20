import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rewrite-images-to-cdn',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (/\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url)) {
            // 1. Check if product image with hash
            const prodMatch = url.match(/(?:men\(1\)\/[^/]+\/|images\/(?:leo|nobero)\/)?.*?_\d+_(.+\.(?:jpg|jpeg|png|webp|avif))/i);
            if (prodMatch && prodMatch[1]) {
              res.writeHead(302, { Location: `https://cdn.shopify.com/s/files/1/0337/9413/0052/files/${prodMatch[1]}` });
              return res.end();
            }
            // 2. Check hero banners
            if (url.includes('hero_banner_shacket')) {
              res.writeHead(302, { Location: url.includes('_mob') ? 'https://nobero.com/cdn/shop/files/HB_Shacket_mob_jpg.jpg' : 'https://nobero.com/cdn/shop/files/HB_Shacket_des_jpg.jpg' });
              return res.end();
            }
            if (url.includes('hero_banner_coords')) {
              res.writeHead(302, { Location: url.includes('_mob') ? 'https://nobero.com/cdn/shop/files/HB_Co-Ords_mob.jpg' : 'https://nobero.com/cdn/shop/files/HB_Co-Ords_des.jpg' });
              return res.end();
            }
            if (url.includes('hero_banner_chinos')) {
              res.writeHead(302, { Location: url.includes('_mob') ? 'https://nobero.com/cdn/shop/files/HB_Chinos_mob.jpg' : 'https://nobero.com/cdn/shop/files/HB_Chinos_des.jpg' });
              return res.end();
            }
            if (url.includes('hero_banner_joggers')) {
              res.writeHead(302, { Location: url.includes('_mob') ? 'https://nobero.com/cdn/shop/files/HB_Fashion_Joggers_mob.jpg' : 'https://nobero.com/cdn/shop/files/HB_Fashion_Joggers_des.jpg' });
              return res.end();
            }
            if (url.includes('col_coords')) {
              res.writeHead(302, { Location: 'https://nobero.com/cdn/shop/files/HB_Co-Ords_des.jpg' });
              return res.end();
            }
            if (url.includes('mood_travel')) {
              res.writeHead(302, { Location: 'https://nobero.com/cdn/shop/files/HB_Fashion_Joggers_des.jpg' });
              return res.end();
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
