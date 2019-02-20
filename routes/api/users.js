const   express     = require('express');
const   router      = express.Router(),
        db          = require('../../config/connection'),
        jwt         = require('jsonwebtoken'),
        secret      = require('../../config/secret'),
        passport    = require('passport');

// Loading Input Validation
const validateRegisterInput = require('../../validation/register');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req,res)=>
    res.json({
        msg: "Users Works"
    })
);

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res)=>{
    const {errors, isValid } = validateRegisterInput(req.body);

    //Check for validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    let email = db.escape(req.body.email);
    let firstname = db.escape(req.body.firstname);
    let lastname = db.escape(req.body.lastname);
    let password = db.escape(req.body.password);
    console.log(email,firstname,lastname,password);
    let sql = "Select * from users where email="+email;
    db.query(sql, function(err, result) {
        console.log(result);
        if(result.length>0){
            console.log(result);
            console.log("User already exists");
        }
        else{
            sql = "Insert into users values ("+firstname+", "+ lastname + ", "+ email + ", PASSWORD("+ password + "))";
            db.query(sql, function(err, result) {
                if(result){
                    console.log(result);
                } else if(err) {
                    console.log(err);
                }
            })
            
        }
    })

})


// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/login', (req,res) => {
    let email = db.escape(req.body.email);
    let password = db.escape(req.body.password);

    let sql = "SELECT * from users where email = "+ email;
    db.query(sql, (err, result) => {
        if(result.length < 1 )
            res.status(404).json({email: 'User not found'});
        else{
        sql = "SELECT * from users where email="+ email + " and password = password("+password+")"; 
        db.query(sql, (err, result)=> {
            if (err) return res.send(err);
            else if(result.length>0){ 
                // User found
                // res.json({msg: "Successfully logged in"})
                const payload = {
                    firstname: result[0].firstname, 
                    lastname: result[0].lastname, 
                    email: result[0].email
                }
                jwt.sign(
                    payload, 
                    secret.secretOrKey, 
                    {expiresIn: 3600},
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    } 
                    );
            }
            else if(result.length<1){
                res.json({msg: "Password incorrect"});
            } 
            }
        )}
        
    })
})


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req,res)=>{
    res.json({
        firstname: req.user[0].firstname,
        lastname: req.user[0].lastname,
        email: req.user[0].email
    });
});

module.exports = router;