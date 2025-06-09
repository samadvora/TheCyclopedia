//"use strict"; // Unable to enable as we are facing issue with tasks.map
var events = [];
const updateTimeline = ()=> {
    console.log("Inside Timeline");
    let str = "";
    let date = "";
    let index = 0;
    let html = "";
    str = "";
    for (let i = 1; i <= 31; i++) {
        console.log(str);
        let todaysTasks = JSON.parse(localStorage.getItem("event" + i));
        let tasks = (todaysTasks) ? todaysTasks : [];
        if (tasks.length > 0) {
            date = i + "/08/2021";
            if (html == "") {
                str = "<li" + " class=\"selected\" data-horizontal-timeline='{\"date\": \"" + date + "\", \"customDisplay\": \"" + date + "\"}'>";
            } else {
                str = "<li" + " data-horizontal-timeline='{\"date\": \"" + date + "\"   , \"customDisplay\": \"" + date + "\"}'>";
            }
            console.log(str);
        }
        if (tasks.length > 0) {
            console.log(str);
            var timeline = tasks.reduce( (prev, curr) => {
                /*
                <ol>
                    <li class="selected" data-horizontal-timeline='{"date": "12/12/2012", "customDisplay": "Custom Text"}'>
                    Event 1
                    </li>
                    <li data-horizontal-timeline='{"date": "12/12/2016", "customDisplay": "Custom Text"}'>
                    Event 2
                    </li>
                <ol>
                */
                
                let suffix = (curr[1] >= 12) ? 'PM' : 'AM';
                str = str + "<br>" + curr[1] + " " + suffix + " - " + curr[0] + " - " + curr[2];
                return str + "</li>";
            }, "");
            html += timeline;
            console.log(str);
            console.log("time:" + timeline);
            str = "";
        }
        
    }
    $(".events-content ol").html(html);
    console.log("html:" + html);

}
/*
 * displayTaskLists : Based on the input date passed
 *                    - Fetch the repective dates local storage's events Key[2nd of month -> event2]
 *                    - Sort out the tasks of the day
 *                    - Display the tasks in a checkbox input type
 */
const displayTaskLists = (todayDate) => {
    let todaysTasks = JSON.parse(localStorage.getItem("event" + todayDate));
    let tasks = (todaysTasks) ? todaysTasks : [];
    let taskString = "";
    if(tasks.length > 0) {
        tasks = tasks.map(task => [task[0], task[1], task[2]]);
        // tasks.sort((task1, task2, task3) => {
        tasks.sort((task1, task2) => {
            //ishwarya modified added AM and PM
            const date1 = new Date(currentYear, currentMonth, todayDate, task1[1]);
            const date2 = new Date(currentYear, currentMonth, todayDate, task2[1]);

            if (date1 < date2) {
                return -1;
            } else if (date1 > date2) {
                return 1;
            } else {
                return 0;
            }
        });

        let str = "";
        let index = 0;
        taskString = tasks.reduce( (prev, curr) => {
            let suffix = (curr[1] >= 12) ? 'PM' : 'AM';
            let label = curr[1] + " " + suffix + " - " + curr[0] + " - " + curr[2] +"</label><br>";
            str = str + "<label>" + "<input type=\"checkbox\" id=" + curr[1] + " value=" + curr[1] + ">" + label;
            index++;
            return str;
        }, "");
    } else {
        taskString = "No events listed today"
    }
    
    $("#eventslist").html(taskString);
    $("#name").focus();
    console.log("Calling timeline");
    updateTimeline();
};

/*
 * updateCalendar : Update the date's which has events - Dark highlights
 *                  Update the date's which has no events - Remove/No highlights
 */
