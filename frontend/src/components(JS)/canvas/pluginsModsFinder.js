import * as Genres from "../../game/plugins/export.js"
export function pluginsModsFinder(...props){
    const res = {
        genres:[`all`],
        currentGenre: undefined,
        genresInfos: [],
        loadplugins(genre = `All`){
            this.currentGenre = genre
            this.genresInfos = []
            for(let key in Genres[genre]){
                this.genresInfos.push(Genres[genre][key].prototype.info())
            }
            console.log(this.genresInfos)
            return this
        },
    }
    return res
}