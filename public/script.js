function renderBenchmarkOverviewRow(table, benchmark, index) {
  const frameworkName = document.createElement("td");
  frameworkName.textContent = benchmark.name;
  const score = document.createElement("td");
  score.textContent = benchmark.score;

  const row = document.createElement("tr");
  row.classList.add("benchmark-result");
  row.appendChild(frameworkName);
  row.appendChild(score);

  row.addEventListener("click", function() {
    gotoPage(`/benchmarks/${index}`)
  })

  table.appendChild(row);
}

function removeElements(elementSelector) {
  const results = document.querySelectorAll(elementSelector);
  for(const result of results) {
    result.remove();
  }
}

async function fetchBenchmarks() {
  const result = await fetch("/api/benchmarks");

  if (!result.ok) {
    alert("Fehler beim Abruf der Benchmarks")
    return [];
  }

  const benchmarks = await result.json();
  return benchmarks;
}

async function renderBenchmarkOverview() {
  console.log("Rerender benchmarks")

  const benchmarks = await fetchBenchmarks();

  const table = document.querySelector("#benchmarks-overview table");

  removeElements("#benchmarks-overview .benchmark-result")

  benchmarks.forEach((benchmark, index) => {
    renderBenchmarkOverviewRow(table, benchmark, index)
  });
}

async function renderBenchmarkDetails(event) {
  const benchmarkId = event.detail.params.id;

  const benchmarks = await fetchBenchmarks();
  const benchmarkIndex = parseInt(benchmarkId);

  const benchmark = benchmarks[benchmarkIndex];
  if (benchmark === undefined) {
    alert("Benchmark existiert nicht!");
    gotoPage("/");
    return;
  }

  removeElements(`#${event.detail.pageId} h1`)
  removeElements(`#${event.detail.pageId} p`)

  const frameWorkName = document.createElement('h1');
  frameWorkName.textContent = benchmark.name;
  const score = document.createElement('p');
  score.textContent = `Der Score für das Framework "${benchmark.name}" ist: ${benchmark.score}`;

  const page = event.detail.pageElement;
  page.appendChild(frameWorkName);
  page.appendChild(score);
}

async function addBenchmark(event) {
  event.preventDefault();

  const form = document.forms["add-benchmark"];
  const name = form.elements["framework-name"].value;
  const score = form.elements["score"].value;

  const benchmark = {
    name: name,
    score: score
  };

  // TODO: ggf auslagern in eine Funktion `postJson` (siehe Slides), wenn mehrfach benötigt
  const result = await fetch("/api/benchmarks", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(benchmark)
  });

  // oder result.ok
  if(result.status >= 200 && result.status < 300) {
    form.reset();
    gotoPage("/");
  } else {
    alert("Anfrage fehlerhaft.");
  }

}

document.addEventListener("DOMContentLoaded", function() {
  const benchmarksOverview = document.querySelector("#benchmarks-overview");
  benchmarksOverview.addEventListener("navigation", renderBenchmarkOverview);

  const benchmarkDetails = document.querySelector("#benchmark-details");
  benchmarkDetails.addEventListener("navigation", renderBenchmarkDetails);

  // trigger the initial page navigation after routes are registered
  // reads the url an navigates to the given page
  registerRoute("/", "benchmarks-overview");
  registerRoute("/benchmarks", "benchmarks-overview");
  registerRoute("/benchmarks/:id", "benchmark-details");
  registerRoute("/benchmarks/add", "add-benchmark");

  doInitialNavigation();
});