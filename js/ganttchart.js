let chart_holder = document.getElementById("chartHolder");
let table_holder = document.getElementById("tableHolder");
let solution_holder = document.getElementById("solutionHolder");
let output_message = document.getElementById("outputMessage");
let algorithm_badge = document.getElementById("algorithmBadge");

function savePrintReport(algorithmName, metrics, schedule) {
    const report = {
        algorithm: algorithmName,
        generatedAt: new Date().toLocaleString(),
        schedule,
        metrics
    };

    localStorage.setItem("schedulerReport", JSON.stringify(report));
}

function Solve() {
    let arrivals = parseNumbers("ArrivalTimes");
    let bursts = parseNumbers("BurstTimes");
    let priorities = parseNumbers("Priorities");
    let quantum = parseNumbers("TimeQuantum")[0];
    if (!arrivals.length || arrivals.some(value => !Number.isFinite(value) || value < 0) || arrivals.length !== bursts.length || bursts.some(value => !Number.isFinite(value) || value <= 0)) {
        alert("Enter matching non-negative arrival times and positive burst times.");
        return;
    }
    if (["PREEMPTIVE", "NONPREEMPTIVE"].includes(algorithm.value) && (priorities.length !== arrivals.length || priorities.some(value => !Number.isFinite(value) || value < 0))) {
        alert("Enter one non-negative priority for each process.");
        return;
    }
    if (algorithm.value === "RR" && (!quantum || quantum <= 0)) {
        alert("Enter a positive time quantum.");
        return;
    }
    let processes = arrivals.map((arrival, index) => ({ id: `P${index + 1}`, arrival, burst: bursts[index], priority: priorities[index] ?? 0, remaining: bursts[index], order: index }));
    let schedule = createSchedule(processes, algorithm.value, quantum);
    let metrics = calculateMetrics(processes, schedule);
    renderChart(schedule);
    renderTable(metrics);
    renderSolution(schedule, metrics);
    savePrintReport(algorithm.value, metrics, schedule);
    algorithm_badge.textContent = algorithm.value === "PREEMPTIVE" ? "Priority (Preemptive)" : algorithm.value === "NONPREEMPTIVE" ? "Priority (Non-Preemptive)" : algorithm.value;
}

function parseNumbers(id) {
    let input = document.getElementById(id);
    return input ? input.value.trim().split(/\s+/).filter(Boolean).map(Number) : [];
}

function createSchedule(processes, selectedAlgorithm, quantum) {
    if (selectedAlgorithm === "FCFS") return nonPreemptive(processes, () => 0);
    if (selectedAlgorithm === "SJF") return nonPreemptive(processes, process => process.burst);
    if (selectedAlgorithm === "NONPREEMPTIVE") return nonPreemptive(processes, process => process.priority);
    if (selectedAlgorithm === "SRTF") return preemptive(processes, (left, right) => left.remaining - right.remaining);
    if (selectedAlgorithm === "PREEMPTIVE") return preemptive(processes, (left, right) => left.priority - right.priority);
    return roundRobin(processes, quantum);
}

function available(processes, time) {
    return processes.filter(process => process.remaining > 0 && process.arrival <= time);
}

function nonPreemptive(processes, score) {
    let time = 0, complete = 0, schedule = [];
    while (complete < processes.length) {
        let candidates = available(processes, time).sort((left, right) => score(left) - score(right) || left.arrival - right.arrival || left.order - right.order);
        if (!candidates.length) {
            let next = processes.filter(process => process.remaining > 0).sort((left, right) => left.arrival - right.arrival)[0];
            addSegment(schedule, "Idle", time, next.arrival);
            time = next.arrival;
            continue;
        }
        let process = candidates[0];
        addSegment(schedule, process.id, time, time + process.remaining);
        time += process.remaining;
        process.remaining = 0;
        complete++;
    }
    return schedule;
}

function preemptive(processes, compare) {
    let time = 0, complete = 0, schedule = [];
    while (complete < processes.length) {
        let candidates = available(processes, time).sort((left, right) => compare(left, right) || left.arrival - right.arrival || left.order - right.order);
        if (!candidates.length) {
            let next = processes.filter(process => process.remaining > 0).sort((left, right) => left.arrival - right.arrival)[0];
            addSegment(schedule, "Idle", time, next.arrival);
            time = next.arrival;
            continue;
        }
        let process = candidates[0];
        let nextArrival = processes.filter(item => item.remaining > 0 && item.arrival > time).sort((left, right) => left.arrival - right.arrival)[0]?.arrival ?? Infinity;
        let duration = Math.min(process.remaining, nextArrival - time);
        addSegment(schedule, process.id, time, time + duration);
        process.remaining -= duration;
        time += duration;
        if (process.remaining === 0) complete++;
    }
    return schedule;
}

