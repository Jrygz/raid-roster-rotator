# Raid Rotator

A desktop application for rotating World of Warcraft raid teams fairly.

## Features

- Upload CSV of weekly sign-ups
- Automatic rotation prioritizing benched players
- Track participation history
- Standalone executable for Mac and Windows

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm start` to launch the app

## Building

Run `npm run dist` to build executables.

## Usage

1. Upload a CSV file with player sign-ups. The CSV should have headers and two columns:
   - `name`: Player name
   - `role`: Player role (tank, healer, or dps)
   
   Example CSV:
   ```
   name,role
   Player1,tank
   Player2,healer
   Player3,dps
   ```

2. Click "Load Sign-ups" to display the list grouped by role
3. Click "Rotate Team" to select 3 tanks, 5 healers, and 17 DPS fairly
4. View the selected team and benched players
5. Results are saved automatically