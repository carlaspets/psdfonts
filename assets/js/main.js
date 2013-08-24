$(document).ready(function(){

    function fadeInName(name) {
        $('#js-file-name').empty();
        $('#js-file-name').text(name);
        $('.upload-form__file-actions').show(0,function(){
            $(this).addClass('fade-in');
        });
    };

    var realFileField = $('#js-file-field');
    var errorWrap = $('.errors-box');

    $('#js-file-btn').click(function(e){
        e.preventDefault();
        realFileField.click();
        GoSquared.DefaultTracker.TrackEvent('Upload method - Web');
        errorWrap.removeClass('fade-in').hide();
    });

    realFileField.change(function(){
        var filePath = $(this).val();
        var fileName = filePath.substr(filePath.lastIndexOf('\\')+1);
        fadeInName(fileName);
    });

    $('#js-file-dropbox').click(function(e){
        e.preventDefault();
        GoSquared.DefaultTracker.TrackEvent('Upload method - Dropbox');
        Dropbox.choose({
            linkType: "direct",
            multiselect: false,
            extensions: ['.psd'],
            success: function(files) {
                realFileField.replaceWith(realFileField = realFileField.clone(true));
                $('#js-dropbox-field').val(files[0].link);
                fadeInName(files[0].name);
            }
        });
    });

   $('.upload-form').validate({
    ignore: "",
    errorLabelContainer: '.errors-box',
    errorElement: 'p',
    errorClass: 'errors-box__message',
    highlight: function(element, errorClass, validClass) {
        $('.errors-box').show(0, function(){
            $(this).addClass('fade-in');
        })
    },
    rules: {
        psd: {
            required: function(element) {
                return $('#js-dropbox-field').val().length == 0;
            },
            extension: 'psd'
        }
    },
    messages: {
        psd: {
            required: "You need to choose a psd",
            extension: "Your file must be a psd"
        }
    },
    submitHandler: function(form) {
        form.submit();
        $('.upload-form__btn--submit').html('uploading <i></i>');
    }
   });

   var clipButton = $('#js-copy-btn');
    var clip = new ZeroClipboard( clipButton, {
        moviePath: '/zero-clipboard.swf',
        hoverClass: 'clipboard-is-hover'
    });

    clip.on('complete', function(client, args) {
        var originalText = clipButton.text();
        var copiedText = clipButton.data('copy-text');

        clipButton.text(copiedText).addClass('attn-grab');
        setTimeout(function(){
            clipButton.removeClass('attn-grab');
        },6000);

        GoSquared.DefaultTracker.TrackEvent('Start over');
    });


    $('.font-list__buy-font').click(function(){
        var fontName = $(this).data('font-name');
        GoSquared.DefaultTracker.TrackEvent('Buy link clicked',{name: fontName});
    });
});


