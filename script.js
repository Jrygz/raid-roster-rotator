let signups = { tanks: [], healers: [], dps: [] };
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

  const reader = new FileReader();
  reader.onload = function(e) {
    const csv = e.target.result;
    signups = { tanks: [], healers: [], dps: [] };
    
    // Split by newlines
    const lines = csv.split('\n').filter(line => line.trim().length > 0);
    
    // Remove quotes from lines if present
    const cleanLines = lines.map(line => {
      if (line.startsWith('"') && line.endsWith('"')) {
        return line.slice(1, -1);
      }
      return line;
    });
    
    // Skip header row and process data
    for (let i = 1; i < cleanLines.length; i++) {
      const parts = cleanLines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const role = parts[1].toLowerCase();
        
        if (name && role) {
          if (role === 'tank') signups.tanks.push(name);
          else if (role === 'healer') signups.healers.push(name);
          else if (role === 'dps') signups.dps.push(name);
        }
      }
    }
    
    if (signups.tanks.length === 0 && signups.healers.length === 0 && signups.dps.length === 0) {
      alert('No players loaded. Check that your CSV has "name" and "role" columns.');
      return;
    }
    
    displaySignups();
    document.getElementById('rotate-section').style.display = 'block';
  };
  reader.readAsText(file);
}

function displaySignups() {
  const tanksUl = document.getElementById('tanks-ul');
  tanksUl.innerHTML = '';
  signups.tanks.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    tanksUl.appendChild(li);
  });

  const healersUl = document.getElementById('healers-ul');
  healersUl.innerHTML = '';
  signups.healers.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    healersUl.appendChild(li);
  });

  const dpsUl = document.getElementById('dps-ul');
  dpsUl.innerHTML = '';
  signups.dps.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    dpsUl.appendChild(li);
  });

  document.getElementById('signups-list').style.display = 'block';
}

function rotateTeam() {
  const required = { tanks: 3, healers: 5, dps: 17 };
  const selected = { tanks: [], healers: [], dps: [] };
  const benched = { tanks: [], healers: [], dps: [] };

  for (const role in required) {
    const pool = signups[role];
    if (pool.length < required[role]) {
      alert(`Not enough ${role} sign-ups. Need at least ${required[role]}.`);
      return;
    }

    // Sort by lastSelected ascending (oldest first)
    const sorted = pool.slice().sort((a, b) => {
      const aLast = history[a] || 0;
      const bLast = history[b] || 0;
      if (aLast !== bLast) return aLast - bLast;
      return Math.random() - 0.5;
    });

    selected[role] = sorted.slice(0, required[role]);
    benched[role] = sorted.slice(required[role]);
  }

  // Update history
  for (const role in selected) {
    selected[role].forEach(name => {
      history[name] = currentWeek;
    });
  }
  currentWeek++;

  displayResults(selected, benched);
  saveHistory();
}

function displayResults(selected, benched) {
  const roles = ['tanks', 'healers', 'dps'];

  roles.forEach(role => {
    const selUl = document.getElementById(`selected-${role}-ul`);
    selUl.innerHTML = '';
    selected[role].forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      selUl.appendChild(li);
    });

    const benchUl = document.getElementById(`benched-${role}-ul`);
    benchUl.innerHTML = '';
    benched[role].forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      benchUl.appendChild(li);
    });
  });

  document.getElementById('results').style.display = 'block';
}

function saveResults() {
  // For now, just alert. Could save to file or something.
  alert('Results saved locally.');
}