function roundRobin(processes, quantum) {
    let time = 0, complete = 0, queue = [], schedule = [];
    while (complete < processes.length) {
        enqueueArrivals(processes, queue, time);
        if (!queue.length) {
            let next = processes.filter(process => process.remaining > 0).sort((left, right) => left.arrival - right.arrival)[0];
            addSegment(schedule, "Idle", time, next.arrival);
            time = next.arrival;
            continue;
        }
        let process = queue.shift();
        let duration = Math.min(quantum, process.remaining);
        addSegment(schedule, process.id, time, time + duration);
        process.remaining -= duration;
        time += duration;
        enqueueArrivals(processes, queue, time, process);
        if (process.remaining > 0) queue.push(process); else complete++;
    }
    return schedule;
}

function enqueueArrivals(processes, queue, time, excluded) {
    processes.filter(process => process.remaining > 0 && process.arrival <= time && process !== excluded && !queue.includes(process)).sort((left, right) => left.arrival - right.arrival || left.order - right.order).forEach(process => queue.push(process));
}

function addSegment(schedule, id, start, end) {
    if (end <= start) return;
    let previous = schedule[schedule.length - 1];
    if (previous && previous.id === id && previous.end === start) previous.end = end;
    else schedule.push({ id, start, end });
}

function calculateMetrics(processes, schedule) {
    return processes.map(process => {
        let segments = schedule.filter(segment => segment.id === process.id);
        let completion = Math.max(...segments.map(segment => segment.end));
        let turnaround = completion - process.arrival;
        return { ...process, completion, turnaround, waiting: turnaround - process.burst, response: segments[0].start - process.arrival };
    });
}

function renderChart(schedule) {
    chart_holder.innerHTML = "";
    document.querySelectorAll(".chart_times").forEach(times => times.remove());
    let times = document.createElement("div");
    times.className = "chart_times";
    let columns = schedule.map(segment => `${segment.end - segment.start}fr`).join(" ");
    chart_holder.style.gridTemplateColumns = columns;
    times.style.gridTemplateColumns = columns;
    schedule.forEach(segment => {
        let block = document.createElement("div");
        block.className = `process_block${segment.id === "Idle" ? " idle" : ""}`;
        block.innerHTML = `<span>${segment.id}</span>`;
        chart_holder.append(block);
        let time = document.createElement("span");
        time.textContent = segment.start;
        times.append(time);
    });
    let finalTime = document.createElement("span");
    finalTime.textContent = schedule[schedule.length - 1].end;
    times.append(finalTime);
    chart_holder.after(times);
}

function renderTable(metrics) {
    let averageTurnaround = metrics.reduce((sum, process) => sum + process.turnaround, 0) / metrics.length;
    let averageWaiting = metrics.reduce((sum, process) => sum + process.waiting, 0) / metrics.length;
    table_holder.innerHTML = `<table class="result_table"><thead><tr><th>Job</th><th>Arrival Time</th><th>Burst Time</th><th>Finish Time</th><th>Turnaround Time</th><th>Waiting Time</th></tr></thead><tbody>${metrics.map(process => `<tr><td>${process.id}</td><td>${process.arrival}</td><td>${process.burst}</td><td>${process.completion}</td><td>${process.turnaround}</td><td>${process.waiting}</td></tr>`).join("")}<tr class="average_row"><td colspan="4">Average</td><td>${averageTurnaround.toFixed(2)}</td><td>${averageWaiting.toFixed(2)}</td></tr></tbody></table>`;
}

function renderSolution(schedule, metrics) {
    solution_holder.innerHTML = `<p><strong>Execution order:</strong> ${schedule.map(segment => `${segment.id} (${segment.start}-${segment.end})`).join(" &rarr; ")}</p><p><strong>Formulas:</strong> TAT = CT - AT; WT = TAT - BT; RT = first start - AT.</p><p>${metrics.map(process => `${process.id}: TAT ${process.turnaround}, WT ${process.waiting}, RT ${process.response}`).join(" | ")}</p>`;
}