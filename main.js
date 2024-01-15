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

window.onclick = function(event)
{
    TryResetNavbarButton(event);
}

window.onresize = function()
{
    if(window.innerWidth >= 800)
    {
        ResetNavbarButton();
    }
}