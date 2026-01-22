import mongoose from 'mongoose';

const tours = new mongoose.Schema({
name: {
    type: String,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  price: {
    type: Number,
    required: true
  },
  ratingsAverage: {
    type: Number,
    default: 4.0
  },
  duration: {
    type: Number,
    default: 3
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "difficult"],
    default: "easy"
  },
  locations: [
    {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number],
      description: String,
      day: Number
    }
  ]
},
{ timestamps: true }
,{
 toJSON:{ virtuals:true},
 toObject:{ virtuals:true}
 }
);


//Query middleware
tours.post(['updateOne','updateTour','findByIdAndUpdate'], function(){
   this.set({updateAt:new Date()});
})
//virtual properties
tours.virtual('durtionweeks').get(function() {
   return this.duaration/7;
});

export const Tour =mongoose.model('Tour',tours);