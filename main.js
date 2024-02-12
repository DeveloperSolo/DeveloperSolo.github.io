//#region Navbar

function OnNavbarButtonClicked(x)
{
    document.querySelector("header .navbar-dropdown-button").classList.toggle("change");
    document.querySelector("header .navbar-full").classList.toggle("navbar-dropdown");
}

function ResetNavbarButton()
{
    document.querySelector("header .navbar-dropdown-button").classList.remove("change");
    document.querySelector("header .navbar-full").classList.remove("navbar-dropdown");
}

function TryResetNavbarButton(event) {
    if(!event.target.matches(".navbar-dropdown-button")
    && !event.target.parentElement.matches(".navbar-dropdown-button"))
    {
        ResetNavbarButton();
    }
}

//#endregion Navbar

//#region Experiences

var experienceDictionary = [];

var experienceFilterBitField = 1;
const filterBitField = 
[
    "project",
    "company",
    "school",
];
const filterDisplayName = 
[
    "Projects",
    "Companies",
    "Schools",
];
var useAlternateAlignment = true;

function UpdateExperiences()
{
    var timelineElements = document.querySelector("#experiences .timeline").children;
    var activeIndex = 0;

    for(var i = 2; i < timelineElements.length - 1; ++i)
    {
        var timelineNode = timelineElements[i];

        var isEnabled = true;

        if(experienceFilterBitField > 1)
        {
            var index = timelineNode.id;
            var data = experienceDictionary[index];
            var typeList = data["type"];
            var typeBitField = 0;
            for(var t = 0; t < typeList.length; ++t)
            {
                var type = typeList[t];
                var typeIndex = filterBitField.indexOf(type) + 1;
                typeBitField |= (1 << typeIndex);
            }
            isEnabled = Boolean(typeBitField & experienceFilterBitField);
        }

        if(isEnabled)
        {
            timelineNode.classList.remove("timeline-hidden");
            if(useAlternateAlignment)
            {
                timelineNode.classList.add((activeIndex % 2) ? "timeline-right" : "timeline-left");
                timelineNode.classList.remove((activeIndex % 2) ? "timeline-left" : "timeline-right");
            }
            else
            {
                timelineNode.classList.add("timeline-right");
                timelineNode.classList.remove("timeline-left");
            }

            ++activeIndex;
        }
        else
        {
            timelineNode.classList.add("timeline-hidden");
        }
    }
}

function PopulateExperiences()
{
    var grid = document.querySelector("#experiences .timeline");
    var template = grid.querySelector("#timeline-element-template");
    var index = 0;

    fetch("./data_experiences.json").then((res) => 
    {
        return res.json();
    })
    .then((data) => 
    {
        fetch("./data_experiences.json").then((res) => 
        {
            return res.json();
        })
        .then((data) => 
        {
            experienceDictionary = data;
            for(var key in data)
            {
                var experienceData = data[key];
                var typeList = experienceData["type"];
                var title = experienceData["title"];
                var subtitle = experienceData["subtitle"];
                var date = experienceData["date"];
                var imagePath = experienceData["imagePath"];

                var instance = template.content.cloneNode(true);
    
                var container = instance.querySelector(".timeline-container");
                container.id = key;
                for(var i = 0; i < typeList.length; ++i)
                {
                    container.classList.add("timeline-" + typeList[i].toLowerCase());
                }
        
                instance.querySelector(".timeline-title").textContent = title;
                instance.querySelector(".timeline-subtitle").textContent = subtitle;
                instance.querySelector(".timeline-date").textContent = date;
                instance.querySelector("img").setAttribute("src", imagePath);
                // instance.querySelector("a").setAttribute("href", "project.html?id=" + key);

                grid.insertBefore(instance, grid.childNodes[grid.childNodes.length - 2]);
                ++index;
            }
            UpdateExperiences();
        });
    });
}

function SetUseExperienceAlignment(value)
{
    if(useAlternateAlignment == value)
    {
        return;
    }
    useAlternateAlignment = value;
    UpdateExperiences();
}

function UpdateFilterButtonDisplay()
{
    var container = document.querySelector(".timeline-filter");
    for(var i = 0; i < container.children.length; ++i)
    {
        var button = container.children[i];
        var isEnabled = Boolean(experienceFilterBitField & (1 << i));
        if(isEnabled)
        {
            button.classList.add("timeline-filter-button-active");
        }
        else
        {
            button.classList.remove("timeline-filter-button-active");
        }
    }
}

function PopulateFilterButtonDisplay()
{
    var grid = document.querySelector("#experiences .timeline-filter");
    var template = document.querySelector("#experiences #timeline-filter-button-template");

    // Show All
    var instance = template.content.cloneNode(true);
    instance.querySelector("button").innerHTML = "Show All";
    grid.appendChild(instance);

    for(var i = 0; i < filterDisplayName.length; ++i)
    {
        var filter = filterDisplayName[i];

        var instance = template.content.cloneNode(true);
        instance.querySelector("button").innerHTML = filter;

        grid.appendChild(instance);
    }
    template.remove();

    UpdateFilterButtonDisplay();
}

function FilterOnClick(button)
{
    var buttonIndex = Array.from(button.parentElement.children).indexOf(button);
    if(experienceFilterBitField & (1 << buttonIndex))
    {
        experienceFilterBitField = 1;
    }
    else
    {
        experienceFilterBitField = (1 << buttonIndex);
    }
    UpdateFilterButtonDisplay();
    UpdateExperiences();
}

//#endregion Experiences

//#region Main

window.onload = function()
{
    PopulateExperiences();
    if(window.innerWidth < 1000)
    {
        SetUseExperienceAlignment(false);
    }
    PopulateFilterButtonDisplay();
};

window.onclick = function(event)
{
    TryResetNavbarButton(event);
}

window.onresize = function()
{
    if(window.innerWidth >= 1000)
    {
        ResetNavbarButton();
        SetUseExperienceAlignment(true);
    }
    else
    {
        SetUseExperienceAlignment(false);
    }
}

function LogTest()
{
    console.log("Testing");
}

//#endregion Main