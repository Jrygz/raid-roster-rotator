# Web Version Quick Start

## Step 1: Start the Web Server
Open your terminal and run:
```
cd /Users/jamesrigby/Desktop/RaidRotator
python3 -m http.server 8000
```

You should see:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

## Step 2: Open in Browser
Click this link or paste it in your browser:
```
http://localhost:8000
```

You should see the Raid Rotator app with a file upload button.

## Step 3: Prepare Your CSV File
Make sure your CSV file looks like this (no extra quotes around rows):
```
name,role
Thunderfist,tank
Ironwall,tank
HolyLight,healer
Shadowbolt,dps
```

Use the `clean_example.csv` file we created - it's already formatted correctly.

## Step 4: Upload and Rotate
1. Click "Choose File" and select your CSV
2. Click "Load Sign-ups" 
3. You should see players listed under Tanks, Healers, and DPS
4. Click "Rotate Team"
5. View selected players and benched players

## Step 5: Stop the Server
When done, press `Ctrl+C` in the terminal to stop the server.

## Troubleshooting
- If players don't load, check browser console (F12 → Console tab) for errors
- Make sure CSV has exactly 2 columns: `name` and `role`
- Don't add extra quotes or spaces around the data
- Role must be exactly: `tank`, `healer`, or `dps` (lowercase)
