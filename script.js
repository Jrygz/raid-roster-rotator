let signups = { tanks: [], healers: [], dps: [] };
let history = {};
let currentWeek = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadHistory();

  const loadBtn = document.getElementById('loadBtn');
  const rotateBtn = document.getElementById('rotateBtn');
  const saveBtn = document.getElementById('saveBtn');

  console.log('DOM loaded. Buttons:', { loadBtn, rotateBtn, saveBtn });

  loadBtn.addEventListener('click', () => {
    console.log('Load button clicked');
    loadCSV();
  });

  rotateBtn.addEventListener('click', () => {
    console.log('Rotate button clicked');
    rotateTeam();
  });

  saveBtn.addEventListener('click', () => {
    console.log('Save button clicked');
    saveResults();
  });
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
    
    // Split by newlines and filter empty lines
    const lines = csv.split('\n').filter(line => line.trim().length > 0);
    
    console.log('Total lines:', lines.length);
    console.log('First few lines:', lines.slice(0, 3));
    
    // Process all lines (PapaParse processes header automatically, but we handle it manually)
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Remove surrounding quotes if present
      if ((line.startsWith('"') && line.endsWith('"')) || (line.startsWith("'") && line.endsWith("'"))) {
        line = line.slice(1, -1);
      }
      
      // Skip header row
      if (line.toLowerCase().includes('name') && line.toLowerCase().includes('role')) {
        console.log('Found header row:', line);
        continue;
      }
      
      // Split by comma
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      
      if (parts.length >= 2) {
        const name = parts[0];
        const role = parts[1].toLowerCase();
        
        console.log('Processing:', name, role);
        
        if (name && role) {
          if (role === 'tank') signups.tanks.push(name);
          else if (role === 'healer') signups.healers.push(name);
          else if (role === 'dps') signups.dps.push(name);
        }
      }
    }
    
    console.log('Loaded signups:', signups);
    
    if (signups.tanks.length === 0 && signups.healers.length === 0 && signups.dps.length === 0) {
      alert('No players loaded. Check your CSV format. Open the browser console (F12) for details.');
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

  console.log('Starting rotation with signups:', signups);
  console.log('Required:', required);

  for (const role in required) {
    const pool = signups[role];
    console.log(`${role} pool:`, pool);
    
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

    console.log(`${role} sorted:`, sorted);
    
    const numToSelect = required[role];
    console.log(`Selecting ${numToSelect} ${role} from sorted list`);
    
    selected[role] = sorted.slice(0, numToSelect);
    benched[role] = sorted.slice(numToSelect);
    
    console.log(`${role} SELECTED (${selected[role].length}):`, selected[role]);
    console.log(`${role} BENCHED (${benched[role].length}):`, benched[role]);
  }

  console.log('FINAL SELECTION:', selected);
  console.log('FINAL BENCH:', benched);

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
  console.log('Displaying results - selected:', selected);
  console.log('Displaying results - benched:', benched);
  
  const roles = ['tanks', 'healers', 'dps'];

  roles.forEach(role => {
    const selUl = document.getElementById(`selected-${role}-ul`);
    selUl.innerHTML = '';
    console.log(`Adding ${selected[role].length} ${role} to selected list:`, selected[role]);
    selected[role].forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      selUl.appendChild(li);
    });

    const benchUl = document.getElementById(`benched-${role}-ul`);
    benchUl.innerHTML = '';
    console.log(`Adding ${benched[role].length} ${role} to benched list:`, benched[role]);
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