
const $ = require('jquery');
window.jQuery = $;
window.$ = $;

require('semantic-ui-css/semantic.min.js');


$('.ui.menu .ui.dropdown').dropdown({
    on: 'hover'
});
$('.ui.menu a.item')
    .on('click', function() {
        $(this)
            .addClass('active')
            .siblings()
            .removeClass('active')
        ;
    });