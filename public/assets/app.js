var dropList = () => {
    drop = document.getElementById('DropDown')
    if(drop.style.display === 'none' || drop.style.display === '') {
        drop.style.display = 'block'
    }else {
        drop.style.display = 'none'
    }
}
document.addEventListener('mouseup', event => {
    if(event.target != document.getElementById('hc')) {
        document.getElementById('DropDown').style.display = 'none'
    }
})

var homeScroll = () => {
    document.getElementById('Home').scrollIntoView({behavior: 'smooth'})
}