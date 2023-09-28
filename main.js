const poke_container = document.getElementById('poke_container')
const pokemons_number = 1110
const loading = document.getElementById('loading')

const fetchPokemons = async () => {
    showLoading()
    for (let i = 1;i <= pokemons_number;i++) {
        await getPokemon(i)
    }
    hideLoading()
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
}

function showLoading() {
        loading.style.display = 'block'
    
}
function hideLoading() {
    loading.style.display = 'none'
}

document.querySelector('button').addEventListener('click', () => {
    showLoading()
    poke_container.innerHTML = ''
    let search = document.querySelector('input').value
    if (search.length !== 0) {
        if (Number.isInteger(Number(search))) {
            search = search * 1
            getPokemon(search)
            hideLoading()
            return
        }
    }
    fetchPokemons()
    
})
fetchPokemons()