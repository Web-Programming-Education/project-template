benchmarks = [];

function handleRouterNavigation(event) {
  console.log(`Route navigated to ${JSON.stringify(event.detail)}`)
}

function renderBenchmarks(event) {
  document.querySelectorAll('#benchmarks table .result-row').forEach(e => e.remove());
  const table = document.querySelector('#benchmarks table');
  benchmarks.forEach(b => {
    const detailLink = document.createElement('button');
    detailLink.textContent = '>';
    detailLink.onclick = () => gotoPage(`/benchmarks/${b.name}`);
    const name = document.createElement('td');
    name.textContent = b.name;
    const result = document.createElement('td');
    result.textContent = b.result;
    const detailButtonCol = document.createElement('td');
    detailButtonCol.appendChild(detailLink);

    const tableRow = document.createElement('tr');
    tableRow.className = 'result-row';
    tableRow.appendChild(name);
    tableRow.appendChild(result);
    tableRow.appendChild(detailButtonCol);

    table.appendChild(tableRow);
  })
}

function renderBenchmarkDetails(event) {
  const name = event.detail.params.name;
  const benchmark = benchmarks.find(b => b.name === name);

  if (benchmark === undefined) {
    alert("Benchmark not found!");
    gotoPage("/");
  } else {
    const detailPage = document.querySelector('#benchmark-details');
    document.querySelectorAll('#benchmark-details *').forEach(e => e.remove());
    const h1 = document.createElement('h1');
    h1.textContent = benchmark.name;
    const p = document.createElement('p');
    p.textContent = benchmark.result;
    const back = document.createElement('button');
    back.textContent = "Back";
    back.onclick = () => gotoPage('/');

    detailPage.appendChild(h1);
    detailPage.appendChild(p);
    detailPage.appendChild(back);
  }
}

function submitBenchmark(event) {
  event.preventDefault();

  const form = document.forms['new-benchmark']
  const name = form.elements['benchmark-name'].value;
  const result = form.elements['benchmark-result'].value;

  const benchmark = {
    name,
    result
  }

  benchmarks.push(benchmark);
  form.reset();
  gotoPage('/')
}

document.addEventListener("DOMContentLoaded", function() {
  // general event listener, triggered for all navigation events
  window.addEventListener('navigation', handleRouterNavigation);

  // register specific handler for one page,
  // e.g. because it requires params to be set in it's content
  const page1 = document.querySelector('#benchmarks');
  page1.addEventListener('navigation', renderBenchmarks);

  const detailPage = document.querySelector('#benchmark-details');
  detailPage.addEventListener('navigation', renderBenchmarkDetails);

  // register your routes
  registerRoute('/', 'benchmarks');
  registerRoute('/new-benchmark', 'new-benchmark');
  registerRoute('/benchmarks/:name', 'benchmark-details', (p) => benchmarks.some(b => b.name === p.name))

  // trigger the initial page navigation after routes are registered
  // reads the url an navigates to the given page
  doInitialNavigation();
});