const updateCalendar = () => {
    const dates = $("tbody td");
    
    for (let i = 0; i <= dates.length; i++) {
        let val = $(dates[i]).html();
        console.log(val);   
        if (val != "" && (val > 0 && val <= 31)) {
            if (dates[i].classList.contains("not-current")) {
                break;
            } else {
                let daysTasks = JSON.parse(localStorage.getItem("event" + val));
                let daystasks = (daysTasks) ? daysTasks : [];
                if (daystasks.length > 0) {
                    $(dates[i]).css({"background-color": "#242223",
                                     "color": "orange",
                                     "font-weight": "700"});
                } else {
                    $(dates[i]).css({"background-color": "white",
                                     "color": "#242223",
                                     "font-weight": "100"});
                }
            }
        }
    }

}

$(document).ready(function() {
    
    /* Created a plus button. Incase need for continuation */
    // $("#myBtn").click ( () => {
    //     // $("#myBtn").addClass('hide');
    //     // $("#plus").addClass('hide');
    //     displayTaskLists(todayDate);
    // });

    /* Close the Add/View events popup */
    $(".close").click ( () => {
        $("#events").animate({left: "-105%"}, 900, "linear");
        $("#form").animate({right: "-105%"}, 900, "linear");
        $("#myModal").animate({top: "-105%"}, 1000, "linear");
        updateCalendar();
        location.reload();
        
    });

    displayTaskLists(todayDate);
    // $("#submit").click ( () => {
    //     $("#events").animate({left: "-105"}, 200, "linear");
    //     $("#form").animate({right: "-105%"}, 200, "linear");
    //     $("#myModal").animate({top: "-100%"}, 2000, "linear");
    // });

    // Add new event to the list
    $("#add_task").click( () => {
        let todaysTasks = JSON.parse(localStorage.getItem("event" + todayDate));
        let tasks = (todaysTasks) ? todaysTasks : [];
        const name = $("#name").val();
        const rideTime = $("#rideTime").val();
        const routeselection = $("#routes").val();
        let isDuplicate = false;
        for (let j in tasks) {
            let taskVal = `${tasks[j][1]}`;
            let unmatched = true;
            if (rideTime == taskVal) {
                isDuplicate = true;
            }
        }

        /* If there is any other event booked at the time. Alert the user*/
        if (isDuplicate) {
            alert("Event at time:" + rideTime + " already booked. Try another slot");
            $("#name").select(); // replace this with the focus()
        } else if (name && routeselection && (rideTime > 4 && rideTime < 18) ) {
            const newEvent = [name, rideTime, routeselection];
            tasks.push(newEvent); // adding a task to the array
            localStorage["event" + todayDate] = JSON.stringify(tasks);
            $("#name").val("");
            $("#rideDate").val("");
            $("#routes").val("Select");
            displayTaskLists(todayDate); // to display the tasks we got
            
        } else {
            alert("Please enter a task and valid due date.");
            $("#name").select(); // replace this with the focus()
        }
    });

    /* Delete the events the user has choosen */
    $("#del_tasks").click( () => {
        let todaysTasks = JSON.parse(localStorage.getItem("event" + todayDate));
        let tasks = (todaysTasks) ? todaysTasks : [];
        let delkeys = $("input:checkbox:checked");
        let tempTasks = [];
        console.log("del:" + tasks + "tobedel:" + delkeys);
        for (let j in tasks) {
            let taskVal = `${tasks[j][1]}`;
            let unmatched = true;

            for (let i of delkeys) {
                let val = $(i).val();
                console.log("Deleting" + val + unmatched + `${tasks[j][1]}` );
                if (taskVal == val) {
                    unmatched = false;
                    console.log("Deleting" + val + unmatched);
                }
            }
            if (unmatched == true) {
                tempTasks.push(tasks[j]);
                console.log(tempTasks); 
            }
        }
        tasks.length=0;
        tasks = tempTasks;
        localStorage.setItem("event" + todayDate,  JSON.stringify(tasks));
        displayTaskLists(todayDate);
        $("#task").focus();
    });
    $(function(){
        2
          $('#myTimeline').horizontalTimeline();
        3
        });
        
});
