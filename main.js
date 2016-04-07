var app = {
    METHOD: "POST",
    init: function (ev) {
        app.getList();
        
        document.querySelector(".btnAdd").addEventListener("click", app.navigate);
        document.querySelector("#save").addEventListener("click", function (ev) {
            app.saveData(ev);
            app.navigate(ev);
        });
        document.querySelector("#back").addEventListener("click", app.navigate);
        document.querySelector("#home").addEventListener("click", app.navigate);
        document.querySelector("#reviews").addEventListener("click", function(ev){
            app.navigate(ev);
            app.getReview(ev);
        });

        window.addEventListener("popstate", app.popPop);
    },
    useTouch: function(){
        var touch = document.getElementById();
        var hammertime = new Hammer(touch);
        hammertime.on('tap', function(ev) {
            console.log(ev);
        });
    },
    getList: function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/");
        //xhr.open("POST", "get-reviews.php");
        xhr.addEventListener("load", app.gotList);
        xhr.addEventListener("error", app.badStuffHappened);

        var params = new FormData();

        params.append("uuid", "4242");

        xhr.send(params);
    },

    gotList: function (ev) {
        //when the list comes back from the server 
        var data = JSON.parse(ev.target.responseText);
        if (data.code == 0) {
            var msg = document.getElementById("reviews");
            var ul = document.createElement("ul");
            var numReviews = data.reviews.length;
            console.log(data);
            if (numReviews > 0) {
                msg.appendChild(ul);
                for (var i = 0; i < numReviews; i++) {
                    var li = document.createElement("li");
                    li.setAttribute("data-href", "details");
                    li.setAttribute("id", data.reviews[i].id);
                    li.setAttribute("data-id", data.reviews[i].id);
                    li.textContent = data.reviews[i].title + " \nReview: " + data.reviews[i].rating + "/5";
                    ul.appendChild(li);
                }
                //forEach version
                data.reviews.forEach(function (item, index) {
//                    var li = document.createElement("li");
//                    li.textContent = item.title;
//                    ul.appendChild(li);
                });
            } else {
                msg.innerHTML = "no reviews for you";
            }

        } else {
            //bad things happend
            // use the same function over and overafor any warning 
            console.log("NO WORK");
        }
    },
    getReview: function (id) {

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/get/");
        xhr.addEventListener("load", app.gotReview(id));
        xhr.addEventListener("error", app.badStuffHappened);

        var params = new FormData();

        params.append("id", id);

        params.append("uuid", "4242");

        document.querySelector("#reviews").textContent = "request Sent.";

        xhr.send(params);
    },
    gotReview: function(){
        var data = JSON.parse(ev.target.responseText);
        var makeTitle = document.createElement("h2");
        var par = document.createElement("p");
        var par2 = document.createElement("p");
        var pic = document.createElement("img");
        
        makeTitle.textContent = data.review_details.title;
        par.textContent = "Rating: " + data.review_details.rating + "/5";
        par2.textContent = data.review_details.review_txt;
        img.setAttribute("src", data.review_details.img);
        
    },
    badStuffHappened: function (ev) {
        //this gets called for actual errors
        document.querySelector("#reviews").textContent = "ERROR " + ev.message;
    },
    saveData: function (ev) {
        var title = document.getElementById("title");
        var review = document.getElementById("review");
        var rating = document.getElementById("rating");
        ev.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://griffis.edumedia.ca/mad9022/reviewr/review/set/");
        xhr.addEventListener("error", app.badStuffHappened);
        var params = new FormData();
        params.append("uuid", "4242");
        params.append("action", "insert");
        params.append("title", title.value);
        params.append("review_txt", review.value);
        params.append("rating", rating.value);
        xhr.send(params);
    },
    navigate: function (ev) {
        ev.preventDefault();
        var url = ev.target.getAttribute("data-href");
        history.pushState({
            "page": url
        }, null, "#" + url);
    [].forEach.call(document.querySelectorAll("[data-role=page]"), function (item, index) {
            //this function runs once for each[data-role]

            item.classList.remove("active-page");
            if (item.id == url) {
                item.classList.add("active-page");
            }
        });

    },
    popPop: function (ev) {
        ev.preventDefault();
    }
};

document.addEventListener("deviceready", app.init);