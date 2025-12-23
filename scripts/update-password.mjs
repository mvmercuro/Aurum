import fs from 'fs';

const files = ['.env', '.env.local', '.env.production'];
const oldPass = 'Med12345';
const newPass = 'HW6GYwiRGrnTeQOb';

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes(oldPass)) {
            const newContent = content.replace(new RegExp(oldPass, 'g'), newPass);
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`✅ Updated ${file}`);
        } else {
            console.log(`⏭️  ${file}: Old password not found (might be already updated)`);
        }
    }
});
