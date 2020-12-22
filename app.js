const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyParse = require("body-parser");
const app = express();
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require('express-session');
const flash = require("connect-flash")
require("./models/postagens")
const Postagem  = mongoose.model("Postagem")

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const router = require('./routes/admin');

//Configurações 
    //sessão
    app.use(session({
        secret:"curso",
        resave: true,
        saveUninitialized: true
}))
    //configurando o Flash 
    app.use(flash())

    // Variavel para mostrar mensagens de sucesso e erro dentro de todo o sistema

    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //body parser 
    app.use(bodyParse.urlencoded({extended: true}))
    app.use(bodyParse.json())
    app.use(express.static('public'));

    //Handlebars
    app.engine('handlebars', exphbs({
        
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }));
    app.set('view engine', 'handlebars');

    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/BlogApp").then(()=>{
        console.log("Conectado ao Mongo")
        }).catch((err)=>{
            console.log("Não Conectou", +err)
        })
    // public 

app.use(express.static(path.join(__dirname,"public"))) /// Mostrando a pasta do bootstrap 


//Rotas Chmando o grupo de rotas de routers....
app.use('/admin', admin);

app.get("/", (req, res)=>{
    Postagem.find().populate("Categoria").sort({data:"desc"}).then((Postagem)=>{
        res.render("index", {postagem: Postagem})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
    
})

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((Postagem)=>{
        if(Postagem){
            res.render("postagem/index", {Postagem: Postagem})
            
        }else{
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
        }
    }).catch((err)=>{
        req.flalsh("error_msg", "Houve um erro interno!")
        res.redirect("/")
    })
})

app.get("/404", (req,res)=>{
    res.send("Erro 404!!!")
})

//Outras 



//Porta
app.listen(3333)