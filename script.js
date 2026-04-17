let signups = [];
let history = {};
let currentWeek = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadHistory();

  document.getElementById('loadBtn').addEventListener('click', loadCSV);
  document.getElementById('rotateBtn').addEventListener('click', rotateTeam);
  document.getElementById('saveBtn').addEventListener('click', saveResults);
});

function loadHistory() {
  const hist = localStorage.getItem('raidHistory');
  if (hist) {
    history = JSON.parse(hist);
  }
  const week = localStorage.getItem('currentWeek');
  if (week) {
    currentWeek = parseInt(week);
  }
}

function saveHistory() {
  localStorage.setItem('raidHistory', JSON.stringify(history));
  localStorage.setItem('currentWeek', currentWeek.toString());
}

function loadCSV() {
  const file = document.getElementById('csvFile').files[0];
  if (!file) {
    alert('Please select a CSV file.');
    return;
  }

  Papa.parse(file, {
    complete: function(results) {
      signups = results.data.flat().filter(name => name.trim() !== '');
      displaySignups();
      document.getElementById('rotate-section').style.display = 'block';
    },
    header: false
  });
}

function displaySignups() {
  const ul = document.getElementById('signups-ul');
  ul.innerHTML = '';
  signups.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });
  document.getElementById('signups-list').style.display = 'block';
}

function rotateTeam() {
  if (signups.length < 25) {
    alert('Not enough sign-ups. Need at least 25.');
    return;
  }

  // Sort signups: by lastSelected ascending (oldest first), undefined first, then random
  const sorted = signups.slice().sort((a, b) => {
    const aLast = history[a] || 0;
    const bLast = history[b] || 0;
    if (aLast !== bLast) return aLast - bLast;
    return Math.random() - 0.5;
  });

  const selected = sorted.slice(0, 25);
  const benched = sorted.slice(25);

  // Update history
  selected.forEach(name => {
    history[name] = currentWeek;
  });
  currentWeek++;

  displayResults(selected, benched);
  saveHistory();
}

function displayResults(selected, benched) {
  const selUl = document.getElementById('selected-ul');
  selUl.innerHTML = '';
  selected.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    selUl.appendChild(li);
  });

  const benchUl = document.getElementById('benched-ul');
  benchUl.innerHTML = '';
  benched.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    benchUl.appendChild(li);
  });

  document.getElementById('results').style.display = 'block';
}

function saveResults() {
  // For now, just alert. Could save to file or something.
  alert('Results saved locally.');
}