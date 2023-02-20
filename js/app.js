const context = document.getElementById("data-set").getContext("2d");
let line = new Chart(context, {});
//Values from form
const initialAmount = document.getElementById("initialAmount");
const investmentYears = document.getElementById("investmentYears");
const monthlyDeposit = document.getElementById("monthlyDeposit");
const rates = document.getElementById("rates");
const savingsLengthChoise = document.getElementById("savingsLengthChoise");

//Messages
const message = document.getElementById("message");
const monthsMessage = document.getElementById("months-message");

const data = [];
const labels = [];

const button = document.querySelector(".input-group button");


//Attach and event listener
button.addEventListener("click",calculateGrowth);

function calculateGrowth(e) {
  if (data.length > 0){
    clearTable(document.getElementById("results-table"));
  }
  
  e.preventDefault();
  data.length = 0;
  labels.length = 0;
  let growth = 0;
  let periodChoise = parseInt(savingsLengthChoise.value);
  try {
    const initial = parseInt(initialAmount.value);
    const repeated = parseInt(monthlyDeposit.value);
    const period = parseInt(investmentYears.value);
    let interest = parseInt(rates.value) / 100;
    let final;

    createTable();
    //Secure that initial amount will always have value
    if (initial) {
      final = initial;
    } else {
      final = 0;
    }
    data.push(final);

    //Secure that every important inputs will be filled up, if not, that warning
    if (!initial && !interest && !initial) {
      document.getElementById("initial-warning").style.visibility = "visible";
      document.getElementById("rates-warning").style.visibility = "visible";
      document.getElementById("duration-warning").style.visibility = "visible";
    } else if (!initial && !interest && period) {
      document.getElementById("initial-warning").style.visibility = "visible";
      document.getElementById("rates-warning").style.visibility = "visible";
      document.getElementById("duration-warning").style.visibility = "hidden";
    } else if (!initial && interest && period) {
      document.getElementById("initial-warning").style.visibility = "visible";
      document.getElementById("rates-warning").style.visibility = "hidden";
      document.getElementById("duration-warning").style.visibility = "hidden";
    } else if (initial && !interest && !period) {
      document.getElementById("initial-warning").style.visibility = "hidden";
      document.getElementById("rates-warning").style.visibility = "visible";
      document.getElementById("duration-warning").style.visibility = "visible";
    } else if (initial && !interest && period) {
      document.getElementById("initial-warning").style.visibility = "hidden";
      document.getElementById("rates-warning").style.visibility = "visible";
      document.getElementById("duration-warning").style.visibility = "hidden";
    } else if (initial && interest && !period) {
      document.getElementById("initial-warning").style.visibility = "hidden";
      document.getElementById("rates-warning").style.visibility = "hidden";
      document.getElementById("duration-warning").style.visibility = "visible";
    } else if (!initial && interest && !period) {
      document.getElementById("initial-warning").style.visibility = "visible";
      document.getElementById("rates-warning").style.visibility = "hidden";
      document.getElementById("duration-warning").style.visibility = "visible";
    } else {
      document.getElementById("initial-warning").style.visibility = "hidden";
      document.getElementById("rates-warning").style.visibility = "hidden";
      document.getElementById("duration-warning").style.visibility = "hidden";
    }

    for (let i = 0; i <= period; i++) {
      if (periodChoise == 2) {
        final = final + repeated;
        let check = (i + 1) / 12;
        if (check - Math.floor(check) == 0) {
          final = final * (1 + interest);
        }
        labels.push(i + ". Měsíc");
      } else {
        final = final + 12 * repeated;
        final = final * (1 + interest);
        labels.push(i + ". Rok");
      }
      data.push(toDecimal(final, 2));

      if (i != period) {
        growth = toDecimal(final, 2);
      }

      insertRow(labels[i], data[i]);
    }
    data.splice(-1);
    if (periodChoise == 2) {
      message.innerText = `Na konci investiční doby budete mít ${growth} Kč po ${period} měsících.`;
      if(period < 12){
        monthsMessage.style.visibility = 'visible';
        monthsMessage.innerText = 'Délka investice nepřesáhla 1rok, proto nelze vidět žádné roční zúročení!';
      }else{
        monthsMessage.style.visibility = 'hidden';
      }
    } else {
      monthsMessage.style.visibility = 'hidden';
      message.innerText = `Na konci investiční doby budete mít ${growth} Kč po ${period} letech.`;
    }

    // Chart expresion after successfully calculation
    drawGraph(initial, interest, period);

    //
  } catch (error) {
    console.error(error);
  }
}

function drawGraph(initial, interest, period) {
  if (initial && interest && period) {
    document.getElementById("chart-area").style.visibility = "visible";
      } else {
    document.getElementById("chart-area").style.visibility = "hidden";
    document.getElementById('results-table-section').style.visibility = 'hidden';
    clearTable(document.getElementById("results-table"));

  }

  line.destroy();
  line = new Chart(context, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Růst investice",
          data,
          fill: true,
          backgroundColor: "#82C3EC",
          borderWidth: 2,
        },
      ],
    },
  });
}

function toDecimal(value, decimals) {
  return parseInt(value.toFixed(decimals));
}

//Creates results table
function createTable() {
  let section = document.getElementById('results-table-section');
  section.style.visibility = 'visible';
  let resultsTable = `<table id="results-table">
                        <thead>
                          <tr>
                            <th>Období</th>
                            <th>Hodnota portfolia</th>
                          </tr>
                        </thead>
                      <tbody id="results-table-body">

                      </tbody>
                    </table>`;
  document.getElementById("table-container").innerHTML += resultsTable;
  
}

//Inserts data into results table
function insertRow(time, value) {
  let tableRow = `<tr>
                    <td>${time}</td>
                    <td>${value} Kč</td>
                </tr>`;
  document.getElementById("results-table-body").innerHTML += tableRow;
}

//Clears table if calculation goes wrong
function clearTable(tableFromFunction) {
  
  let table = tableFromFunction;
  let tableContainer = document.getElementById("table-container");
  tableContainer.removeChild(table);
}
