
const Remarkable = require('remarkable');
const DOMPurify = require('dompurify');

$( document ).ready(function() {
    
    var modal_mode = '';
    var post_obj = {};
    var total_stats = 0;
    
    
    var path = window.location.pathname;
    //console.log(path);
    
    var sub_path = path.substr(8);
    
    var permlink_start = sub_path.indexOf('/') + 1;
    
    var author = sub_path.substr(0, permlink_start - 1);
    
    var permlink = sub_path.substr(sub_path.indexOf('/') + 1);
    
    //console.log(author);
    //console.log(permlink);
    
    
    //document.title = user_account;
    
    $('#post_steemit').attr('href', 'https://steemit.com/@' + author + '/' + permlink);
    $('#post_busy').attr('href', 'https://busy.org/@' + author + '/' + permlink);
    $('#post_steempeak').attr('href', 'https://steempeak.com/@' + author + '/' + permlink);
    $('#post_peerquery').attr('href', 'https://www.peerquery.com/@' + author + '/' + permlink);
    
    
    function load() {
        
        $('#post_segment').addClass('loading');
    
        $.get('/api/content/@' + author + '/' + permlink, function(data, status){
                
            //console.log(data);
            try {
                var posts_data = data[0][0];
                var author_data = data[1][0];
            } catch (e){
                console.log(e);
            }
                
                
            if (!posts_data || !author_data) {
            
                $('#post_meta').hide();
                    
                $('#post_body').html('<h3 class="ui center aligned header">Sorry, nothing found; try these other clients.</h3><br/>' +
                        '<div style="text-align:center">' +
                        '<a href="https://steemit.com/@"' + author + '/' + permlink + '" target="_blank"><img class="ui avatar image" src="/assets/img/steemit-logo.png"></a>' +
                        '<a href="https://busy.org/@"' + author + '/' + permlink + '" target="_blank"><img class="ui avatar image" src="/assets/img/busy-logo.png"></a>' +
                        '<a href="https://steempeak.com/@"' + author + '/' + permlink + '" target="_blank"><img class="ui avatar image" src="/assets/img/steempeak-logo.png"></a>' +
                        '<a href="https://peerquery.com/@"' + author + '/' + permlink + '" target="_blank"><img class="ui avatar image" src="/assets/img/peerquery-logo.png"></a>' +
                        '</div>'
                );
                    
                document.title = 'Post not found';
                    
                $('#post_segment').removeClass('loading');
                    
            } else {
                
                document.title = posts_data.title + ' - @' + posts_data.author;
                    
                $('#post_author').text('@' + posts_data.author);
                $('#post_author').attr('href', '/user/' + posts_data.author);
                $('#post_title').html(posts_data.title);
                
                $('#post_author_img').attr('src', 'https://steemitimages.com/u/' + posts_data.author + '/avatar');
                $('#author_img').attr('src', 'https://steemitimages.com/u/' + posts_data.author + '/avatar');
                $('#post_time').attr('timestamp', posts_data.timestamp);
                $('#post_time').html(get_time(posts_data.timestamp));
                    
                    
                //render post
                renderHTML(posts_data.body, '#post_body');
                    
                //render curator comments
                renderHTML(posts_data.remarks, '#curators_remarks');
                    
                    
                //curation details
                $('#curation_status').html(get_curation_status(posts_data.state));
                $('#curation_time').html(get_time(posts_data.curate_time));
                $('#curator').html(posts_data.curator || 'TBD');
                $('#vote_status').html(get_vote_status(posts_data.state, posts_data.voted));
                $('#vote_percent').html(get_vote_percent(posts_data.rate));
                $('#vote_worth').html(get_vote_worth(posts_data.vote_amount));
                    
                    
                //author details
                    
                if (author_data.length !== 0 || author_data != '') {
                    
                    var rep = get_ratings(author_data.score);
            
                    $('#user_rep').attr('data-rating', rep);
            
                    $('.ui.rating')
                        .rating('disable')
                    ;
                    
                    //console.log(author_data)
                    
                    
                    $('#approved_count').html(author_data.approved);
                    $('#rejected_count').html(author_data.rejected);
                    $('#total_count').html(author_data.posts);
                    
                    
                    $('#sidebar').show();
                    
                }
                    
                $('#post_segment').removeClass('loading');    
                $('#curation_overview').show();
                
            }
                
        }).fail(function() {
        
            alert('Err fetching results, please try again');
        
        });
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
    
    
    
    //init
    load();
    
    
    
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
    
    
    
    
    function get_curation_status(status) {
        
        if (!status) return 'TBD';
        else if (status == 0) return 'not seen';
        else if (status == 1) return 'pending';
        else if (status > 1) return 'approved';
        else if (status < 0) return 'rejected';
        else return 'TBD';
        
    }
    
    function get_vote_status(curation, state){
        if (!state) return 'TBD';
        else if ( curation > 1 && state == 'false') return 'pending';
        else if (state == 'true') return 'voted';
        else return 'TBD';
        
    }
    
    function get_vote_percent(rate) {
    
        if (Number(rate) == 0) return rate;
        if (!rate) return 'TBD';
        return rate + '%';
        
    }
    
    
    function get_vote_worth(amount) {
    
        if (amount == 0) return '$' + amount;    
        if (!amount) return 'TBD';    
        return '$' + amount;
        
    }
    
    
    function get_time(time) {
    
        if (!time) return 'TBD';
        else if (time == '0000-00-00 00:00:00') return 'TBD';
        else return jQuery.timeago(time);
        
    }
    
    
    
    
    function get_ratings(score) {
        if (score < 50) return 0;
        else if (score > 50 ) return 1;
        else if (score > 150 ) return 2;
        else if (score > 300 ) return 3;
        else if (score > 500 ) return 4;
        else if (score > 1000 ) return 5;
    
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
    