$(() => {
    $("#submit").click(() => {
        var message = { start: $("#start").val(), end: $("#end").val()};
        postMessage(message);
    });
});

function postMessage(message) {
    $.post('http://localhost:3000/messages', message);
}