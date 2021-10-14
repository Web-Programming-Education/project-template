function renderBenchmarkOverviewRow(table, benchmark) {
  const frameworkName = document.createElement("td");
  frameworkName.textContent = benchmark.name;
  const score = document.createElement("td");
  score.textContent = benchmark.score;

  const row = document.createElement("tr");
  row.classList.add("benchmark-result");
  row.appendChild(frameworkName);
  row.appendChild(score);

  table.appendChild(row);
}

function removeElements(elementSelector) {
  const results = document.querySelectorAll(elementSelector);
  for(const result of results) {
    result.remove();
  }
}

async function renderBenchmarkOverview() {
  console.log("Rerender benchmarks")

  const result = await fetch("/api/benchmarks");
  const benchmarks = await result.json();

  const table = document.querySelector("#benchmarks-overview table");

  removeElements("#benchmarks-overview .benchmark-result")

  benchmarks.forEach(benchmark => {
    renderBenchmarkOverviewRow(table, benchmark)
  });
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

  // trigger the initial page navigation after routes are registered
  // reads the url an navigates to the given page
  registerRoute("/", "benchmarks-overview");
  registerRoute("/benchmarks", "benchmarks-overview");
  registerRoute("/benchmarks/add", "add-benchmark");

  doInitialNavigation();
});