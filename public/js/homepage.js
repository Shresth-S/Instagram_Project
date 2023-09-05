$(() => {
    let postList = $('.postList');
    let rightPart = $('.rightPart');
    let fetchCnt = 0;
    let lastKnownScrollPosition = 0;

    showPosts = (posts) => {
        let str = '';
        posts.forEach(post => {

            str += `
                    <li class="post" id="${post._id}">
                        <img class="imageurl postImage" src="${post.imageurl}"> <br>
                
                        <div class="likesAndInfo">
                            ❤️<button class="likes" id="${post._id}">${ post.likes }</button>
                            <a class="commentButton" href="/api/posts?id=${post._id}">💬${ post.comments.length } </a>
                            <a class="infoButton" href="/api/posts?id=${post._id}"> ℹ️ </a>
                        </div>
                    </li>
                    `
        });
        postList.append(str);
    }

    $( window ).on("scrollend", () => {
        if($(window).scrollTop() + $(window).height() > $(document).height()-20) {
            console.log("bottom aagya to aur posts laa rha hu");
            let x = 6 * fetchCnt;
            fetchCnt++;
            $.get(`/api/explore_posts?limit=6&offset=${x}`)
                .done((posts) => {;
                    showPosts(posts);
                })
                .fail((err) => {
                    alert("Failed to fetch posts/more posts");
                })
        }
    });
})
