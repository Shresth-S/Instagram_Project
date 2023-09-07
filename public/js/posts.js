$(() => {
    let postList = $('.postList');

    function throttle(f, delay) {
        let callHuaPadaHai = false;
        return (...args) => {
            if (!callHuaPadaHai) {
                callHuaPadaHai = true;
                f(...args);
                setTimeout(() => {
                    callHuaPadaHai = false;
                },delay)
            }
        }
    }

    function showComments(newComments) {
        // console.log("showComments called");
        // console.log(newComments);
        let commentSection = $('.commentSection');
        commentSection.text('');
        newComments.forEach((c) => {
            // console.log(c);
            let div = $('<div>');
            div.addClass("commentItem");
            div.text(c);
            commentSection.append(div);
        })
        
    }

    function clickHandler(ev) {
        console.log("clicked");
        // console.log("PostList",postList);
        let attr = ev.target.getAttribute("class");
        let id = ev.target.getAttribute("id");
        console.log("id",id);
        let likesCount = ev.target;
        console.log("Target ", ev.target)
        console.log("Mujhpe request aayi");
        if (attr == 'likes') {
            $.post('/api/like', { id })
                .done((likes) => {

                    likesCount.innerText = +likes;
                })
                .fail((err) => {
                    alert("Failed to like Post");
                })
        }
        if (attr == 'addCommentButton') {
            let comment = $('.comment');
            let commentCount = $('.commentCount');
            // console.log(comment.val());
            let cmt = comment.val();
            comment.val('');
            if (cmt != "") {
                $.post('/api/addcomment',
                {
                    id,comment:cmt
                })
                .done((newComments) => {
                    showComments(newComments);
                })
                .fail((err) => {
                    alert("Failed to comment on post");
                })                
            }

        }
    }

    postList.on("click", throttle(clickHandler, 4000));
})
















    /* <form action="/api/addcomment" method="POST">
    <input type="hidden" name="id" value=${post._id}>
    <input type="text" name="comment" placeholder="Enter Comment" id="comment">
    <button type="submit">Add Comment</button>
</form>

<div>
    ${post.comments}
</div> */

    // You can use Array#map on Object.values.

    // output +=
    //          ` Resturant Name : ${group[i][0]}
    //           ${Object.values(group[i]).map(({food})=>"Menu " + food).join("\n")}
    //          `



    // {{#each ${post.comments} as |comment| }}
    //     <div style="border: 1px solid black">
    //         comment
    //     </div>
    // {{/each}}
