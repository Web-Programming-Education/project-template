function handleRouterNavigation(event) {
  console.log(`Route navigated to ${JSON.stringify(event.detail)}`)
}

/**
 * Custom example event handler for page 1. Set the text content of a span.
 * @param {*} event
 */
function setPage1Params(event) {
  const textElement = document.querySelector('#page-1-id');
  if (event.detail.params.id) {
    textElement.textContent = event.detail.params.id
  } else {
    textElement.textContent = '<none>'
  }
}

document.addEventListener("DOMContentLoaded", function() {
  // general event listener, triggered for all navigation events
  window.addEventListener('navigation', handleRouterNavigation);

  // register specific handler for one page,
  // e.g. because it requires params to be set in it's content
  const page1 = document.querySelector('#example-page-1');
  page1.addEventListener('navigation', setPage1Params);

  // register your routes
  registerRoute('/', 'example-page-1');
  registerRoute('/page1/:id', 'example-page-1', (params) => Promise.resolve(false));
  registerRoute('/page2', 'example-page-2');

  // trigger the initial page navigation after routes are registered
  // reads the url an navigates to the given page
  doInitialNavigation();
});