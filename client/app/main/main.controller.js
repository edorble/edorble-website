'use strict';

angular.module('launcherApp')
  .controller('MainController', function ($scope) {

    console.log(window.engine);


    // dom element - progress bar
    var progressbarFill;
    var goButton;
    var progressText;
    var macURL;
    var winURL;

    // $( document ).ready(function() {
    //   mixpanel.track("Application Launched");
    // });

    // remove old go button for new launcher
    engine.on("RemoveGoButton", function(state, percent) {

      if(goButton == null)
        goButton = document.querySelector('a.w-button.patcher-play-button');    
        if(goButton)
        {
          //  read old GO button pos
          var rect = goButton.getBoundingClientRect();
          //send it out of screen, so further logics wil not reappear it
          goButton.style.right = "10000px"; 
          // send web button pos to Unity
          engine.trigger('OnGoButtonPosition', (rect.right + rect.left) * 0.5, (rect.top + rect.bottom) * 0.5);
        }
    });

    // receicve state updates from the launcher
    engine.on("UpdateState", function(state, percent) { 
      
      if(state == 1)
      { 
        $( "#progressbartextfield" ).text( "Looking for updates ..." );
        
        if(goButton == null)
          goButton = document.querySelector('a.w-button.patcher-play-button');    
        if(goButton)
        {
          goButton.style.display = "inherit";
          goButton.style.opacity = 0.5;
          goButton.disabled = true;
        }
        else
        {
          console.info("UpdateState: goButton is null");
        }
        
        progressbarFill = document.querySelector('div.progressbar-fill'); 
        if(progressbarFill == null)
        {
          console.info("UpdateState: progressbarFill is null");
        }
        else
        {
           progressbarFill.style.width = "4%";       
        }
        var mailButton;
        var mailButtons = document.querySelectorAll('a.w-inline-block.navlinks');    
        for (var i = 0, l = mailButtons.length; i < l; i++) 
        {
            var el = mailButtons[i];      
            if (el.getAttribute("mailbutton")) 
            {
              mailButton = el;
              break;
            }
        }
        
        if(mailButton)
        {
          mailButton.onclick = function()
            {
              // player clicks on mail button, send signal to UnityLauncher
              engine.trigger('OnMailButtonClick');
              return fase;
            };
        }
        else
        {
          console.info("UpdateState: mailButton is null");
        }   
      }
      else
        if(state == 2)
        {
          $( "#progressbartextfield" ).text( "Downloading updates ..." );
          // 2- downloading updates, updates 3 times per second   
          //console.log("UpdateState: state " + state + ", percent " + percent + "%");
          if(progressbarFill != null)
          {
            var percentToShow = percent;
            if(percentToShow < 4) //Bar looks ugly if it's smaller then 4
            {
              percentToShow = 4;
            }
            
            progressbarFill.style.width = percentToShow + "%";
          }
        }
      else
        if(state == 3)
        {
          $( "#progressbartextfield" ).text( "Ready! Click the button to launch Edorble." );
          // 3- ready
          if(goButton)
          {
             progressbarFill.style.width = "100%";
            goButton.style.display = "inherit";
            goButton.style.opacity = 1;
            goButton.disabled = false;
            goButton.onclick = function()
            {
              // player clicks on play button, send signal to UnityLauncher
              engine.trigger('OnGoButtonClick');
            };
          }
        }
      else
        if(state == 4)
        {
          // 4- fail
          $( "#progressbartextfield" ).text( "An error occured. Please go to www.support.edorble.com" );
        } 
      else  
        {
          // unknown state
          console.log("UpdateState: unknown state " + state + ", percent " + percent);
        } 
    });




});
