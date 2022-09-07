class ApiFeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }
    search(){
        const keyword=this.queryStr.keyword?{
            name:{$regex:this.queryStr.keyword,
            $options:"i"}
        }:{}
        this.query=this.query.find({...keyword})
        // console.log(this.queryStr)
        return this
    }

   filter(){
    const queryCopy={...this.queryStr}
        // console.log(this.queryStr)
        let removedata=["keyword","page"]
        removedata.forEach(key=>delete queryCopy[key])
        // console.log(this.queryStr)
        let q=JSON.stringify(queryCopy)
        q=q.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`)
        this.query=this.query.find(JSON.parse(q))
        // console.log(JSON.parse(q))
        return this
    }
    pagination(perPage){
      const currentPage=(this.queryStr.page) // 3
      const skip=perPage*(currentPage-1) // 10*(3-1 ) => 20
      this.query=this.query.limit(perPage).skip(skip)
      return this
    }
}

module.exports=ApiFeatures









