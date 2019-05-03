'use strict';

const express = require("express");
const client = express.Router();
const Lists = require("../../models/lists");
const async = require('async')
const Produit = require("../../models/produit")
const flash = require("connect-flash"); 

client.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
   })
   
client.get("/Compte",(req,res)=> {
    res.render('Client/compteClient')
})

client.post("/update/achat/:_id" ,(req, res) => {
  
    Lists.findOne({user: req.user._id, _id: req.params._id}, (err, Update) => {
        console.log(Update)
 
        if (Update) {
            Update.Quantite = req.body.Quantite;
            Update.save();
            req.flash("info", "Updating ");
            res.redirect("/List/achats")
        } else  { 
        req.flash("error", "ce User existe");
        res.redirect("/List/achats")}
    })
})
client.get("/List/achats",(req,res)=> {
    Lists.find({user: req.user._id}).populate({path: 'produit', populate: {path: 'image'} }).exec((err, lists) => {
        if (lists) {
           res.render('Client/itemProduit', {List: lists})
       }
    })
   
})
client.get("/D", (req,res) => {
    Lists.remove({}, (err, deletee) => {
        if (deletee) {
           console.log('suprimi')
        }
    })
    res.redirect("/")
    
})
client.post("/AddToList", async  (req, res) => {
    const produit = await Lists.findOne({Paye: false, produit: req.body._id, user: req.user._id})
    Lists.find({}, (err, ress ) => {
        console.log(ress)
    })
    if (produit) {
        Lists.findOne({Paye: false, produit: req.body._id, user: req.user._id}, (err, Exist) => {
            console.log(Exist)
            const Quantite =  parseInt(Exist.Quantite);
            Exist.Quantite =  Quantite + parseInt(req.body.Quantite);
            Exist.save();
            console.log(Exist)
            return
        })     
    } else  {
        const AddTList = new Lists({
            Quantite: req.body.Quantite,      
            produit: req.body._id,
            user: req.user._id   
        });AddTList.save((err, siccess) => {
            if (!siccess) {
                console.log("not saving")
            }
        })
    }


})
module.exports = client;