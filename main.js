const poke_container = document.getElementById('poke_container')
const poke_info = document.getElementById('poke_info')
const croix = document.getElementById('croix')
const loading = document.getElementById('loading')
const pokemons_number = 1010
let pokemonsLoaded = 0
let pokemonsToLoad = 24
let lastYLoad = 0
let inload = false
let names = []
loadNames()

async function loadNames () {
    for(let i = 1;i < 1011;i++) {
        const url = `Names.json`
        const res = await fetch(url)
        const pokemon = await res.json()
        names = pokemon
    }
}

const fetchPokemons = async () => {
    inload = true
    showElement(loading, "block")
    for (let i = pokemonsLoaded + 1;i <= pokemonsToLoad;i++) {
        await getPokemon(i)
    }
    hideElement(loading)
    inload = false
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokemon = await res.json()
    let search = document.querySelector('input').value
    search = search.toLowerCase()
    if (Number.isInteger(Number(search)) || pokemon.name.toLowerCase().includes(search)) {
        createPokemonCard(pokemon)
    }
}

const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div')
    pokemonEl.classList.add('pokemon')
    const {id, name, sprites, types} = pokemon
    const upName = name.toUpperCase()
    const type = types[0].type.name
    const pokeInnerHTML = `
        <div class="img-container">
            <img src="${sprites.front_default}" alt="Image ${upName}">
        </div>
        <div class="info">
            <span class="number">${id}</span>
            <h4 class="name">${upName}</h4>
            <small class="type">Type: <span>${type}</span></small>
        </div>
    `
    pokemonEl.innerHTML = pokeInnerHTML
    pokemonEl.setAttribute('id', id)
    poke_container.appendChild(pokemonEl)
    pokemonEl.addEventListener("click", showPokemonInfo)
    pokemonsLoaded++
}

async function showPokemonInfo() {
    inload = true
    showElement(poke_info, "flex")
    showElement(loading, "block")
    showElement(croix, "block")
    const id = this.getAttribute('id')
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokemon = await res.json()
    const {name, sprites, types, stats} = pokemon
    const upName = name.toUpperCase()
    const type1 = types[0].type.name
    let type2 = ""
    if(types[1]) {
        type2 = types[1].type.name
    } else {
        type2 = "none"
    }
    poke_info.innerHTML = `
    <div class="poke_imgs">
        <div class="img-container">
            <img src="${sprites.front_default}" alt="Image ${upName}" title="Image pokemon">
        </div>
        <div class="img-container">
            <img src="${sprites.front_shiny}" alt="Image ${upName} shiny" title="Image pokemon Shiny">
        </div>
    </div>
    <div class="info">
        <h2 class="name">${upName}</h2>
        <span class="number">${id}</span><br>
        <h4 class="type">Type 1: <span>${type1}</span></h4>
        <h4 class="type">Type 2: <span>${type2}</span></h4>
    </div>
    <div class="stats_container">
    </div>
`
    for(let i = 0;i < stats.length;i++) {
        let stat = document.createElement("div")
        stat.classList.add("stat")
        stat.innerHTML = `
        <p>${stats[i].stat.name.toUpperCase()}:</p>
        <div class="stat_graph" style="width:${stats[i].base_stat * 2}px;"><p style="margin:0; font-size: large;">${stats[i].base_stat}</p></div>`
        document.querySelector(".stats_container").appendChild(stat)
        if(stats[i].base_stat >= 100) {
            document.querySelectorAll(".stat_graph")[i].style.backgroundColor = "greenyellow"
        } else if(stats[i].base_stat >= 80) {
            document.querySelectorAll(".stat_graph")[i].style.backgroundColor = "yellow"
        } else if(stats[i].base_stat >= 60) {
            document.querySelectorAll(".stat_graph")[i].style.backgroundColor = "orange"
        } else if(stats[i].base_stat < 60) {
            document.querySelectorAll(".stat_graph")[i].style.backgroundColor = "red"
        }
    }
}

function showElement(el, dspl) {
    el.style.display = dspl
}

function hideElement(el) {
    el.style.display = "none"
}

const recherche = document.querySelector('#rechercher').addEventListener('click', () => {
    showElement(loading, "block")
    poke_container.innerHTML = ''
    let search = document.querySelector('input').value
    if (search.length !== 0) {
        if (Number.isInteger(Number(search))) {
            search = parseInt(search)
            getPokemon(search)
            hideElement(loading)
            return
        } else if (search.length > 2){
            search = search.toLowerCase()
            getPokemon(search)
            hideElement(loading)
            return
        }
    }
    pokemonsLoaded = 0
    pokemonsToLoad = 24
    lastYLoad = 0
    fetchPokemons()
})

const scrollListner = window.addEventListener('scroll', () => {
    if(window.scrollY - lastYLoad >= 180 && pokemonsLoaded <= pokemons_number && !inload) {
        lastYLoad = window.scrollY
        if(pokemonsToLoad + 6 >= pokemons_number) {
            for(let f = 0;f <= 6;f++) {
                if(pokemonsToLoad + 1 <= pokemons_number) {
                    pokemonsToLoad++
                }
            }
        } else {
            pokemonsToLoad += 6
        }
        fetchPokemons()
    }
})

const croixclick = croix.addEventListener('click', () => {
    hideElement(poke_info)
    hideElement(loading)
    hideElement(croix)
    inload = false
    poke_info.innerHTML = ''
})

const autocomplete = document.querySelector("#recherche").addEventListener('keyup', (e) => {
    let rechercher = document.querySelector("#recherche")
    let autoselect = document.querySelector("#autocomplete")
    let options = []
    if(rechercher.value.match(/^([A-Za-z\\-]+)$/) && !parseInt(rechercher.value)) {
        autoselect.innerHTML = ""
        showElement(autoselect, "block")
        for(let i = 0;i < names.length;i++) {
            if(names[i].includes(rechercher.value)) {
                let option = document.createElement("option")
                option.innerHTML = names[i]
                options.push(option)
                option.setAttribute("value", names[i])
                autoselect.appendChild(option)
            }
            autoselect.setAttribute("size", options.length)
        }
    } else {
        autoselect.innerHTML = ""
        hideElement(autoselect)
    }
})

fetchPokemons()