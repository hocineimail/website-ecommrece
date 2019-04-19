var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    Firstname: {type: String, },
    Lastname: {type: String, },
    Birthday: {type: Date},
    Sexe: {type: String  },
    Address: {type: String, },
    Phone: {type: Number},
    email: { type: String,  unique: true },
    password: { type: String,  },
    createdAt: { type: Date, default: Date.now },
    user:  { type: String,  unique: true },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
});

var noop = function() {};
userSchema.pre("save", function(done) {
 var user = this;
 if (!user.isModified("password")) {
 return done();
 }
 bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
 if (err) { return done(err); }
 bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
 if (err) { return done(err); }
 user.password = hashedPassword;
 done();
 });
 });
});
userSchema.pre("update", function(done) {
     var user = this;
     if (!user.isModified("password")) {
     return done();
     }
     bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
     if (err) { return done(err); }
     bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
     if (err) { return done(err); }
     user.password = hashedPassword;
     done();
     });
     });
    });

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
    });
   };
   userSchema.methods.name = function() {
    return this.displayName || this.email;
   };

   var User = mongoose.model("User", userSchema);
module.exports = User;