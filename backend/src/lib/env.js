import "dotenv/config";
export const ENV = 
{
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET    
};
//PORT=3000
//MONGO_URI=mongodb+srv://johnathanabraham0_db_user:7EDHY1stJh6GTRQD@cluster0.xxb4d3s.mongodb.net/chat_db?appName=Cluster0
//NODE_ENV=development
//JWT_SECRET=myjwtsecret
//RESEND_API_KEY=re_at2Fhhdx_KNbMWheGDY9aAqGqBWnN8hX5
//EMAIL_FROM_NAME="Johnathan Abraham"
//EMAIL_FROM="onboarding@resend.dev"
//CLIENT_URL=http://localhost:5173