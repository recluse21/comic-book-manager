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
                    window.location.href='/comics';
                },
                error: function(err){
                    console.log('Delete failed');
                    console.log(err);
                }
            });
        }
    });

    // add a comic to user collection
    $('.searchResult').on('click', function(e) {
        
        e.preventDefault();
        $(this).parent().closest('div').addClass('comic-added');

        var id = $(this).attr('data-id');
        var title = $('form[name='+ id + ']' + ' [name=title]').val();
        var issue = $('form[name='+ id + ']' + ' [name=issue]').val();
        var writer = $('form[name='+ id + ']' + ' [name=writer]').val();
        var artist = $('form[name='+ id + ']' + ' [name=artist]').val();
        var info = $('form[name='+ id + ']' + ' [name=info]').val();
        var year = $('form[name='+ id + ']' + ' [name=year]').val();
        var cover = $('form[name='+ id + ']' + ' [name=cover]').val();

        // if(writer === null) {
        //     writer = ' ';
        // }
        console.log('this is the writer:', writer);
        if(artist === null) {
            artist = ' ';
        }

        $.ajax({
            url: '/search/add',
            type:'POST',
            data:
            {
                title: title,
                issue: issue,
                writer: writer,
                artist: artist,
                info: info,
                year: year,
                notes: ' ',
                cover: cover
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

