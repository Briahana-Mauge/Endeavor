const accepted = (name, title, id) => {
    return `
        <p>${new Date().toLocaleString()}:</p>
        <p>Hi ${name}<p>
        <p>Your request to volunteer for the <strong><a href="http://localhost:3008/event/${id}"> '${title}' </a></strong> event has been approved!</p>
        <p>Visit <strong><a href="http://localhost:3008/event/${id}"> Endeavor </a></strong> to get more information about the event and to add it to your calendar.</p>
    `
};

const removed = (name, title, id) => {
    return `
        <p>${new Date().toLocaleString()}:</p>
        <p>Hello ${name}<p>
        <p>Due to some restructuring of our <strong><a href="http://localhost:3008/event/${id}"> '${title}' </a></strong> event, we had to remove your request to volunteer</p>
        <p>Please visit <strong><a href="http://localhost:3008/events"> Endeavor </a></strong> to find other events you can volunteer for and share your valuable expertise.</p>
        <p>To view the <strong> '${title}' </strong> even, visit <a href="http://localhost:3008/event/${id}"> this link </a></p>
    `
};

const request = (name, userId, title, eventId) => {
    return `
        <p>${new Date().toLocaleString()}:</p>
        <p><strong><a href="http://localhost:3008/volunteer/${userId}"> ${name} </a></strong> 
        requested to volunteer for the <strong> <a href="http://localhost:3008/event/${eventId}"> '${title}' </a></strong> event.<p>
        <p>Visit <strong><a href="http://localhost:3008/event/${eventId}"> Endeavor </a></strong> to find out more and manage the event's requests.</p>
    `
};

const cancelled = (name, userId, title, eventId) => {
    return `
        <p>${new Date().toLocaleString()}:</p>
        <p><strong><a href="http://localhost:3008/volunteer/${userId}"> ${name} </a></strong> 
        cancelled their approved request to volunteer for the <strong> <a href="http://localhost:3008/event/${eventId}"> '${title}' </a></strong> event.<p>
        <p>Visit <strong><a href="http://localhost:3008/event/${eventId}"> Endeavor </a></strong> to find out more and manage the event's requests.</p>
    `
};


module.exports = {
    accepted,
    removed,
    request,
    cancelled
}