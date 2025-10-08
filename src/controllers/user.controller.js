import uploadData from "../middleware/dataUploader.js";

export default class UserController{

  async uploadUserData(req, res){
    try {
      const { uploadedData, errors } = await uploadData();
  
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Data upload completed with errors.',
          errors,
          uploadedData,
          status:400,
          success: true
        });
      }
  
      res.status(200).json({
        data: uploadedData,
        message: 'Data successfully uploaded.',
        status: 200,
        success: true
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status:500,
        success: false
      });
    }
  }
}