const fs = require('fs');
let code = fs.readFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/components/modal/SettingsModal.tsx', 'utf8');

// Remove the sync NavRow
code = code.replace(/<SettingsNavRow\s*title=\{t\('sync\.label'\)\}[\s\S]*?onPress=\{\(\) => pushPage\('sync'\)\}\s*\/>/, '');

fs.writeFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/components/modal/SettingsModal.tsx', code);
