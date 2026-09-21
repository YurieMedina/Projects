//code to display the inputs
//ps: This was supposed to be a global script but i used it for inputs lol.

let algorithm = document.getElementById("algorithmSelect");
let inputHolder = document.getElementById("inputHolder");
let btnPrint = document.getElementById("btnPrint");
let btnDonate = document.getElementById("btnDonate");
let donateModal = document.getElementById("donateModal");
let closeDonateModal = document.getElementById("closeDonateModal");
let btnAbout = document.getElementById("btnAbout");
let aboutModal = document.getElementById("aboutModal");
let closeAboutModal = document.getElementById("closeAboutModal");

if (algorithm) {
    changeContent(algorithm);
    algorithm.addEventListener('change', () => {
        changeContent(algorithm);
    });
}

function handlePrint() {
    const report = localStorage.getItem("schedulerReport");
    if (!report) {
        alert("Please solve a scheduling problem before printing.");
        return;
    }
    window.open("print.html", "_blank", "width=900,height=700");
}

if (btnPrint) {
    btnPrint.addEventListener("click", handlePrint);
}

if (btnDonate) {
    btnDonate.addEventListener("click", () => {
        if (donateModal) {
            donateModal.classList.remove("hidden");
            donateModal.setAttribute("aria-hidden", "false");
        }
    });
}

if (closeDonateModal) {
    closeDonateModal.addEventListener("click", () => {
        if (donateModal) {
            donateModal.classList.add("hidden");
            donateModal.setAttribute("aria-hidden", "true");
        }
    });
}

if (btnAbout) {
    btnAbout.addEventListener("click", () => {
        if (aboutModal) {
            aboutModal.classList.remove("hidden");
            aboutModal.setAttribute("aria-hidden", "false");
        }
    });
}

if (closeAboutModal) {
    closeAboutModal.addEventListener("click", () => {
        if (aboutModal) {
            aboutModal.classList.add("hidden");
            aboutModal.setAttribute("aria-hidden", "true");
        }
    });
}

if (donateModal) {
    donateModal.addEventListener("click", (event) => {
        if (event.target === donateModal) {
            donateModal.classList.add("hidden");
            donateModal.setAttribute("aria-hidden", "true");
        }
    });
}

if (aboutModal) {
    aboutModal.addEventListener("click", (event) => {
        if (event.target === aboutModal) {
            aboutModal.classList.add("hidden");
            aboutModal.setAttribute("aria-hidden", "true");
        }
    });
}

//functions
function changeContent(algorithm){
    if (!inputHolder) return;
    inputHolder.innerHTML = ''; //removes child of input holder class at the start so that there are no duplicates
    //displays default inputs of algorithms
    display_inputs("ArrivalTimes", "Arrival Times:","e.g. 0 1 2 3 4 5"); 
    display_inputs("BurstTimes", "Burst Times:","e.g. 0 1 2 3 4 5");
    //adds another input when the value is the following:
    switch (algorithm.value) {
        case "RR":
            display_inputs("TimeQuantum", "Time Quantum: ","e.g. 1");
            break;
        case "PREEMPTIVE":
            display_inputs("Priorities", "Priorities: ","e.g. Lower # = Higher Priority");
            break;
        case "NONPREEMPTIVE":
            display_inputs("Priorities", "Priorities: ","e.g. Lower # = Higher Priority");
            break;
    }
}

function display_inputs(id, inputTitle, placeholder) {
    if (!inputHolder) return;
    //variables
    let algorithm_div = document.createElement("div");
    let label = document.createElement("label");
    let p = document.createElement("p");
    let inputs = document.createElement("input");

    //appends child to respective parent
    algorithm_div.classList.add("Algorithm_Group");
    p.textContent = inputTitle;
    label.appendChild(p);
    algorithm_div.appendChild(label) 
    inputs.id = id;
    inputs.type = "search";
    inputs.placeholder = placeholder;
    algorithm_div.appendChild(inputs);

    //displays
    let input = algorithm_div.cloneNode(true);
    inputHolder.append(input);

}




