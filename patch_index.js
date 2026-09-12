const fs = require('fs');
let code = fs.readFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/app/index.tsx', 'utf8');

code = code.replace(/const lockActive = Boolean\(lockHash && !unlocked\)/, 'const lockActive = !unlocked');

fs.writeFileSync('/data/data/com.termux.launcher.nix/files/home/projects/NouTube/app/index.tsx', code);
