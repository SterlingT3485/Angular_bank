
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SRM7FNXC.js",
      "chunk-ZFM3GSFH.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-ZZCFMZHE.js",
      "chunk-ZFM3GSFH.js"
    ],
    "route": "/create-account"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-3SBUYZ2L.js",
      "chunk-ZFM3GSFH.js"
    ],
    "route": "/transfer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LCINFXL5.js",
      "chunk-ZFM3GSFH.js"
    ],
    "route": "/history"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5209, hash: '266f031cd249768b4ad66bba66f7d300f184fd2fdfb85c16f54c0461319ba842', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1162, hash: 'bf074ab0c8c594aee685241f6340d95aec1706af35f5c13a9cdc1525c529cab3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-DKM3H3EW.css': {size: 231598, hash: '3TybGr1USVQ', text: () => import('./assets-chunks/styles-DKM3H3EW_css.mjs').then(m => m.default)}
  },
};
