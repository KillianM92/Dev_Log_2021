module.exports = {
  makeid,
}

function makeid(length) {     // Fonction qui crée le code de jeu aléatoirement avec les caractères présents dans la variable 'characters'
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&~#{[-|_@]=+-*€¤£$µ%§!:/?';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
