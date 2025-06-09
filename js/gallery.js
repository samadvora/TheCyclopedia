"use strict"

const displayWeeklyevents = () => {
    // Set the current month, year
    var d = new Date();
    let todayDate = d.getDate();
    let currentMonth = d.getMonth();
    let currentYear = d.getFullYear();
    let str = "";
    let date = "";
    let index = 0;
    let html = "";
    str = "";
    for (let i = todayDate; i <= todayDate + 7; i++) {
        str = "";
        let todaysTasks = JSON.parse(localStorage.getItem("event" + i));
        let tasks = (todaysTasks) ? todaysTasks : [];
        str = "<p id=\"dates\">" + i + "/" + currentMonth + "/" + currentYear + "</p>";
        if (tasks.length > 0) {
            var timeline = tasks.reduce( (prev, curr) => {
                let suffix = (curr[1] >= 12) ? 'PM' : 'AM';
                str = str + "<p>" + curr[1] + " " + suffix + " - " + curr[0] + " - " + curr[2] + "<br>";
                return str;
            }, "");
            html += timeline + "</p>" ;
            console.log("time:" + timeline + "html:" + html);
        }
    }
    if(html == "") {
      html = "<p>No event in this week.<br>Check the <a href=\"events.html\">Calendar</a></p>"
    }
    $(".set .content").html(html);
}

$(document).ready( () => {
  displayWeeklyevents();
  $(".set > p").parent().hover(function(){
    $(this).css({opacity:1});
    }, function(){
    $(this).css({opacity:0.4});
  });
    $(".set > p").on("click", function() {
      if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).parent().css({opacity:0.4});
          $(this).siblings(".content").slideUp(200);
        // $(".set p i").removeClass("fa-minus").addClass("fa-plus");
      } else {
        // $(".set p i").removeClass("fa-minus").addClass("fa-plus");
        // $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
        displayWeeklyevents();
        $(this).parent().css({opacity:1});
        $(".set p").removeClass("active");
        $(this).addClass("active");
        $(".content").slideUp(200);
        $(this).siblings(".content").slideDown(200);
      }
  });
});
  