const cacheName = 'QiaSoft-Dictionaries-v1'

self.addEventListener('activate', (event) => {
	event.waitUntil(self.caches.keys().then((keyList) => {
		return Promise.all(keyList.map((key) => {
			if (key === cacheName) { return }
			return caches.delete(key)
		}))
	}))
})

self.addEventListener('fetch', (event) => {
	event.respondWith((async () => {
		let request = await self.caches.match(event.request)
		if (request) return request

		response = await self.fetch(event.request)
		const cache = await self.caches.open(cacheName)
		cache.put(event.request, response.clone())
		return response
	})())
})
