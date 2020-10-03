const route = (app,repo)=>{
    const prefix = "/api/v1/books"
    const {authorize} = require("../middlewares/role-access-middleware")

    app.get(prefix + "/mylist",authorize('user'), async (req,res)=>{
        try {
            const d = await repo.getmybooks(req.user._id)
            res.status(200).json({success:true,data:d})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })

    app.get(prefix + "/:id?",authorize('user','admin'), async (req,res)=>{
        console.log(req.user)
        try {
            let d = null;
            console.log(req.params.id)
            if(req.params.id){
                d = await repo.getbook(req.params.id)
            } else{
                d = await repo.getallbook()
            }
            console.log(d)
            res.status(200).json({success:true,data:d})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })

    app.delete(prefix + "/:id",authorize('admin'), async (req,res)=>{
        try {
            console.log("Delete",req.params.id)
            const d = await repo.deletebook(req.params.id)
            res.status(200).json({success:true})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })

    app.post(prefix + "/",authorize('admin'), async (req,res)=>{
        try {
            const d = await repo.addbook(req.body)
            console.log(d)
            res.status(200).json({success:true,data:d})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })

    app.put(prefix + "/:id",authorize('admin'), async (req,res)=>{
        try {
            console.log(req.params.id)
            const d = await repo.updatebook(req.params.id,req.body)
            res.status(200).json({success:true})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })

    app.post(prefix + "/borrow/:id",authorize('user'), async (req,res)=>{
        try {
            const d = await repo.borrowbook(req.user._id, req.params.id)
            console.log(d)
            res.status(200).json({success:true,data:d})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })
    
    app.post(prefix + "/return/:id",authorize('user'), async (req,res)=>{
        try {
            const d = await repo.returnbook(req.user._id, req.params.id)
            console.log(d)
            res.status(200).json({success:true,data:d})
        } catch(err){
            res.status(400).json({success:false,error:err})
        }
    })
}

module.exports = route