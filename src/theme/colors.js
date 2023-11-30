const colors = {
    black: (opacity = 1) => `rgba(29,31,33, ${opacity})`, // #1D1F21
    darkGray: (opacity = 1) => `rgba(44,46,48, ${opacity})`, // #2C2E30
    gray: (opacity = 1) => `rgba(68,70,72, ${opacity})`, // #444648
    midGray: (opacity = 1) => `rgba(146,146,146, ${opacity})`, // #929292
    lightGray: (opacity = 1) => `rgba(224,224,2241, ${opacity})`, // #E0E0E0
    extraLightGray: (opacity = 1) => `rgba(245,245,245, ${opacity})`, // #F5F5F5
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // #FFFFFF
}
export default colors