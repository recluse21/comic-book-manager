$(document).ready(function() {
    // delete a comic
    $('.delete-comic').on('click', function() {
        var id = $(this).data('id');
        var url = '/comics/delete/' + id;
        if (confirm('Delete comic?')){
            $.ajax({
                url: url,
                type:'DELETE',
                success: function(result) {
                    console.log('Deleting comic...');
                    //window.location.href='/comics';
                },
                error: function(err){
                    console.log('Delete failed');
                    console.log(err);
                }
            });
        }
    });

    // add a comic to user collection
    $('.add-comic').click(function() {
        $.ajax({
            url: send_email.php,
            type:'POST',
            data:
            {
                title: req.body.title,
                issue: req.body.issueNum,
                writer: req.body.writer,
                artist: req.body.artist,
                info: req.body.info,
                year: req.body.year,
                notes: comicNotes,
                cover: req.body.cover,
                uid: firebase.auth().currentUser.uid
            },
            success: function(result) {
                console.log('Adding comic...');
                
            },
            error: function(err) {
                console.log('Add failed...');
                console.log(err);
            }               
        });
    });

});

