exports.shouldScroll = ( queryElement ) => {
    //compare the elemnt (article/comment list height/offset vs the entire window height/offset            
    const element = document.querySelector( queryElement );
    //-175 because card height is approx 165 on every screen so want to scroll just before last card           
    const elementOffset = ( element.offsetTop + element.clientHeight - 175 );
    const pageOffset = window.pageYOffset + window.innerHeight;            
    return elementOffset < pageOffset ; 
};

exports.hasSpaceForMore = ( queryElement ) => {    
    const docHeight = document.documentElement.clientHeight;
    const divHeight = document.querySelector( queryElement ).clientHeight;
    return divHeight < docHeight;
};