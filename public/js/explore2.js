$(() => {
    let btn = $('.btn');
    let container = $('.container');
    let postList = $('.postList');
    let rightPart = $('.rightPart');
    let clickCnt = 1;
    let lastKnownScrollPosition = 0;

    showPosts = (posts) => {
        // console.log("showPosts called");
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
    btn.on("click", () => {
        console.log("btn clicked");
        let x = (6 * clickCnt) + 3;
        console.log(x);
        clickCnt++;
        $.get(`/api/explore_posts?limit=6&offset=${x}`)
            .done((posts) => {
                showPosts(posts);
            })
            .fail((err) => {
                alert("Failed to fetch posts/more posts");
            })
    })

    $( window ).on("scrollend", () => {
        // console.log("scroll event occured");
        // lastKnownScrollPosition = window.scrollY;
        // console.log(lastKnownScrollPosition);
        if($(window).scrollTop() + $(window).height() > $(document).height()-200) {
            console.log("bottom aagya to aur posts laa rha hu");
            let x = (6 * clickCnt) + 3;
            clickCnt++;
            $.get(`/api/explore_posts?limit=7&offset=${x}`)
                .done((posts) => {
                    // console.log("ok", posts[0]);
                    // console.log("length",posts.length);
                    showPosts(posts);
                })
                .fail((err) => {
                    alert("Failed to fetch posts/more posts");
                })
        }
    });


    // btn.on("click", () => {
    //     console.log("btn clicked");
    //     let x = 7 * clickCnt;
    //     // console.log(typeof(x));
    //     console.log("x", x);
    //     console.log("clickCnt", clickCnt);
    //     clickCnt++;
    //     $.get(`/api/explore_posts?limit=7&offset=${x}`)
    //         .done((posts) => {
    //             console.log("ok", posts[0]);
    //             console.log("length",posts.length);
    //             showPosts(posts);
    //         })
    //         .fail((err) => {
    //             alert("Failed to fetch posts/more posts");
    //         })
    // })
})

// postList.on("click", (ev) => {
//     // console.log("PostList",postList);
//     let attr = ev.target.getAttribute("class");
//     let id = ev.target.getAttribute("id");
//     console.log("id",id);
//     let likesCount = ev.target;

//     console.log("Target ",ev.target)

//     if (attr == 'likes') {
//         $.post('/api/like', { id })
//             .done((likes) => {
//                 likesCount.innerText = +likes;
//             })
//             .fail((err) => {
//                 alert("Failed to like Post");
//             })
//     }
