class PRODUCTFeatures {
    constructor(query, queryStr) {
      this.query = query;        
      this.queryStr = queryStr;  
    }
  
    // 1. SEARCH
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword }); 
      return this;
    }
  
    // 2. FILTER
    filter() {
        const queryStrCopy = { ...this.queryStr };
      
        const removeFields = ["keyword", "limit", "page"];
        removeFields.forEach((field) => delete queryStrCopy[field]);
      
        // Convert operators like price[gte] -> price: { $gte: value }
        let mongoQuery = {};
      
        Object.keys(queryStrCopy).forEach((key) => {
          if (key.includes("[")) {
            // extract field and operator
            const [field, op] = key.split(/\[|\]/).filter(Boolean);
            if (!mongoQuery[field]) mongoQuery[field] = {};
            mongoQuery[field][`$${op}`] = Number(queryStrCopy[key]); // cast to number
          } else {
            mongoQuery[key] = queryStrCopy[key];
          }
        });
      
        
      
        this.query = this.query.find(mongoQuery);
        return this;
      }
      
  }
  
  module.exports = PRODUCTFeatures;
  