<script setup lang="ts">
import H from "@here/maps-api-for-javascript"
import { Icon } from '@iconify/vue';
import { onMounted, reactive } from "vue";
import { useDirectionStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter()
const direction = useDirectionStore()
const summary = reactive({
  duration: "",
  distance: "",
  length: 0
})

onMounted(async () => {
  console.log(direction.origin, direction.destination)
  if (!direction.origin || !direction.destination) {
    router.push("/")
    return
  }

  // initializeHereMap()
  initializeRoutingMap()
  Object.assign(summary, await getSummary())
  console.log(summary.duration)
  console.log(summary.distance)
})

const goBack = () => {
  router.push('/directions')
  direction.origin = ""
  direction.destination = ""
}

const initializeHereMap = () => {
  const platform = new H.service.Platform({
    apikey: import.meta.env.VITE_HERE_API_KEY
  })

  const maptypes = platform.createDefaultLayers();

  const map = new H.Map(
    document.getElementById("map") as HTMLElement,
    (maptypes as any).vector.normal.map,
    {
      zoom: 8,
      center: { lng: 90.39, lat: 23.77 },
      pixelRatio: window.devicePixelRatio
    }
  )

  addEventListener("resize", () => map.getViewPort().resize());

  new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
  H.ui.UI.createDefault(map, maptypes)
}

const initializeRoutingMap = () => {
  // Instantiate a map and platform object:
  var platform = new H.service.Platform({
    apikey: import.meta.env.VITE_HERE_API_KEY
  });

  // Retrieve the target element for the map:
  var targetElement = document.getElementById('map') as HTMLElement

  // Get the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate the map:
  var map = new H.Map(
    targetElement,
    (defaultLayers as any).vector.normal.map,
    {
      zoom: 3
    }
  );
  // Create the default UI:
  // const ui = H.ui.UI.createDefault(map, defaultLayers);

  addEventListener("resize", () => map.getViewPort().resize());

  // Create the parameters for the routing request:
  var routingParameters = {
    routingMode: 'fast',
    transportMode: 'car',
    // The start point of the route:
    origin: direction.origin,
    // The end point of the route:
    destination: direction.destination,
    // Include the route shape in the response
    return: 'polyline'
  };

  // Define a callback function to process the routing response:
  var onResult = function (result: any) {
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section: any) => {
        // Create a linestring to use as a point source for the route line
        let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

        // Create a polyline to display the route:
        let routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: 'blue', lineWidth: 3 }
        } as H.map.Spatial.Options);

        // Create a marker for the start point:
        let startMarker = new H.map.Marker(section.departure.place.location);

        // Create a marker for the end point:
        let endMarker = new H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() as H.geo.Rect });
      });
    }
  };

  // Get an instance of the routing service version 8:
  var router = platform.getRoutingService(undefined, 8);

  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function (error) {
      alert(error.message);
    });

  new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
  H.ui.UI.createDefault(map, targetElement)
};

const getPath = async () => {
  const baseURL = import.meta.env.VITE_APP_API_URL
  console.log(baseURL)
  try {
    const res = await fetch(`${baseURL}routing/${direction.origin}/${direction.destination}`, { mode: 'cors' })
    const data = await res.json()
    return data.routes[0].sections
  } catch (e) {
    console.log(e)
    return ""
  }
}

const getSummary = async () => {
  const path = await getPath()
  var length = 0
  var duration = 0
  for (const v of path) {
    length += v.summary.length
    duration += v.summary.length
  }

  const time = new Date(duration * 1000).toISOString().slice(11, 19);
  const [hours, minutes, seconds] = time.split(':');
  const distance = (length / 1000).toFixed(2) + " km"
  return {
    duration: `${hours} hour ${minutes} minutes`,
    distance: distance,
    length: length
  }
}

const calculatePrice = (multiplier: number, price: number) => {
  var res = (price / 900) * multiplier
  return res.toFixed(2)
}
</script>

<template>
  <div class="h-screen">
    <div class="absolute z-50 rounded-full bg-white p-1 top-8 left-4" @click="goBack()">
      <Icon icon="mdi:arrow-left" width="40" />
    </div>
    <div id="map" class="w-full h-[50vh]"></div>
    <div class="w-full">
      <w-full class="h-2 border-t"></w-full>
      <div class="w-full text-center border-t-2 p-1.5 text-gray-700 text-lg font-semibold">
        Distance - {{ summary.distance }}
      </div>
      <div class="h-[calc(50vh-120px)] absolute overflow-y-auto w-full">
        <div class="bg-gray-100">
          <div class="flex items-center px-4 py-5">
            <img src="/img/ride.png" alt="ride" width="75">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl">UberX</div>
                <div class="text-xl">${{ calculatePrice(1, summary.length) }}</div>
              </div>
              <div class="text-gray-500">{{ summary.duration }}</div>
            </div>
          </div>
        </div>

        <div class="">
          <div class="flex items-center px-4 py-5">
            <img src="/img/comfort.png" alt="ride" width="75">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl">Comfort</div>
                <div class="text-xl">${{ calculatePrice(1.25, summary.length) }}</div>
              </div>
              <div class="text-gray-500">{{ summary.duration }}</div>
            </div>
          </div>
        </div>

        <div class="">
          <div class="flex items-center px-4 py-5">
            <img src="/img/uberxl.png" alt="ride" width="75">
            <div class="w-full ml-3">
              <div class="flex items-center justify-between">
                <div class="text-2xl">UberXL</div>
                <div class="text-xl">${{ calculatePrice(1.5, summary.length) }}</div>
              </div>
              <div class="text-gray-500">{{ summary.duration }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center bg-white p-4 w-full absolute bottom-0 shadow-inner">
        <button class="bg-black text-2xl text-white p-4 rounded-sm w-full">Confirm UberX</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://js.api.here.com/v3/3.1/mapsjs-ui.css");

.H_imprint {
  display: none;
}
</style>
