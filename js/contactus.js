"use strict";
$(() => {



    $("#contact-form").submit(evt => {
        let isValid = true;

        const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

        const email = $("#email").val().trim();

        //firstname valid
        const first_name = $("#name").val().trim();
        if (first_name == "") {
            $("#name").next().text("This field is required.");
            isValid = false;

        } else {


            $("#name").next().text("");
        }
        $("#name").val(first_name);

        //valid email
        if (email == "") {

            $("#email").next().text("This field is required.");

            isValid = false;
        } else if (!emailPattern.test(email)) {

            $("#email").next().text("Must be a valid email address.");
            isValid = false;
        } else {
            $("#email").next().text("");
        }
        $("#email").val(email);

        //phone Number
        const phoneNumber = $("#phone").val().trim();
        if (phoneNumber == "") {
            $("#phone").next().text("This field is required.");
            isValid = false;
        } else if (!validatePhone('phone')) {

            $("#phone").next().text("Must be a valid Phone number");
            isValid = false;
        } else {
            $("#phone").next().text("");
        }
        $("#phone").val(phoneNumber);


        //if(!isValid)
        if (isValid == false) {
            evt.preventDefault();
        }
    });



});


function validatePhone(phone) {
    var a = document.getElementById(phone).value;
    var filter = /[1-9]{1}[0-9]{9}/;
    if (filter.test(a)) {
        return true;
    } else {
        return false;
    }
}

function pageRedirect() {
    window.location.href = 'submit.html';
    return false;
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}