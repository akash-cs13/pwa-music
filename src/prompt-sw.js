import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'



self.addEventListener('message', (event) => {

    if (event.data && event.data.type === 'SKIP_WAITING')

        self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist
if (import.meta.env.DEV)
    allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist },
))