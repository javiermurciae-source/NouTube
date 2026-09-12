const fs = require('fs');
let code = fs.readFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/components/modal/SettingsModalTabSettings.tsx', 'utf8');

// Remove the App Lock setting from the UI
const regex = /<SettingsButton[\s\S]*?label=\{settings\.appLockPinHash[\s\S]*?ui\$\.appLockSetupOpen\.set\(true\)\}\n\s*\/>/m;
code = code.replace(regex, '{/* App Lock hidden */}');

fs.writeFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/components/modal/SettingsModalTabSettings.tsx', code);
