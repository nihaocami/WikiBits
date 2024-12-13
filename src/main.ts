import Swiper from "swiper";
import "@khmyznikov/pwa-install";
const swipeWrapper = document.querySelector(".swiper-wrapper");
// Function to fetch a random Wikipedia topic
async function getRandomTopic() {
  const response = await fetch(
    "https://en.wikipedia.org/api/rest_v1/page/random/summary"
  );
  const data = await response.json();
  return data;
}

// Function to create the HTML structure for a topic
function createTopicElement(topicData: any) {
  const topicDiv = document.createElement("div");
  topicDiv.className = "swiper-slide";
  topicDiv.innerHTML = `
        <h1>${topicData.title}</h1>
        <p>${topicData.extract.slice(0, 500)}...</p>
        <a href="${
          topicData.content_urls.desktop.page
        }" target="_blank">Read more</a>
    `;
  return topicDiv;
}

// Function to load and append new topics
async function loadNextTopic() {
  const topicData = await getRandomTopic();
  const topicElement = createTopicElement(topicData);

  // Append the new topic to the swipe wrapper
  swipeWrapper?.appendChild(topicElement);
  swiper.update();
}

// Initialize the first topic when the page loads
loadNextTopic();
loadNextTopic();
loadNextTopic();
let scrollTimeout: any;
var swiper = new Swiper(".mySwiper", {
  direction: "vertical",
  slidesPerView: 1,
  mousewheel: {
    forceToAxis: true,
    thresholdDelta: 35,
  },
  on: {
    scroll: (swiper, e) => {
      const deltaY = Math.abs(e.deltaY); // left or right
      const threshold = 50; // Adjust the threshold as needed

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (deltaY > threshold) swiper.mousewheel?.enable();
      }, 1000);

      if (deltaY > threshold) {
        swiper.mousewheel?.disable(); // stops the initial scroll
      }
    },
    reachEnd: () => {
      loadNextTopic();
    },
  },
});
setTimeout(() => {
  swiper.update();
}, 1000);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
