function showImage(n){
    console.log(n);
    if(n<0)
        n=document.getElementsByClassName("productImage").length-1;
    if(n>=document.getElementsByClassName("productImage").length)
        n=0;
    document.getElementsByClassName("productImage")[currentImage].style="display: none;";
    document.getElementsByClassName("productImage")[n].style="display: block;";
    currentImage=n;
}