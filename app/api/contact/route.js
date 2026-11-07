import nodemailer from 'nodemailer';

// Receiving mailbox per site. Messages are sent from (and to) the site's own Gmail account; the
// visitor's address is used as Reply-To.
const SITES = {
    tiffanystudio: {senderName: 'Magnólia Tiffanystudió', userEnv: 'SMTP_USER_TIFFANYSTUDIO', passEnv: 'SMTP_PASS_TIFFANYSTUDIO'},
    glassartista: {senderName: 'GlassArtista', userEnv: 'SMTP_USER_GLASSARTISTA', passEnv: 'SMTP_PASS_GLASSARTISTA'},
};

const DEFAULT_SUBJECT = 'Contact form submission';
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Maximum lengths; single-line fields must not contain line breaks (they end up in mail headers).
const FIELDS = {
    name: {maxLength: 200, required: true, singleLine: true},
    email: {maxLength: 254, required: true, singleLine: true},
    tel: {maxLength: 50, singleLine: true},
    text: {maxLength: 200, singleLine: true}, // subject
    message: {maxLength: 20000, required: true},
};

const transporters = new Map();

function getTransporter(siteKey) {
    if (!transporters.has(siteKey)) {
        const {userEnv, passEnv} = SITES[siteKey];
        const user = process.env[userEnv];
        const pass = process.env[passEnv];
        if (!user || !pass) throw new Error(`Missing ${userEnv} / ${passEnv}`);
        transporters.set(siteKey, {user, transport: nodemailer.createTransport({service: 'gmail', auth: {user, pass}})});
    }
    return transporters.get(siteKey);
}

/** Returns the validated submission, or null if the request body is invalid. */
function parseSubmission(body) {
    if (!body || typeof body !== 'object') return null;
    const submission = {};
    for (const [key, rule] of Object.entries(FIELDS)) {
        const value = body[key] ?? '';
        if (typeof value !== 'string' || value.length > rule.maxLength) return null;
        if (rule.required && value.trim() === '') return null;
        if (rule.singleLine && /[\r\n]/.test(value)) return null;
        submission[key] = value;
    }
    if (!EMAIL_PATTERN.test(submission.email)) return null;
    submission.site = body.site === 'tiffanystudio' ? 'tiffanystudio' : 'glassartista';
    return submission;
}

export async function POST(request) {
    let submission;
    try {
        submission = parseSubmission(await request.json());
    } catch {
        submission = null;
    }
    if (!submission) {
        return Response.json({success: false}, {status: 400});
    }

    const {site, name, email, tel, text, message} = submission;
    try {
        const {user, transport} = getTransporter(site);
        await transport.sendMail({
            from: {name: SITES[site].senderName, address: user},
            to: user,
            replyTo: {name, address: email},
            subject: text || DEFAULT_SUBJECT,
            text: `
Name: ${name}
Email: ${email}
Phone: ${tel || ''}

Message:

${message}
`,
        });
        return Response.json({success: true});
    } catch (error) {
        console.error('Contact form delivery failed:', error);
        return Response.json({success: false}, {status: 500});
    }
}
