const cacheName = 'QiaSoft-Dictionaries-v1.1'
const fileNamesToCache = ['jh-dict-cedict.js', 'jh-dict-cfdict.js', 'jh-dict-handedict.js']

self.addEventListener('activate', (event) => {
	event.waitUntil(self.caches.keys().then((keyList) => {
		return Promise.all(keyList.map((key) => {
			if (key === cacheName) { return }
			return caches.delete(key)
		}))
	}))
})

self.addEventListener('fetch', (event) => {
	const request = event.request

	const method = request.method
	if (!['GET'].includes(method)) return

	const url = new URL(request.url)
	const pathname = url.pathname
	if (!fileNamesToCache.some(fileName => pathname.endsWith(fileName))) return

	event.respondWith((async () => {
		let request = await self.caches.match(event.request)
		if (request) return request

		response = await self.fetch(event.request)
		const cache = await self.caches.open(cacheName)
		cache.put(event.request, response.clone())
		return response
	})())
})
