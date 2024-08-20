const Characters = require("../models/characters.model");

const getCharacters = async (req, res) => {
    try {
        //http://localhost:3500/characters?pag=5&limit=10
        let pag = parseInt(req.query.pag)
        let limit = parseInt(req.query.limit)
        const numCharacters = await Characters.countDocuments()
        pag = !isNaN(pag) ? pag : 1;
        limit = !isNaN(limit) ? limit : 5; // limite por defecto
        console.log(pag, limit)

        let numPage = Math.ceil(numCharacters / limit)

        if (pag > numPage) {
            pag = numPage;
        }
        if (pag < 1) {
            pag = 1
        }

        /*
            pag=1;
            limit = 10
            20--> pagina 2
        +*/
        const allCharacters = await Characters.find().skip((pag - 1) * limit).limit(limit)
        //skip--> descarto los elementos que no estan en la pagina indicada
        //limit, solo devuelco la cantidad definida en el limit.

        res.json({
            previewPage: pag === 1 ? null : pag - 1,
            nextPage: numPage >= pag + 1 ? pag + 1 : null,
            data: allCharacters
        })
    } catch (error) {
        res.json(error)
    }
}

module.exports = { getCharacters }