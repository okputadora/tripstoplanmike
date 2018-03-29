console.log("connected")
$(window).on("load", function(){
  console.log("READY!")
  // fade in the first prompt
  $("#homeDiv").css("opacity", "1")

  // when the user starts typing their home town
  $("#home").on("keyup", function(){
    // if the input has something in it
    console.log("in here")
    if ($("#home").val() !== ""){
      // then activate the button by removing the class 'disabled'
      $("#homeBtn").removeClass("disabled")
    }
    // if the input does not have something in it
    else{
      // then add the class disabled to disable it
      $("#homeBtn").addClass("disabled")
    }
  })

  // when the user clicks the button -- note how this only works
  // when the button is enabled (i.e. it doesn't have the class "disabled")
  $("#homeBtn").on("click", function(e){
    // FORM VALIDATION SHOULD HAPPEN HERE
    e.preventDefault()
    setTimeout(function(){
      $("#letsGetStarted").css("opacity", "0")
      $("#letsGetStarted").css("height", "0")
    }, 200)
    loadNextPrompt($("#homeDiv"), $("#cityDiv"))
  })

  $("#cityBtn").on("click", function(e){
    // FORM VALIDATION SHOULD HAPPEN HERE
    e.preventDefault()
    loadNextPrompt($("#cityDiv"), $("#dateDiv"))
  })

  $("#dateBtn").on("click", function(e){
    // FORM VALIDATION SHOULD HAPPEN HERE
    e.preventDefault()
    loadNextPrompt($("#dateDiv"), $("#interestDiv"))
  })

  $("#interestBtn").on("click", function(e){
    // FORM VALIDATION SHOULD HAPPEN HERE
    e.preventDefault()
    $("#interestDiv").css("opacity", "0")
    $("#interestDiv").css("margin-top", "-50px")
    setTimeout(function(){
      $("#main-container").empty()
      window.location='results.html'
    }, 500)
    // go to the results page
  })

  function loadNextPrompt(currentPrompt, nextPrompt){
    // fade out the homeDiv
    currentPrompt.css("opacity", "0")
    currentPrompt.css("margin-top", "-50px")
    // wait until it fades out
    setTimeout(function(){
      // then remove it
      currentPrompt.addClass("custom-hidden")
      nextPrompt.removeClass("custom-hidden")
      // add the next form
      // fade in the new window
      setTimeout(function(){
        nextPrompt.css("opacity", "1")
        nextPrompt.css("margin-top", "0px")
      }, 600)
    }, 300)
  }

  
  
  //This will bring the user back from the cities that they want to travel to, to the hometown page
  $("#back2").on("click", function(b){
    console.log("boop");
    b.preventDefault()
    loadPrevPrompt($("#cityDiv"), $("#homeDiv"))
    
  })
//This brings users from vacation dates to the city picker
  $("#back3").on("click", function(b){
    console.log("boop");
    b.preventDefault()
    loadPrevPrompt($("#dateDiv"), $("#cityDiv"))
    
  })
//This brings the user from interest picker to the vacation dates
  $("#back4").on("click", function(b){
    console.log("boop");
    b.preventDefault()
    loadPrevPrompt($("#interestDiv"), $("#dateDiv"))
    
  })


  function loadPrevPrompt(currentPrompt, prevPrompt){
    // fade out the homeDiv
    currentPrompt.css("opacity", "0")
    currentPrompt.css("margin-top", "-50px")
    // wait until it fades out
    setTimeout(function(){
      // then remove it
      currentPrompt.addClass("custom-hidden")
      prevPrompt.removeClass("custom-hidden")
      // add the next form
      // fade in the new window
      setTimeout(function(){
        prevPrompt.css("opacity", "1")
        prevPrompt.css("margin-top", "0px")
      }, 600)
    }, 300)
  }

  
})
