import { jwtDecode } from "jwt-decode"

// get the token
const ArrayOptions = () => {

        let jwt = jwtDecode(token)

        const options = [
        {
            nome: "Home",
            url: "/homePage"
        },
        {
            nome: "Animais",
            url: "/animais"
        },
        {
            nome: "Consultorio",
            url: "/consultorio"
        },
        {
            nome: "Veterinario",
            url: "/veterinario"
        },
        ]
        return options
}

export default ArrayOptions