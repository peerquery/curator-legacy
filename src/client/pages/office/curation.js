
const Remarkable = require('remarkable');
const DOMPurify = require('dompurify');

$( document ).ready(function() {
    
    var post_obj = {};
    var modal_mode = '';
    
    const active_user = user_data.username;
    const active_user_authority = user_data.authority;
    
    
    function curate() {
        $('#post_meta').hide();
        $('#post_actions').hide();
        $('#load_button_div').html('');
        
        $('#curate_segment').addClass('loading');
        
        $.get('/api/private/curate', function(data, status){
            //console.log(data);
            
            if (data.length == 0) {
                    
                $('#curate_segment').removeClass('loading');
                $('#load_button_div').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
                    
            } else {
                
                post_obj = data['0'];
            
                $('#post_author').text('@' + post_obj.author);
                $('#post_author').attr('href', '/user/' + post_obj.author);
                $('#steemit_view').attr('href', 'https://steemit.com/@' + post_obj.author + '/' + post_obj.permlink);
                $('#post_title').html(post_obj.title);
                $('#post_author_img').attr('src', 'https://steemitimages.com/u/' + post_obj.author + '/avatar');
                
                $('#post_time').attr('timestamp', post_obj.timestamp);
                $('#post_time').html(jQuery.timeago(post_obj.timestamp));
                
                renderHTML(post_obj.body, '#post_body');
                jQuery('time.timeago').timeago();
            
                $('#post_meta').show();
                $('#post_actions').show();
            
                $('#curate_segment').removeClass('loading');
            }
            
        });
        
    }
    
    function curating() {
        
        $('#post_list_segment').hide();
        $('#start_curate').hide();
        
        $('#remarks').val('');
        
        $('.form_inputs').attr('disabled', false);
        $('.ui.dropdown').removeClass('disabled');
        
        $('#curator_form').attr('class', 'ui curators form');
        
        $('#remarks_field').attr('class', 'field');
        
        $('#curate_segment').show();
        
        curate();
        
    }
    
    
    
    function approve() {
    
        var curators_remarks = $('#remarks').val();
        var curator_rate = $('#rate option:selected').val();
        
        if (curators_remarks.length > 100) {
        
            $('#remarks_field').attr('class', 'field');
            
            $('#curator_form').addClass('loading');
            
            $.post('/api/private/approve',
                {
                    author: post_obj.author,
                    title: post_obj.title,
                    url: '/@' + post_obj.author + '/' + post_obj.permlink,
                    curator: active_user,
                    remarks: curators_remarks,
                    action: 'approve',
                    state: 2,
                    rate: curator_rate
                },
                function(data, status){
                    $('#curator_form').removeClass('loading');
                    $('.form_inputs').attr('disabled', true);
                    $('.options .ui.dropdown').addClass('disabled');
                    $('#rate').dropdown('set selected', '3');
                    $('#curator_form').addClass('success');
                
                }).fail( function () {
                $('#curator_form').addClass('error');
            });
        
        } else {
            $('#remarks_field').addClass('error');
            alert('Please enter remark of aleast 100 charactors');
        }
        
    }
    
    function reject() {
        
        var curators_remarks = $('#remarks').val();
        
        if (curators_remarks.length > 100) {
            
            $('#remarks_field').attr('class', 'field');
        
            $('#curator_form').addClass('loading');
            
            $.post('/api/private/reject',
                {
                    author: post_obj.author,
                    title: post_obj.title,
                    url: '/@' + post_obj.author + '/' + post_obj.permlink,
                    curator: active_user,
                    remarks: curators_remarks,
                    action: 'reject',
                    state: -1
                },
                function(data, status){
                    $('#curator_form').removeClass('loading');
                    $('.form_inputs').attr('disabled', true);
                    $('.ui.dropdown').addClass('disabled');
                    $('#curator_form').addClass('success');
                    $('#rate').dropdown('set selected', '3');
                
                }).fail(function () {
                $('#curator_form').addClass('error');
            });
        
        } else {
            $('#remarks_field').addClass('error');
            alert('Please enter remark of aleast 100 charactors');
        }
        
    }
    
    
    function approved() {
        
        modal_mode = 'approved';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
    
        $.get('/api/approved', function(data, status){
            
            $('#post_list_segment').removeClass('loading');
                
            if (data.length == 0) {
            
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
                
            } else {
                
                for (let x in data) {
                    create_items(data[x]);
                }
                
            }
                
        }).fail(function() {
        
            alert('Err fetching results, please try again');
            
        });
    }
    
    
    function ignored() {
    
        modal_mode = 'ignored';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
    
        $.get('/api/ignored', function(data, status){
            
            $('#post_list_segment').removeClass('loading');
                
            if (data.length == 0) {
                    
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
                    
            } else {
                
                for (let x in data) {
                    create_items(data[x]);
                }
                    
            }
            
        }).fail(function() {
            
            alert('Err fetching results, please try again');
            
        });
    }
    
    
    function lost() {
    
        modal_mode = 'lost';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
    
        $.get('/api/lost', function(data, status){
            
            $('#post_list_segment').removeClass('loading');
                
            if (data.length == 0) {
                    
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
                    
            } else {
                
                for (let x in data) {
                    create_items(data[x]);
                }
                    
            }
                
        }).fail(function() {
        
            alert('Err fetching results, please try again');
            
        });
    }
    
    
    function rejected() {
    
        modal_mode = 'rejected';
        $('#curate_segment').hide();
        $('#post_list_segment').show();
        $('#post_list').html('');
        $('#post_list_segment').addClass('loading');
    
        $.get('/api/rejected', function(data, status){
            
            $('#post_list_segment').removeClass('loading');
                
            if (data.length == 0) {
                    
                $('#post_list').html('<h3 class=\'ui center aligned header\'>Sorry, nothing found.</h3>');
                    
            } else {
                
                for (let x in data) {
                    create_items(data[x]);
                }
                    
            }
                
        }).fail(function() {
            
            alert('Err fetching results, please try again');
            
        });
    }
    
    
    
    
    function create_items(data) {
        
        var item = document.createElement('div');
        item.className = 'item';
        item.id = data.id;
    
        var button = document.createElement('button');
        button.className = 'view-post right floated circular ui icon button';
        button.innerHTML = '<i class=\'icon settings\'></i>';
        button.onclick = show_post;
        
        button.setAttribute('data-author', data.author);
        button.setAttribute('data-curator', data.curator);
        button.setAttribute('data-title', data.title);
        button.setAttribute('data-rate', data.rate);
        button.setAttribute('data-body', data.body);
        button.setAttribute('data-url', data.url);
        button.setAttribute('data-id', data.id);
        
        var img = document.createElement('img');
        img.className = 'ui avatar image';
        img.src = 'https://steemitimages.com/u/' + data.author + '/avatar';
        
        var content = document.createElement('div');
        content.className = 'content';
        
        var a = document.createElement('a');
        a.className = 'header';
        a.innerHTML = data.title;
        a.href = '/trail/@' + data.author + '/' + data.permlink;
        a.setAttribute('target', '_blank');
        
        var description = document.createElement('div');
        description.className = 'description';
        
        if (modal_mode == 'ignored' || modal_mode == 'lost') {
            description.innerHTML = '<small>Authored by <a target=\'_blank\' href=\'/user/' + data.author + '\'><b>@' + data.author + '</b></a></small>';
        } else {
            description.innerHTML = '<small>Authored by <a target=\'_blank\' href=\'/user/' + data.author + '\'><b>@' + data.author + '</b></a>, curated by <a target=\'_blank\' href=\'/curator/' + data.curator + '\'><b>@' + data.curator + '</b></a> as - <em>' + rate_name(data.rate) + '</em></small>';
        }
        
        content.appendChild(a);
        content.appendChild(description);
        
        if (active_user_authority >= 2) item.appendChild(button);
        item.appendChild(img);
        item.appendChild(content);
        
        
        document.getElementById('post_list').appendChild(item);
        
    }
    
    
    
    
    
    function show_post() {
        
        var dataset = this.dataset;
        post_obj = dataset;
        
        if (modal_mode == 'approved') {
            $('#modal-approve-btn').hide();
            $('#modal-reject-btn').show();
            
            show_modal(dataset);
            
        } else if (modal_mode == 'ignored') {
        
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').show();
            
            show_modal(dataset);
            
        } else if (modal_mode == 'lost') {
        
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').show();
            
            show_modal(dataset);
            
        } else if (modal_mode == 'rejected') {
        
            $('#modal-approve-btn').show();
            $('#modal-reject-btn').hide();
            
            show_modal(dataset);
        }
        
    }
    
    
    
    function show_modal(dataset) {
        
        
        $('#modal-header').html(dataset.title);
        renderHTML(dataset.body, '#modal-content');
        
        $('#modal-author-img').attr('src', 'https://steemitimages.com/u/' + dataset.author + '/avatar');
        $('#modal-curator-img').attr('src', 'https://steemitimages.com/u/' + dataset.curator + '/avatar');
        
        $('#modal-author').text(dataset.author);
        $('#modal-curator').text(dataset.curator);
        
        $('#modal-author').attr('href', '/user/' + dataset.author);
        $('#modal-curator').attr('href', '/curator/' + dataset.curator);
        
        $('#modal-rate-show').text(dataset.rate + '% - ' + rate_name(dataset.rate));
        
        $('.post-view.modal')
            .modal('show')
        ;
        
        // open second modal on first modal buttons
        $('.approve.modal')
            .modal('attach events', '.post-view.modal .approve')
        ;
        
        // open second modal on first modal buttons
        $('.reject.modal')
            .modal('attach events', '.post-view.modal .reject')
        ;
    
    }
    
    
    
    
    
    
    
    
    function modal_approve() {
        
        var curator_rate = $('#modal-rate option:selected').val();
        var curators_remarks = $('#approve-modal-remarks').val();
        
        if (curators_remarks.length > 100) {
            
            $('#approve-modal-remarks-field').attr('class', 'field');
        
            $('#modal-approve-form').addClass('loading');
            
            $('.ui.dropdown').addClass('disabled');
                
            $('#modal-approve').addClass('disabled');
                
            $.post('/api/private/approve',
                {
                    author: post_obj.author,
                    title: post_obj.title,
                    url: post_obj.url,
                    curator: active_user,
                    remarks: curators_remarks,
                    action: 're-approve',
                    state: 2,
                    rate: curator_rate
                },
                function(data, status){
                    $('#modal-approve-form').removeClass('loading');
                    $('#approve-modal-remarks').attr('disabled', true);
                
                    $('#modal-approve-form').addClass('success');
                    $('#' + post_obj.id).remove();
                
                    $('#modal-rate').dropdown('set selected', '3');
                
                }).fail(function () {
                $('#modal-approve-form').addClass('error');
            });
        
        } else {
            $('#approve-modal-remarks-field').addClass('error');
            alert('Please enter remark of aleast 100 charactors');
        }
        
        
    }
    
    
    function modal_reject() {
        
        var curators_remarks = $('#reject-modal-remarks').val();
        
        if (curators_remarks.length > 100) {
            
            $('#reject-modal-remarks-field').attr('class', 'field');
        
            $('#modal-reject-form').addClass('loading');
            
            $('#modal-reject').addClass('disabled');
                
            $.post('/api/reject',
                {
                    author: post_obj.author,
                    title: post_obj.title,
                    url: post_obj.url,
                    curator: active_user,
                    remarks: curators_remarks,
                    action: 're-reject',
                    state: -1
                },
                function(data, status){
                    $('#modal-reject-form').removeClass('loading');
                    $('#reject-modal-remarks').attr('disabled', true);
                
                    $('#modal-reject-form').addClass('success');
                    $('#' + post_obj.id).remove();
                    
                    $('#modal-rate').dropdown('set selected', '3');
                
                
                }).fail(function() {
                $('#modal-reject-form').addClass('error');
            });
        
        } else {
            $('#reject-modal-remarks-field').addClass('error');
            alert('Please enter remark of aleast 100 charactors');
        }
        
        
    }
    
    
    
    
    
    function rate_name(rate) {
        
        if (rate == '1') return 'Nice';
        else if (rate == '3') return 'Average';
        else if (rate == '5') return 'Interesting';
        else if (rate == '10') return 'Genius';
        else if (rate == '15') return 'Awesome';
        else if (rate == '20') return 'Remarkable';
        else if (rate == '25') return 'Exceptional';
        else if (rate == '30') return 'Outstanding';
        else if (rate == '0') return 'Rejected';
    
    }
    
    
    
    
    // initialize all dropdowns
    $('.ui.dropdown')
        .dropdown()
    ;
    
    
    // initialize all modals
    $('.coupled.modal')
        .modal({
            allowMultiple: false
        })
    ;

    
    $('.approve.modal')
        .modal({
            onHide  : function(){
                $('.ui.dropdown').removeClass('disabled');
                $('#modal-approve-form').attr('class', 'ui form');
                $('#approve-modal-remarks').html('');
                $('#approve-modal-remarks').attr('disabled', false);
                $('#modal-approve').attr('class', 'ui green reject button');
                $('#modal-rate').dropdown('set selected', '3');
            }
        })
    ;
    
    $('.reject.modal')
        .modal({
            onHide  : function(){
                $('#modal-reject-form').attr('class', 'ui form');
                $('#reject-modal-remarks').val('');
                $('#reject-modal-remarks').attr('disabled', false);
                $('#modal-rate').dropdown('set selected', '3');
                $('#modal-reject').attr('class', 'ui red reject button');
            }
        })
    ;
    
    
    //set up click listeners
    
    
    //curating menu
    $('#curating').click(function() {
        curating();
    });
    
    $('#approved').click(function() {
        approved();
    });
    
    $('#ignored').click(function() {
        ignored();
    });
    
    $('#lost').click(function() {
        lost();
    });
    
    $('#rejected').click(function() {
        rejected();
    });
    
    
    //curator options
    $('#approve').click(function() {
        approve();
    });
    
    $('#reject').click(function() {
        reject();
    });
    
    $('#next').click(function() {
        curating();
    });
    
    
    //modal options
    $('#modal-approve').click(function() {
        //modal-approve();
        approve();
    });
    
    $('#modal-reject').click(function() {
        //modal - reject();
        reject();
    });
    
    
    //initial curate button
    $('#curate').click(function() {
        this.remove();
        curate();
    });
    
    
    
    
    function renderHTML(html, div) {
    
        //console.log(html);
    
        var body = html;
    
        var md = new Remarkable({
            html: true, // Remarkable renders first then sanitize runs...
            breaks: false,
            linkify: false, // linkify is done locally
            typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
            quotes: '“”‘’',
        });
    
        
        
        //convert image links to image tags
        var link_images = body.replace(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif)(?!["\)]))/gi, image => {
            return '<img src="' + image + '">' + '<br/>';
        });
        
        
        
        //parser markdown
        var markdown_text = md.render(link_images);
        
        var urled_text = urlify(markdown_text);
        
        //console.log(urled_text)
        
        //convert hashtags to tags
        var link_tags = urled_text.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
            if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
            const space = /^\s/.test(tag) ? tag[0] : '';
            const tag2 = tag.trim().substring(1);
            const tagLower = tag2.toLowerCase();
            return space + '<a target="_blank" href="https://steemit.com/trending/' + tagLower + ' ">' + tag + ' </a>';
        });

        
        // usertag (mention)
        // Cribbed from https://github.com/twitter/twitter-text/blob/v1.14.7/js/twitter-text.js#L90
        var link_mentions = link_tags.replace(
            /(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
            (match, preceeding1, preceeding2, user) => {
                const userLower = user.toLowerCase();
                //const valid = validate_account_name(userLower) == null;
                const valid = userLower;

                const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

                return valid
                    ? preceedings + '<a target="_blank" href="/user/' + userLower + '">@' + user + '</a>' : preceedings + '@' + user;
            }
        );    
        
        
        //set the content of the temp element
        $(div).html(link_mentions);
            
    
        $(div + ' a').each(function () {
            // Exit quickly if this is the wrong type of URL
            if (this.protocol !== 'http:' && this.protocol !== 'https:') {
                return;
            }
            
            // Find the ID of the YouTube video
            var id, matches;
            
            if (this.hostname === 'youtube.com' || this.hostname === 'm.youtube.com' || this.hostname === 'www.youtube.com' || this.hostname === 'youtu.be') {
                
                var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match = this.href.match(regExp);
                if (match && match[2].length == 11) {
                    id = match[2];
            
                    // Add the embedded YouTube video, and remove the link.
                    if (id) {
            
                        $(this)
                            .before('<iframe width="640" height="360" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>')
                            .remove();
                    }
                
                    
                } else {
                    return;
                }
                
                
                
            }

            
        });
    
    
    
    
        var final_text = $('#temp').html();
        $('#temp').html('');
        
        //
        var _out = DOMPurify.sanitize(final_text);
        
        return _out;
    
    }    
    
    
    
    
    
    
    function urlify(text) {
  
        return (text || '').replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function(match, space, url){
            var hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
            }            
            return space + '<a href="' + hyperlink + '">' + url + '</a>';
        });
            
    }
    
    
    
});
    