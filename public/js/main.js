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
});

