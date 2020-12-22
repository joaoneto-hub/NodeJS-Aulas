const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
require("../models/categoria");
const Categoria = mongoose.model("Categoria")
require("../models/postagens")
const Postagem = mongoose.model("Postagem")

router.post('/',(req, res) => {
     res.send("Pagina principal")
});

router.get('/posts',(req, res)=>{
    res.render()
});

//Rota de de Listar dados do formulario 
router.get('/categorias', (req,res, next)=>{
    Categoria.find().sort({date:'desc'}).then((Categoria)=>{
        res.render("admin/categorias", {Categoria: Categoria})
}).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as categorias")
    res.redirect("/admin")
    next()
})
});    

//Rota de validar o formulario
router.post('/categorias/nova', (req, res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome Invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"Slug Invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da Categoria e muito pequeno!"})

    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{

        const  novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao tentar salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }   
});

//Rota de editar as categorias
router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((Categoria)=>{
        res.render("admin/editcategorias", {Categoria: Categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    });

});

router.post("/categorias/edit", (req, res)=>{
    Categoria.findOne({_id:req.body.id}).then((Categoria)=>{

        Categoria.nome = req.body.nome
        Categoria.slug = req.body.slug

        Categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao salvar a categoria!")
            res.redirect("/admin/categorias")
        });

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro a editar a categoria!")
        res.redirect("/admin/categorias")
    });
});

router.post("/categorias/deletar", (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get('/categorias/add',(req, res)=>{
    res.render("admin/addcategorias")
});

router.get("/postagem", (req,res) => {
Postagem.find().populate("categoria").then((Postagem)=>{
    res.render("admin/postagem", ({postagem: Postagem}))
}).catch((err)=>{
    req.flash("error_msg", "Houve um erro ao listar as postagens")
    res.redirect("/admin");
})

})
router.get("/postagem/add", (req,res)=>{
    Categoria.find().then((Categoria)=>{
        res.render("admin/addpostagem", {Categoria: Categoria})
    }).catch((err)=>{
        res.flash("error_msg", "Erro ao carregar formulario")
        res.redirect("/admin")
    })
    
})

router.post("/postagem/nova", (req,res)=>{

    var error = []

        if(req.body.Categoria == "0"){
            error.push({texto: "Categoria invalida, resgistre uma categoria"})
        }

        if(error.length > 0 ){
            res.render("admin/addpostagem", {error: error})

        }else{
            const novaPostagem = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                slug: req.body.slug
            }
            new Postagem (novaPostagem).save().then(()=>{
                req.flash("success_msg" , "Postagem criada com sucesso!")
                res.redirect("/admin/postagem")
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro durante o salvameto da postagem")
                res.redirect("/admin/postagem")
            })
        }

})
router.get("/postagem/edit/:id", (req,res)=>{ /// rota que edita postagem fazendo duas buscas no mongoo

    Postagem.findOne({_id: req.params.id}).then((Postagem)=>{ //Primeira busca //

        Categoria.find().then((Categoria)=>{

            res.render("admin/editpostagem", ({Categoria: Categoria, Postagem: Postagem}))

        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagem")
        })

    }).catch((err)=>{
        req.flash("error_msg", "Houvve um erro ao carregar o formuario")
        res.redirect("/admin/postagem")
    })

})
//Rota que edita Postagem
router.post("/postagem/edit", (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((Postagem)=>{

        Postagem.titulo = req.body.titulo,
        Postagem.slug = req.body.slug,
        Postagem.descricao = req.body.descricao,
        Postagem.conteudo = req.body.conteudo,
        Postagem.categoria = req.body.categoria

        Postagem.save().then(()=>{
                req.flash("success_msg", "Postagem salva com sucesso!")
                res.redirect("/admin/postagem")
        }).catch((err)=>{
            req.flash("error_msg", "Erro interno ao editar a categoria")
            res.redirect("/admin/postagem")
        })

    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao editar a postagem")
        res.redirect("/admin/postagem")

});
});

//Rota de deletar postagem
router.get("/postagem/deletar/:id", (req, res)=> {
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg" ,"Postagem deletada com sucesso")
        res.redirect("/admin/postagem")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro internno ao deltar as postagens!")
        res.redirect("/admin/postagem")
    })
})

module.exports = router;