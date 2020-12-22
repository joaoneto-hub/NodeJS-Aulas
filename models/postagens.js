const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Postagens = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    }, 
    categoria:{
        
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    conteudo:{
        type: String,
        required: true
    }
});
mongoose.model("Postagem", Postagens);