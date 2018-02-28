/* globals self */
const CACHE_NAMESPACE = 'link-'
const VERSION = '0.1.8'
const CACHE_NAME = `${CACHE_NAMESPACE}static-cat-or-dog${VERSION}`

const CACHE_FILE_LIST = [
    // 'index.html',
    './horse.svg',
    './cat.svg'
]

self.addEventListener('install', event => {
    console.log('[ServiceWorker] installing…')
    self.skipWaiting()
    console.log('skip')

    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILE_LIST)))
})

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] now activated.')
    // 设置缓存白名单
    const whiteCacheList = []

    event.waitUntil(
        caches.keys().then(keyList =>
            Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && !whiteCacheList.includes(key)) {
                        console.log('[ServiceWorker] Removing old cache', key)
                        return caches.delete(key)
                    }
                })
            )
        )
    )
})

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url)

    if (url.origin === location.origin && url.pathname === '/dog.svg') {
        event.respondWith(caches.match('./horse.svg'))
    }
})
