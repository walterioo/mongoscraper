$(".scrapeNewsBtn").on("click", () => {
    $(".loadingDiv").show();
    $.get("/api/scrape", function (data) {
        location.reload("/");
        $(".loadingDiv").hide();
    });
})

$(".saveArticleBtn").on("click", function () {
    var id = $(this).attr("data-id");

    $.ajax("/api/saveArticle", {
        type: "PUT",
        data: { id }
    }).then(
        data => {
            if (data === 'ok') {
                bootbox.alert("Article saved!", () => {
                    location.reload("/");
                });
            }
        }
    );
});

$("#clearArticlesBtn").on("click", function () {
    $.ajax("/api/deleteArticles", {
        type: "DELETE"
    }).then(
        function () {
            location.reload("/");
        }
    );
})

$(".notesBtn").on("click", function () {
    var id = $(this).attr("data-id");
    $.get("/api/articleNotes/" + id,
        function (notes) {
            //TODO: No notes messages here
            notes.forEach(note => {
                addNewNote(note, id);
            });
            $("#saveNoteBtn").attr("data-id", id);
            $("#notes-modal").modal("toggle");
        });
})

function addNewNote(note, articleId) {
    var noteDiv = $(`<div data-id="${note._id}" style="margin-bottom:15px !important" class="noteContainer row ">`)
    var noteTextDiv = $('<div class="col-10">');
    var noteDeleteDiv = $('<div class="col-2">');;
    var noteText = $("<p>").text(note.body);
    var noteButton = $(`<button class="btn btn-danger deleteButton" data-article_id="${articleId}" data-id="${note._id}">X</button>`);
    noteTextDiv.append(noteText);
    noteDeleteDiv.append(noteButton);
    noteButton.on("click", function () {
        var id = $(this).attr("data-id");
        var articleId = $(this).attr("data-article_id");
        $.ajax("/api/deleteNote/" + id, {
            data: { articleId },
            type: "DELETE"
        }).then(
            function (deleted) {
                bootbox.alert("Note deleted!", () => {
                    $(`div [data-id="${deleted._id}"]`).remove();
                });
            }
        );
    })
    noteDiv.append(noteTextDiv, noteDeleteDiv);
    $('#savedNotes').prepend(noteDiv);
}

$("#saveNoteBtn").on("click", function () {
    var note = $("#noteText").val();
    var id = $(this).attr("data-id");
    $.ajax("api/saveNote", {
        type: "PUT",
        data: {
            id,
            note
        }
    }).then(
        function (note) {
            if (typeof note === 'object') {
                bootbox.alert("Note saved!", function () {
                    $("#noteText").val('');
                    addNewNote(note, id);
                })
            } else {
                //TODO: Log error here...
            }
        }
    );
})

$(".deleteFromSaveBtn").on("click", function () {
    var id = $(this).attr("data-id");
    $.ajax("/api/deleteFromSaved", {
        type: "PUT",
        data: { id }
    }).then(
        function (data) {
            if (data === 'ok') {
                bootbox.alert("Article deleted from saved!", () => {
                    location.reload("/saved");
                })
            }
        }
    );
})

$(document).ready(function () {
    $("#myModal").on("show", function () {    // wire up the OK button to dismiss the modal when shown
        $("#myModal a.btn").on("click", function (e) {
            console.log("button pressed");   // just as an example...
            $("#myModal").modal('hide');     // dismiss the dialog
        });
    });
    $("#myModal").on("hide", function () {    // remove the event listeners when the dialog is dismissed
        $("#myModal a.btn").off("click");
    });

    $("#myModal").on("hidden", function () {  // remove the actual elements from the DOM when fully hidden
        $("#myModal").remove();
    });
});