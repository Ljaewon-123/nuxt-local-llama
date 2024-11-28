// connection mongodb
import mongoose from 'mongoose'

export default async() => {

  const config = useRuntimeConfig()

  try{
    const dbOptions = {
      dbName: config.dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    await mongoose.connect( config.dburl, dbOptions)
    console.log('connected successfully...')
  }
  catch (e){
    console.error(e)
    throw createError({
      status: 500,
      message: 'MongoDB server error'
    })
  }
}