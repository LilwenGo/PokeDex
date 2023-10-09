const poke_container = document.getElementById('poke_container')
const loading = document.getElementById('loading')
const pokemons_number = 1010
let pokemonsLoaded = 0
let pokemonsToLoad = 24
let lastYLoad = 0
let inload = false

const fetchPokemons = async () => {
    inload = true
    showElement(loading)
    for (let i = pokemonsLoaded + 1;i <= pokemonsToLoad;i++) {
        await getPokemon(i)
    }
    hideElement(loading)
    inload = false
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokemon = await res.json()
    const search = document.querySelector('input').value
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
            <img src="${sprites.front_default}" alt="${upName}">
        </div>
        <div class="info">
            <span class="number">${id}</span>
            <h4 class="name">${upName}</h4>
            <small class="type">Type: <span>${type}</span></small>
        </div>
    `
    pokemonEl.innerHTML = pokeInnerHTML
    poke_container.appendChild(pokemonEl)
    pokemonsLoaded++
}

function showElement(el) {
    el.style.display = 'block'
}

function hideElement(el) {
    el.style.display = 'none'
}

document.querySelector('button').addEventListener('click', () => {
    showElement(loading)
    poke_container.innerHTML = ''
    let search = document.querySelector('input').value
    if (search.length !== 0) {
        if (Number.isInteger(Number(search))) {
            search = parseInt(search)
            getPokemon(search)
            hideElement(loading)
            return
        } else if (search.length > 2){
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

fetchPokemons()