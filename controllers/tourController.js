const Tour = require("./../models/tourModel");

exports.aliasTopTour = (req, res, next) =>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
}

exports.getAllTours = async (req, res) => {
  try{
    const queryObj = {...req.query};
    const excludeFields = ['page', 'sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const query = await Tour.find(JSON.parse(querStr)); 
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join('');
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-createdAt');
    }

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select();
    }else {
      query = query.select('-__v')
    } 

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page -1 ) * limit;

    //page=3&limit=10, page 1, 11-20, page2, 21-30 page 3
    query = query.skip(skip).limit(limit);  

    if(req.query.page){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist')
    }

    const tours = await query;

  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours
    }
  });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message: err
    })
  }
};

exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status:'success',
      data:{
        tour
      }
    })
  } catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
};

exports.createTour = async (req, res) => {
  try{
// const newTour = new Tour({})
  // newTour.save()
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }  
  });
  } catch(err){
    res.status(400).json({
      status:'fail',
      message:'Invalid data sent!'
    })
  }
};

exports.updateTour = async (req, res) => {
  try{
   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators:true
    })
    res.status(200).json({
    status: "success",

    data: {
      tour
    },
  })
  }catch(err){
    res.status(400).json({
      status:'fail',
      message:'Invalid data sent!'
    })
  }
};

exports.deleteTour = async (req, res) => {
 try{
  await Tour.findByIdAndDelete(req.params.id);
   res.status(204).json({
    status: "success",
    data: null,
  });
 }
 catch(err){
    res.status(400).json({
      status:'fail',
      message:'Invalid data sent!'
    })
  }
};
