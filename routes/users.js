const route = (app,repo)=>{
    const prefix = "/api/v1/users";
    
    app.post(prefix + "/register/", async (req,res)=>{
        try {
            const query = await repo.register(req.body.email,req.body.password)
            res.status(201).json({success:true,data:query})
        }catch(error) {
            res.status(400).json({success:false,error:error})
        }
    })

    app.post(prefix + "/login/", async (req,res)=>{
        try {
            const query = await repo.login(req.body.email,req.body.password)
            res.status(200).json({success:true,data:query})
        }catch(error) {
            res.status(400).json({success:false,error:error})
        }
    })

    app.post(prefix + "/newtoken/", async (req,res)=>{
        try {
            const query = await repo.newToken(req.body.email,req.body.refreshToken)
            res.status(200).json({success:true,data:query})
        }catch(error) {
            res.status(400).json({success:false,error:error})
        }
    })
}

module.exports = route