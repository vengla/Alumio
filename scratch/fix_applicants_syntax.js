const fs = require('fs');
const path = 'e:/Tableau/project/alumni_platform/mobile/mobile-app.js';
let txt = fs.readFileSync(path, 'utf8');

// Fix the applicantsDb that uses single-quoted strings with apostrophe years
// Target: those strings with class years like 'CS '22 which break JS
// Replace the whole applicantsDb with a clean version using template literals
const oldDb = `const applicantsDb = {
    default: [
        { initials: 'JD', name: 'John Doe', meta: 'CS '22 • Applied 2h ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'PS', name: 'Priya Sharma', meta: 'EE '17 • Applied 1d ago', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'RK', name: 'Rahul Kapoor', meta: 'CS '20 • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'AN', name: 'Anjali Nair', meta: 'IT '21 • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger)' },
        { initials: 'SM', name: 'Siddharth More', meta: 'ME '23 • Applied 4d ago', status: 'Under Review', statusColor: 'var(--warning)' },
    ],
    'Senior Software Engineer': [
        { initials: 'AK', name: 'Aryan Kumar', meta: 'CS '21 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'NS', name: 'Neha Singh', meta: 'CS '20 • 4 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'VP', name: 'Vikas Pandey', meta: 'CE '22 • 2 YOE • Applied 2d ago', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'RJ', name: 'Ritu Jain', meta: 'IT '19 • 5 YOE • Applied 3d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'MD', name: 'Manish Desai', meta: 'CS '18 • 6 YOE • Applied 4d ago', status: 'Rejected', statusColor: 'var(--danger)' },
    ],
    'Product Manager': [
        { initials: 'PK', name: 'Pooja Krishnan', meta: 'MBA '20 • 3 YOE • Applied Today', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'AS', name: 'Arjun Shah', meta: 'CS '19 • 5 YOE • Applied Yesterday', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'DM', name: 'Deepika Menon', meta: 'EE '21 • 3 YOE • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
    ],
    'Data Scientist Intern': [
        { initials: 'KP', name: 'Karan Patel', meta: 'CS '25 (Final Year) • Applied Today', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'SA', name: 'Shreya Agarwal', meta: 'DS '25 (Final Year) • Applied Yesterday', status: 'Shortlisted', statusColor: 'var(--success)' },
        { initials: 'TN', name: 'Tejas Naik', meta: 'CS '26 (3rd Year) • Applied 2d ago', status: 'Under Review', statusColor: 'var(--warning)' },
        { initials: 'PM', name: 'Preethi Mohan', meta: 'IT '25 (Final Year) • Applied 3d ago', status: 'Rejected', statusColor: 'var(--danger)' },
    ]
};`;

const newDb = `const applicantsDb = {
    "default": [
        { initials: "JD", name: "John Doe", meta: "CS Batch 22 \u2022 Applied 2h ago", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "PS", name: "Priya Sharma", meta: "EE Batch 17 \u2022 Applied 1d ago", status: "Shortlisted", statusColor: "var(--success)" },
        { initials: "RK", name: "Rahul Kapoor", meta: "CS Batch 20 \u2022 Applied 2d ago", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "AN", name: "Anjali Nair", meta: "IT Batch 21 \u2022 Applied 3d ago", status: "Rejected", statusColor: "var(--danger)" },
        { initials: "SM", name: "Siddharth More", meta: "ME Batch 23 \u2022 Applied 4d ago", status: "Under Review", statusColor: "var(--warning)" },
    ],
    "Senior Software Engineer": [
        { initials: "AK", name: "Aryan Kumar", meta: "CS Batch 21 \u2022 3 YOE \u2022 Applied Today", status: "Shortlisted", statusColor: "var(--success)" },
        { initials: "NS", name: "Neha Singh", meta: "CS Batch 20 \u2022 4 YOE \u2022 Applied Yesterday", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "VP", name: "Vikas Pandey", meta: "CE Batch 22 \u2022 2 YOE \u2022 Applied 2d ago", status: "Shortlisted", statusColor: "var(--success)" },
        { initials: "RJ", name: "Ritu Jain", meta: "IT Batch 19 \u2022 5 YOE \u2022 Applied 3d ago", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "MD", name: "Manish Desai", meta: "CS Batch 18 \u2022 6 YOE \u2022 Applied 4d ago", status: "Rejected", statusColor: "var(--danger)" },
    ],
    "Product Manager": [
        { initials: "PK", name: "Pooja Krishnan", meta: "MBA Batch 20 \u2022 3 YOE \u2022 Applied Today", status: "Shortlisted", statusColor: "var(--success)" },
        { initials: "AS", name: "Arjun Shah", meta: "CS Batch 19 \u2022 5 YOE \u2022 Applied Yesterday", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "DM", name: "Deepika Menon", meta: "EE Batch 21 \u2022 3 YOE \u2022 Applied 2d ago", status: "Under Review", statusColor: "var(--warning)" },
    ],
    "Data Scientist Intern": [
        { initials: "KP", name: "Karan Patel", meta: "CS Batch 25 (Final Year) \u2022 Applied Today", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "SA", name: "Shreya Agarwal", meta: "DS Batch 25 (Final Year) \u2022 Applied Yesterday", status: "Shortlisted", statusColor: "var(--success)" },
        { initials: "TN", name: "Tejas Naik", meta: "CS Batch 26 (3rd Year) \u2022 Applied 2d ago", status: "Under Review", statusColor: "var(--warning)" },
        { initials: "PM", name: "Preethi Mohan", meta: "IT Batch 25 (Final Year) \u2022 Applied 3d ago", status: "Rejected", statusColor: "var(--danger)" },
    ]
};`;

if (txt.includes(oldDb)) {
    txt = txt.replace(oldDb, newDb);
    fs.writeFileSync(path, txt);
    console.log('Fixed applicantsDb - replaced apostrophe years with Batch notation');
} else {
    // Try regex approach
    const fixedTxt = txt.replace(/(meta: '[^']*) '(\d{2})/g, "$1 Batch $2");
    if (fixedTxt !== txt) {
        fs.writeFileSync(path, fixedTxt);
        console.log('Fixed using regex - replaced year apostrophes');
    } else {
        console.error('Could not find exact match to replace!');
        // Try line by line approach
        const lines = txt.split('\n');
        const fixedLines = lines.map(line => {
            // Fix lines in applicantsDb that have year apostrophes like 'CS '22
            return line.replace(/, meta: '(.+?) '(\d{2})(.*?)', (status:)/g, ", meta: '$1 Batch $2$3', $4");
        });
        fs.writeFileSync(path, fixedLines.join('\n'));
        console.log('Applied line-by-line fix');
    }
}
