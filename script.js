function analyzePassword() {
    const password = document.getElementById('password').value;
    const strengthResult = document.getElementById('strengthResult');
    const breachResult = document.getElementById('breachResult');

    // Strength check
    let strength = "Weak";
    if (password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[\W]/.test(password)) {
        strength = "Strong";
    } else if (password.length >= 8) {
        strength = "Medium";
    }

    strengthResult.innerText = `Password Strength: ${strength}`;

    // Breach check using k-Anonymity (HaveIBeenPwned API)
    const sha1 = new jsSHA("SHA-1", "TEXT");
    sha1.update(password);
    const hash = sha1.getHash("HEX").toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
        .then(res => res.text())
        .then(data => {
            const lines = data.split("\n");
            let found = false;

            for (let line of lines) {
                const [hashSuffix, count] = line.split(":");
                if (hashSuffix === suffix) {
                    breachResult.innerText = `This password has been found in ${count} breaches!`;
                    found = true;
                    break;
                }
            }

            if (!found) {
                breachResult.innerText = "Good news! This password was NOT found in any known breaches.";
            }
        });
}
