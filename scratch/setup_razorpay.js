const fs = require('fs');
const path = require('path');

const mobileDir = 'e:/Tableau/project/alumni_platform/mobile';
const htmlPath = path.join(mobileDir, 'index.html');
const jsPath = path.join(mobileDir, 'mobile-app.js');

let html = fs.readFileSync(htmlPath, 'utf8');

// Inject Razorpay script in head if not present
if (!html.includes('checkout.razorpay.com')) {
    html = html.replace('</head>', '  <!-- Razorpay Sandbox SDK -->\n  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>\n</head>');
    fs.writeFileSync(htmlPath, html);
    console.log('Razorpay SDK injected into HTML.');
}

let js = fs.readFileSync(jsPath, 'utf8');

const razorpayJs = `
function processDonation() {
    const amountStr = document.getElementById('donate-amount').value;
    const category = document.getElementById('donate-category').value;
    
    if(!amountStr || parseInt(amountStr) <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }
    
    // Close the details modal to show Razorpay smoothly
    document.getElementById('donate-modal').style.display = 'none';

    // Amount in Paisa for Razorpay (multiply by 100)
    const amountPaisa = parseInt(amountStr) * 100;
    
    // Dummy / Sandbox Razorpay Options
    var options = {
        "key": "rzp_test_1DP5mmOlF5G5ag", // Dummy test key format for UI rendering
        "amount": amountPaisa, 
        "currency": "INR",
        "name": "Alumni Connect",
        "description": "Donation for " + category,
        "image": "https://cdn-icons-png.flaticon.com/512/3003/3003554.png", // Demo Graduation Hat Logo
        "handler": function (response){
            // This runs if payment is "successful" (Dummy success in Sandbox)
            
            // Show our custom success modal
            const modal = document.getElementById('action-modal');
            document.getElementById('modal-icon').textContent = '❤️';
            document.getElementById('modal-title').textContent = 'Payment Successful!';
            document.getElementById('modal-desc').innerHTML = \`Your donation of ₹\${amountStr} to the "\${category}" has been successfully processed via Razorpay.<br><br><b>Payment ID:</b> \${response.razorpay_payment_id}.<br>A receipt has been sent to your email.\`;
            
            modal.style.display = 'flex';
            
            // Change the original button visually
            if(activeDonationButton) {
                activeDonationButton.textContent = 'Donated ✓';
                activeDonationButton.style.background = 'var(--success)';
                activeDonationButton.style.pointerEvents = 'none';
                activeDonationButton = null; // reset
            }
        },
        "prefill": {
            "name": "John Alumnus",
            "email": "alumni@edu.in",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Alumni Connect Platform"
        },
        "theme": {
            "color": "#0055ff"
        },
        "modal": {
            "ondismiss": function(){
                 console.log('Payment modal closed');
                 // You could show a cancelled toast message here
            }
        }
    };
    
    try {
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
        });
        rzp1.open();
    } catch(e) {
        alert("Razorpay is not loaded or key is invalid.");
        console.error(e);
    }
}
`;

// Regex replace the previous processDonation function
const regex = /function processDonation\(\) \{[\s\S]*?activeDonationButton = null; \/\/ reset\n\s*\}\n\}/;
if (regex.test(js)) {
    js = js.replace(regex, razorpayJs);
    fs.writeFileSync(jsPath, js);
    console.log('Razorpay logic injected into JS.');
} else {
    console.log('Could not find existing processDonation to replace.');
}
