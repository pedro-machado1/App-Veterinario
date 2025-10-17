const ArrayOptions = (User) => {
    let options
    
    if (User.User.cliente) { 
        options = [
            {
                nome: "Home",
                url: "/home"
            },
            {
                nome: "Animais",
                url: "/animal"
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
    }
    else if (User.User.veterinario) { 
        options = [
            {
                nome: "Home",
                url: "/home"
            },
            {
                nome: "Clientes",
                url: "/cliente"
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
    }
    else if (User.User.consultorio) { 
        options = [
            {
                nome: "Home",
                url: "/home"
            },
            {
                nome: "Clientes",
                url: "/cliente"
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
    }
    return options
}

export default ArrayOptions