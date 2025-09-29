const chrono = require('chrono-node');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const processText = (rawText) => {
    // A simple list of known departments for entity extraction
    const departments = {
        dentist: "Dentistry",
        cardiology: "Cardiology",
        physio: "Physiotherapy",
        doctor: "General Medicine"
    };

    // --- Step 1: Entity Extraction ---
    let extractedDepartment = null;
    let departmentKeyword = null;
    const words = rawText.toLowerCase().split(' ');

    for (const word of words) {
        if (departments[word]) {
            extractedDepartment = departments[word];
            departmentKeyword = word;
            break;
        }
    }

    // Guardrail: If no department is found, exit
    if (!extractedDepartment) {
        return { status: "needs clarification", message: "Ambiguous department. Please specify a department like 'dentist' or 'cardiology'." };
    }

    // Assume the rest of the text is the date/time phrase
    const dateTimePhrase = rawText.toLowerCase().replace(departmentKeyword, '').trim();

    // --- Step 2: Normalization ---
    const referenceDate = new Date(); // Use current time as reference for "next Friday"
    const parsedResult = chrono.parse(dateTimePhrase, referenceDate, { forwardDate: true });

    // Guardrail: If chrono-node can't parse the date/time, exit
    if (!parsedResult || parsedResult.length === 0) {
        return { status: "needs clarification", message: "Ambiguous date/time. Please be more specific." };
    }

    const parsedDate = parsedResult[0].start.date();
    const localTimezone = "Asia/Kolkata";

    // Format the date and time using dayjs
    const normalizedDate = dayjs(parsedDate).tz(localTimezone).format('YYYY-MM-DD');
    const normalizedTime = dayjs(parsedDate).tz(localTimezone).format('HH:mm');

    // --- Step 3: Final Appointment JSON ---
    const finalAppointment = {
        appointment: {
            department: extractedDepartment,
            date: normalizedDate,
            time: normalizedTime,
            tz: localTimezone,
            status: "ok"
        }
    };

    return finalAppointment;
};

module.exports = { processText };