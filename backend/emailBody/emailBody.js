const baseUrl = process.env.PORT ? 'https://endeavor-app.herokuapp.com' : 'http://localhost:3008';

const accepted = (name, title, id) => {
    return `
        <p>${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})} ET:</p>
        <p>Hi ${name}<p>
        <p>Your request to volunteer for the <strong><a href="${baseUrl}/event/${id}"> '${title}' </a></strong> event has been approved!</p>
        <p>Visit <strong><a href="${baseUrl}/event/${id}"> Endeavor </a></strong> to get more information about the event and to add it to your calendar.</p>
    `
};

const removed = (name, title, id) => {
    return `
        <p>${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})} ET:</p>
        <p>Hello ${name}<p>
        <p>Due to some restructuring of our <strong><a href="${baseUrl}/event/${id}"> '${title}' </a></strong> event, we had to remove your request to volunteer</p>
        <p>Please visit <strong><a href="${baseUrl}/events"> Endeavor </a></strong> to find other events you can volunteer for and share your valuable expertise.</p>
        <p>To view the <strong> '${title}' </strong> even, visit <a href="${baseUrl}/event/${id}"> this link </a></p>
    `
};

const request = (name, userId, title, eventId) => {
    return `
        <p>${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})} ET:</p>
        <p><strong><a href="${baseUrl}/volunteer/${userId}"> ${name} </a></strong> 
        requested to volunteer for the <strong> <a href="${baseUrl}/event/${eventId}"> '${title}' </a></strong> event.<p>
        <p>Visit <strong><a href="${baseUrl}/event/${eventId}"> Endeavor </a></strong> to find out more and manage the event's requests.</p>
    `
};

const cancelled = (name, userId, title, eventId) => {
    return `
        <p>${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})} ET:</p>
        <p><strong><a href="${baseUrl}/volunteer/${userId}"> ${name} </a></strong> 
        cancelled their approved request to volunteer for the <strong> <a href="${baseUrl}/event/${eventId}"> '${title}' </a></strong> event.<p>
        <p>Visit <strong><a href="${baseUrl}/event/${eventId}"> Endeavor </a></strong> to find out more and manage the event's requests.</p>
    `
};


module.exports = {
    accepted,
    removed,
    request,
    cancelled
}