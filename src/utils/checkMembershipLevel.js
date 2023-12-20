export const checkMembershipLevel = (point) => {
    if (point < 2000){
        return "Silver Member"
    }else if(point < 4000){
        return "Gold Member"
    }else if(point < 6000){
        return "Platinum Member"
    }else{
        return "Diamond Member"
    }
}